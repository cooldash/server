import { Mongo } from 'meteor/mongo';

const collections = {};

function getCollection(colName, href = '') {
  const cacheName = `${href}/${colName}`;
  const exists = collections[cacheName];
  if (exists) return exists;

  let collection;
  if (href) {
    const database = new MongoInternals.RemoteCollectionDriver(href);
    collection = new Mongo.Collection(colName, {
      _driver: database,
      _suppressSameNameError: true,
    });
  } else {
    collection = new Mongo.Collection(colName);
  }

  collections[cacheName] = collection;
  return collection;
}

export default getCollection;
