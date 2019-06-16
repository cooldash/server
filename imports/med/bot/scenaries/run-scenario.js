import { scenarios } from './scenario';

export function runScenario(scenario, ctx) {
  const sc = scenarios[scenario];
  if (!sc) {
    console.error('scenario not found', scenario);
    return;
  }

  ctx.session.scenario = scenario;

  // execute reaction
  if (ctx.session.actionId != null && Array.isArray(sc[ctx.session.actionId]))
    if (sc[ctx.session.actionId][1](ctx) === false)
      return;

  ctx.session.actionId = ctx.session.actionId == null ? -1 : ctx.session.actionId;

  ctx.session.actionId++;

  // last one, finished
  if (ctx.session.actionId >= sc.length) {
    delete ctx.session.actionId;
    delete ctx.session.scenario;
    return;
  }

  const act = Array.isArray(sc[ctx.session.actionId]) ? sc[ctx.session.actionId][0] : sc[ctx.session.actionId];
  act(ctx);

  // last one, finished
  if (ctx.session.actionId >= sc.length - 1 && !Array.isArray(sc[ctx.session.actionId])) {
    delete ctx.session.actionId;
    delete ctx.session.scenario;
  }
}
