Tinytest.add('example', function (test) {
    var testCounter = MongoCounters.createCounter('test' + Random.id(), Random.id());


    test.equal(testCounter.increment(), 1);
    test.equal(testCounter.increment(), 2);
    test.equal(testCounter.increment(), 3);
    test.equal(testCounter.increment(), 4);
    test.equal(testCounter.increment(), 5);
    test.equal(testCounter.increment(), 6);
});
