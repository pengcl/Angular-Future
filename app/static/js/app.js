'use strict';

// Declare app level module which depends on views, and components

var app = angular.module('app', [
    'ui.router',
    'ngAnimate',
    'ngCookies',
    'appServices',
    'appFilters'
]);
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $urlRouterProvider.otherwise(function () {
        return "/";
    });

}]);
