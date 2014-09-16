var equal      = require('deep-equal'),
    _          = require('lodash'),
    gengisKhan = exports;

function $all(objectField, subQuery) {
  return _.every(subQuery, function(subQueryValue) {
    return ~objectField.indexOf(subQueryValue);
  });
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
    return _.every(query, function(queryValue, queryKey) {

      if(
        !Array.isArray(queryValue) &&
        _.any(queryValue, function(_, queryValueKey) {
          return ~queryValueKey.indexOf('$');
        })

      ) {
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

  var res = objects.filter(filterWithQuery(query));
  return res.length === 0 ?
    null :
    res  ;
};

