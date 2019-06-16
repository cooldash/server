export default function filterFieldsByType (type, fieldType) {
  if (!type)
    return [];

  if (!type.getFields)
    return [];

  return type.getFields().filter(field => field.type.class === fieldType);
}
