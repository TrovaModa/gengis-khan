var equal      = require('deep-equal'),
    gengisKhan = exports;

function $all(objectField, subQuery) {

}

var dispatchTable = {
  '$all': $all,
};

function parseSpecial(objectField, subQuery) {
  var matches = true;
  Object.keys(subQuery).forEach(function(subQueryKey) {
    if(dispatchTable[subQueryKey]) {
      if(!dispatchTable[subQueryKey](objectField, subQuery[subQueryKey]))
        matches = false;
      return;
    }
    throw new Error('Unknown symbol ' + subQueryKey);
  });

  return matches;
}

function filterWithQuery(query) {
  return function(object) {
    var matches = true;

    Object.keys(query).forEach(function(queryKey) {
      var queryValue = query[queryKey];

      if(typeof value === 'object') {
        if(!parseSpecial(object[queryKey], queryValue))
          matches = false;
        return;
      }

      if(!equal(query[queryKey], object[queryKey]))
        matches = false;
    });

    return matches;
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

