class MongoCounter {
    constructor (col, counterName) {
        this._col = col;
        this._name = counterName;
    }

    increment () {
        const counter = this._col.findAndModify({
            query: { name: this._name },
            update: { $inc: { value: 1 } },
            upsert: true,
            new: true,
        });

        return counter.value.value;
    }
}

MongoCounters = {
    _collection: new Mongo.Collection('counters'),

    createCounter: function (name) {
        return new MongoCounter(this._collection, name);
    }
};
MongoCounters._collection._ensureIndex({ name: 1 });
