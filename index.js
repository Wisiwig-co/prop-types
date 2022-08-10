/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var PropTypes;

if (process.env.NODE_ENV !== 'production') {
  var ReactIs = require('react-is');

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  PropTypes = require('./factoryWithTypeCheckers')(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  PropTypes = require('./factoryWithThrowingShims')();
}

PropTypes.array.type = 'array';
PropTypes.bool.type = 'boolean';
PropTypes.func.type = 'function';
PropTypes.number.type = 'number';
PropTypes.object.type = 'object';
PropTypes.string.type = 'string';
PropTypes.symbol.type = 'symbol';

var arrayOf = PropTypes.arrayOf;
var objectOf = PropTypes.objectOf;
var oneOf = PropTypes.oneOf;
var oneOfType = PropTypes.oneOfType;
var shape = PropTypes.shape;

PropTypes.arrayOf = function(typeChecker) {
  var isArrayOf = arrayOf(typeChecker);

  isArrayOf.type = 'array';

  isArrayOf.data = {
    type: typeChecker.type,
    data: typeChecker.data
  };

  return isArrayOf;
};

PropTypes.objectOf = function(typeChecker) {
  var isObjectOf = objectOf(typeChecker);

  isObjectOf.type = 'object';

  isObjectOf.data = {
    type: typeChecker.type,
    data: typeChecker.data
  };

  return isObjectOf;
};

PropTypes.oneOf = function(expectedValues) {
  var isOneOf = oneOf.apply(null, arguments);

  isOneOf.type = 'oneof';
  isOneOf.data = [];

  for (var i = 0; i < expectedValues.length; i++) {
    isOneOf.data.push(expectedValues[i]);
  }

  return isOneOf;
};

PropTypes.oneOfType = function(arrayOfTypeCheckers) {
  var isOneOfType = oneOfType(arrayOfTypeCheckers);

  isOneOfType.type = 'oneof';
  isOneOfType.data = [];

  var typeChecker, type, data;

  for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
    typeChecker = arrayOfTypeCheckers[i];

    if (!typeChecker) continue;

    type = typeChecker.type;
    data = typeChecker.data;

    switch (type) {
      case 'oneof':
        break;

      default:
        data = {
          type: type,
          data: data
        };
    }

    isOneOfType.data = isOneOfType.data.concat(data).filter(Boolean);
  }

  return isOneOfType;
};

PropTypes.shape = function(shapeTypes) {
  var isShape = shape(shapeTypes);

  isShape.type = 'object';

  var data = isShape.data = {};
  var entries = Object.entries(shapeTypes);
  var key, value;

  for (var i = 0; i < entries.length; i++) {
    key = entries[i][0];
    value = entries[i][1];

    if (value && value.type) {
      data[key] = value.type;
    }
  }

  return isShape;
};

module.exports = PropTypes;
