
const traverseTree = (node, cb) => {
  if (!node) throw new Error('no starting node');
  cb(node);
  node.getChildren().forEach(child => traverseTree(cb, child));
};

export default traverseTree;
