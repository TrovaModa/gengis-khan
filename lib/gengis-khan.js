var equal      = require('deep-equal'),
    _          = require('lodash'),
    gengisKhan = exports;

function $all(objectField, subQuery) {

}

var dispatchTable = {
  '$all': $all,
};

function parseSpecial(objectField, subQuery) {
  return _.every(subQuery, function(subQueryValue, subQueryKey) {
    if(dispatchTable[subQueryKey])
      return dispatchTable[subQueryKey](objectField, subQuery[subQueryKey]);

    throw new Error('Unknown symbol ' + subQueryKey);
  });
}

function filterWithQuery(query) {
  return function(object) {
    var matches = true;

    return _.every(query, function(queryValue, queryKey) {

      if(typeof value === 'object') {
        return parseSpecial(object[queryKey], queryValue);
      }

      return equal(query[queryKey], object[queryKey]);
    });
  };
}

gengisKhan.match = function(objects, query) {
  if(typeof query === 'string') {
    /*
     * XXX: Yes, it's dumb. No, no way around it.
     *      Keep hatin' ◕ ◡ ◔
     */
    eval('query = ' + query);
  }

  return objects.map(filterWithQuery(query));
};

