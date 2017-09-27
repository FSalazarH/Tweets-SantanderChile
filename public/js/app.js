'use strict';
var mainApp = angular.module('mainApp', [ 'ngRoute', 'mainAppControllers']);
mainApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        //Acá llega para el control de vistas (Se supone que en una sola vista se pueden cambiar los templates)
        $routeProvider.
            when('/totales', {
                templateUrl: '/totales',
                controller: 'totalController'
            }).      
            when('/categorias', {
                templateUrl: '/categorias',
                controller: 'categoryControllers'
            }).
            when('/sentiments', {
                templateUrl: '/sentiments',
                controller: 'sentimentsController'
            }).
            otherwise({
                redirectTo: '/sentiments'
            });
    }
]);


