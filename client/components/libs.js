// ---------------------------------------------------------------------------------------------------------------------
// Wrapper modules for third-party libraries.
//
// @module libs.js
// ---------------------------------------------------------------------------------------------------------------------
/* global angular: true */

angular.module('lodash', []).factory('lodash', function($window) { return $window._; });
angular.module('Dropbox', []).factory('Dropbox', function($window) { return $window.Dropbox; });

// ---------------------------------------------------------------------------------------------------------------------
