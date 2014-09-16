var equal      = require('deep-equal'),
    _          = require('lodash'),
    gengisKhan = exports;

/*
 * Dispatch to the handlers
 */
var dispatchTable = {
  '$ne' : $ne,
  '$all': $all,
  '$in' : $in,
  '$nin': $nin
};

function $ne(objectField, subQuery) {
  return !equal(objectField, subQuery);
}

function $all(objectField, subQuery) {
  return _.every(subQuery, function(subQueryValue) {
    if(subQueryValue instanceof RegExp) {
      return _.any(objectField, function(element) {
        return subQueryValue.test(element);
      });
    }

    return ~objectField.indexOf(subQueryValue);
  });
}

function $in(objectField, subQuery) {
  return _.any(subQuery, function(subQueryValue) {
    if(subQueryValue instanceof RegExp) {
      return _.any(objectField, function(element) {
        return subQueryValue.test(element);
      });
    }

    return ~objectField.indexOf(subQueryValue);
  });
}

function $nin(objectField, subQuery) {
  return _.every(subQuery, function(subQueryValue) {
    if(subQueryValue instanceof RegExp) {
      return _.every(objectField, function(element) {
        return !subQueryValue.test(element);
      });
    }

    return !~objectField.indexOf(subQueryValue);
  });
}

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

      if(queryValue instanceof RegExp)
        return queryValue.test(object[queryKey]);

      return equal(queryValue, object[queryKey]);
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

