import * as _ from 'lodash';

export const toCamelCase = (object) => {
  return mapKeysDeep(object, (value, key) => _.camelCase(key));
}

export const toSnakeCase = (object) => {
  return mapKeysDeep(object, (value, key) => _.snakeCase(key));
}

export const mapKeysDeep = (object, callback) => {
  if (_.isArray(object)) {
    return object.map(item => mapKeysDeep(item, callback));
  } else if (_.isObject(object)) {
    return _.mapValues(
      _.mapKeys(object, callback),
      value => mapKeysDeep(value, callback)
    );
  } else {
    return object;
  }
}
