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

/*
 * Same as MongoDB, check reference
 */

function $ne(objectField, subQuery) {
  return !equal(objectField, subQuery);
}

/*
 * Same as MongoDB, check reference
 */

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

/*
 * Same as MongoDB, check reference
 */

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

/*
 * Same as MongoDB, check reference
 */

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

/*
 * Dispatches the special symbol (with `$`) to the appropriate
 * function using the `dispatchTable`, otherwise throw an Error
 *
 * @param {Object} Field of the object we want to match
 * @param {Object} Sub-query containing the `$` key
 * @api private
 */

function parseSpecial(objectField, subQuery) {
  return _.every(subQuery, function(subQueryValue, subQueryKey) {
    if(dispatchTable[subQueryKey])
      return dispatchTable[subQueryKey](objectField, subQuery[subQueryKey]);

    throw new Error('Unknown symbol ' + subQueryKey);
  });
}

/*
 * Returns a closure which filters the object according
 * to the query.
 *
 * @param {Object} Query to run
 * @api private
 */

function filterWithQuery(query) {
  return function(object) {
    /* Make sure everything matches */
    return _.every(query, function(queryValue, queryKey) {

      /*
        If it's an Array, skip. If any of the keys of the query
        contain `$`, it's a reserved key, so dispatch to `parseSpecial`.
      */
      if(
        !Array.isArray(queryValue) &&
        _.any(queryValue, function(_, queryValueKey) {
          return ~queryValueKey.indexOf('$');
        })

      ) {
        return parseSpecial(object[queryKey], queryValue);
      }

      /* RegExp is evaluated by itself, otherwise use deep equal */
      if(queryValue instanceof RegExp)
        return queryValue.test(object[queryKey]);

      return equal(queryValue, object[queryKey]);
    });
  };
}

/*
 * Matches the list of objects with the provided query,
 * returns the list of objects matching said query.
 *
 * @param {Array, Object} List of objects to match
 * @param {Object, String} Query to run
 * @api public
 */

gengisKhan.match = function(objects, query) {
  if(!Array.isArray(objects)) { objects = [objects]; }
  if(typeof query === 'string') {
    /*
     * XXX: Yes, it's dumb. No, no way around it.
     *      Keep hatin' ◕ ◡ ◔
     */
    eval('query = ' + query);
  }

  /* Filter the objects */
  var res = objects.filter(filterWithQuery(query));
  return res.length === 0 ?
    null :
    res  ;
};

