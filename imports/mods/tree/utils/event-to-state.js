export const eventToState = (e, key, comp) => {
  if (!e) return;
  const res = {};
  res[key] = e.getDoc();
  comp ? comp.setState(res) : this.setState(res);
};
