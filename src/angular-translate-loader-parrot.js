import moment from 'moment';
import {
  merge, join, forEach,
  set, isEmpty, has
} from 'lodash';

import opts from './config';

/**
 * This function will retrieve the token
 * If local storage is available, it will try
 * to get it from there, if so, check the validity
 * and if ok return it.
 * If not available or no token or passed date, it
 * will fetch it from the Parrot backend
 * @param { Object } $q The $q service
 * @param { Object } $window The $window service
 * @param { Object } $http The $http service
 * @param { Object } $httpParamSerializerJQLite The $httpParamSerializerJQLite service
 * @param { String } storageKey The key for the local storage
 * @param { String } url The parrot backend url
 * @param { String } tokenPath The parrot path to get the token
 * @param { String } grant_type The token grant type
 * @param { String } client_id The application client id
 * @param { String } client_secret The application client secret
 * @return { String } The application token
 */
const _getToken = ($q, $timeout, $window, $http, $httpParamSerializerJQLike,
  { storageKey, url, tokenPath, grant_type, client_id, client_secret }) => {
  const deferred = $q.defer();
  const loadToken = () => $http({
    method: 'POST',
    url: join([url, tokenPath], ''),
    data: $httpParamSerializerJQLike({ grant_type, client_id, client_secret }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
    .then(({ data }) => {
      const { access_token, expires_in } = data.payload;
      if (has($window, 'localStorage')) {
        $window.localStorage.setItem(storageKey, JSON.stringify({
          token: access_token,
          dateValid: moment().add(expires_in, 'seconds').toDate()
        }));
      }
      return deferred.resolve(access_token);
    });

  if (has($window, 'localStorage') && !isEmpty($window.localStorage.getItem(storageKey))) {
    const { token, dateValid } = JSON.parse($window.localStorage.getItem(storageKey));
    if (moment().isBefore(moment(dateValid))) {
      $timeout(() => deferred.resolve(token), 100);
    } else {
      loadToken();
    }
  } else {
    loadToken();
  }

  return deferred.promise;
};

/**
 * This function retrieves the translations
 * from a parrot backend
 * @param { Object } $http The $http service
 * @param { String } url The parrot backend url
 * @param { String } translationPath The parrot path to export translations
 * @param { String } project_id The project ID
 * @param { String } key The locale key
 * @return { Function } A function to fetch the translations using a given token
 * that returns a promise
 */
const _getTranslations = ($http, { url, translationPath, project_id, key }) => token =>
  $http({
    method: 'GET',
    url: join([
      url, translationPath.replace('{{project_id}}', project_id).replace('{{locale}}', key)
    ], ''),
    skipAuthorization: true,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

/* @ngInject */
function TranslateParrotLoader($http, $q, $window, $httpParamSerializerJQLike, $timeout) {
  /**
   * This function will fetch the translation
   * from a Parrot account using the API.
   * @param { Object } options The user's options
   * @return { Promise } A promise that resolves the
   * translation JSON or reject an error
   */
  return function load(options) {
    const deferred = $q.defer();
    const fOptions = merge(opts, options);

    _getToken($q, $timeout, $window, $http, $httpParamSerializerJQLike, fOptions)
      .then(_getTranslations($http, fOptions))
      .then(({ data }) => {
        const translations = {};
        forEach(data, (value, key) => set(translations, key, value));
        return deferred.resolve(translations);
      })
      .catch(err => deferred.reject(err));

    return deferred.promise;
  };
}

/**
 * This is the loader module
 */
export default angular.module('angularTranslateLoaderParrot', []) // eslint-disable-line
  .factory('translateParrotLoader', TranslateParrotLoader)
  .name;
