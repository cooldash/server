// Deny all client-side updates since we will be using methods to manage this collection
export default Col => (Col.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
}), Col);
