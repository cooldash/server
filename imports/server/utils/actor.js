import { dispatch, spawn, stop } from 'nact';
import pick from 'lodash/pick';
import { warn } from '../../utils/log';

function path(ref) {
  return ref.path.parts.join(' -> ');
}

class Actor {
  data = {};
  actor = null;

  async receive(msg, ctx, state) {
    const func = this[`msg_${msg.type}`];

    if (!this.actor) {
      warn('actor stopped', path(ctx.self), 'msg received', pick(msg, 'data', 'type')``);
      return null;
    }

    if (func) {
      this.data = state;
      this.ctx = ctx;
      const result = await func.call(this, msg.data, ctx, msg);
      // XXX sometimes it called before method ends.
      // this.ctx = undefined;
    } else {
      warn('unknown message type', path(ctx.self), msg.type);
    }
    if (!this.actor)
      return null;

    return this.data;
  }

  stop() {
    if (!this.actor)
      this.dispatch(this.ctx.parent, { type: 'childStopped', data: this.actor });

    stop(this.actor);
    this.actor = null;
  }

  stopped() {
    return !this.actor;
  }

  /**
   * dispatch for one child
   * @param child
   * @param type
   * @param data
   */
  dispatch(child, type, data) {
    const msg = typeof type === 'object' ? type : { type, data };
    return dispatch(child, msg, this.actor);
  }

  /**
   * Dispatch message for every children
   * @param type
   * @param data
   */
  dispatchChildren(type, data) {
    const msg = typeof type === 'object' ? type : { type, data };
    this.ctx.children.forEach(c => dispatch(c, msg, this.ctx.self));
  }

  passToChildren(type) {
    this[`msg_${type}`] = (data, ctx, msg) => {
      this.dispatchChildren(msg);
    };
  }
  passToParent(type) {
    this[`msg_${type}`] = (data, ctx, msg) => {
      this.dispatch(ctx.parent, msg);
    };
  }
}

export const spawnActor = (parent, actorObj, id, params = {}) => {
  const { init, onCrash, ...other } = params;
  other.onCrash = typeof onCrash === 'string' ?
    (msg, error, ctx) => {
      warn('NACT', 'Actor crashed', error);
      return ctx[onCrash];
    } :
    onCrash;


  const actor = spawn(
    parent,
    (state = actorObj.data, msg, ctx) => actorObj.receive(msg, ctx, state),
    id,
    other,
  );
  actorObj.actor = actor;

  if (init) {
    dispatch(actor, { type: 'init', data: init }, parent);
  }

  return actor;
};

Actor.spawnActor = spawnActor;

export default Actor;
