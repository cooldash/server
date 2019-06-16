export const getField = (type, name) => {
  const field = name.split('.').reduce((f, n) => (f ? f.type.class.getField(n) : type.getField(n)), null);
  return field;
};
