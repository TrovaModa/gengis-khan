var expect     = require('expect.js'),
    gengisKhan = require('../../');

var stubs = [
  { id: 1, age: 20, name: 'Carl', sports: ['soccer', 'hiking'] },
  { id: 2, age: 30, name: 'Peter', sports: ['swimming', 'skiing'] },
  { id: 3, age: 25, name: 'Sara', sports: ['hiking', 'climbing'] }
];

describe('gengisKhan', function() {
  describe('.match', function() {

    it('should correctly match equality', function() {
      var result;

      result = gengisKhan.match(stubs, { sports: ['soccer', 'hiking'] });

      expect(result).to.be.an(Array);
      expect(result.length).to.eql(1);

      result = gengisKhan.match(stubs, { id: 1 });

      expect(result).to.be.an(Array);
      expect(result.length).to.eql(1);

      result = gengisKhan.match(stubs, { id: /\d/ });

      expect(result).to.be.an(Array);
      expect(result.length).to.eql(3);
    });

    it('should correctly match $all', function() {
      var result;

      result = gengisKhan.match(stubs, { sports: { $all: ['soccer', 'hiking'] } });

      expect(result).to.be.an(Array);
      expect(result.length).to.eql(1);

      result = gengisKhan.match(stubs, { sports: { $all: ['hiking'] } });

      expect(result).to.be.an(Array);
      expect(result.length).to.eql(2);

      result = gengisKhan.match(stubs, { sports: { $all: ['swimming', 'sleeping'] } });

      expect(result).to.eql(null);
    });

    it('should correctly match $in', function() {
      var result;

      result = gengisKhan.match(stubs, { sports: { $in: ['hiking'] } });

      expect(result).to.be.an(Array);
      expect(result.length).to.eql(2);

      result = gengisKhan.match(stubs, { sports: { $in: [/ing/] } });

      expect(result).to.be.an(Array);
      expect(result.length).to.eql(3);

      result = gengisKhan.match(stubs, { sports: { $in: ['hiking', 'sleeping'] } });

      expect(result).to.be.an(Array);
      expect(result.length).to.eql(2);

    });

    it('should correctly match $nin', function() {
      var result;

      result = gengisKhan.match(stubs, { sports: { $nin: ['hiking'] } });

      expect(result).to.be.an(Array);
      expect(result.length).to.eql(1);

      result = gengisKhan.match(stubs, { sports: { $nin: [/ing/] } });

      expect(result).to.eql(null);
    });

    it('should correctly match $ne', function() {
      var result;

      result = gengisKhan.match(stubs, { id: { $ne: 1 } });

      expect(result).to.be.an(Array);
      expect(result.length).to.eql(2);
    });

    it('should correctly match $and', function() {
      var result;

      result = gengisKhan.match(stubs, { $and: [ { id: 2 }, { sports: { $nin: ['hiking'] } } ] });

      expect(result).to.be.an(Array);
      expect(result.length).to.eql(1);
    });
  });
});
