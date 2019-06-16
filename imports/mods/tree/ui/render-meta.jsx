/**
 * Created by kriz on 10/12/16.
 */

import React from 'react';
import { getComponentInfo } from '../base/type-db';
import MetaContext, { Context } from '../base/meta-context';
import { getTypeName } from '../base/get-type-name';
// import { warn } from '../../utils/log';

const RenderMeta = ({
  context,
  node,
  type,
  value,
  meta,
  key,
  def, // = typeContexts.notfound.context.component,
  defaultRender,
  ...props
}) => {
  value = meta || value;
  const typeName = getTypeName(type || value, !type);

  // const onChange = node ?
  //   (values, save) => {
  //     meta.set(values);
  //     if (save === true) node.save();
  //   } :
  //   () => console.warn(`node not specified for meta ${meta} while onChange`);

  const render = rctx => { // render context
    // eslint-disable-next-line no-nested-ternary
    const ctx = (rctx instanceof MetaContext)
      ? rctx.getContext()
      : (typeof rctx === 'string'
        ? rctx.split(' ')
        : rctx);

    const info = getComponentInfo(typeName, ctx);

    let Component;
    if (!info) {
      if (defaultRender) {
        return defaultRender();
      }
      Component = def;
    } else {
      Component = info.component;
      if (info.props) {
        Object.assign(props, info.props);
      }
    }

    if (!Component) {
      console.error('Cant find component for', typeName, 'and context', rctx);
      return null;
    }

    return (
      <Component
        node={node}
        meta={value}
        value={value}
        type={Component.supportType ? type : undefined}
        // onChange={onChange}
        {...props}
        key={key}
        context={ctx}
      />
    );
  };

  if (context) {
    return render(context);
  }

  return (
    <Context.Consumer key={key}>
      {render}
    </Context.Consumer>
  );
};

export default RenderMeta;

export const RenderMetaType = ({ type, ...props }) => {
  const meta = props.node.getMeta(type);
  return RenderMeta({ ...props, meta });
};
export const RenderNode = props => (RenderMeta({ ...props, meta: props.node }));

export function createActions(actions) {
  const names = Object.keys(actions);
  actions.bind = (obj, act) => {
    const ret = {};
    names.forEach(n => ret[n] = actions[n].bind(obj));
    if (act) {
      Object.keys(act).forEach(n => ret[n] = act[n].bind(obj));
    }
    return ret;
  };
  return actions;
}
