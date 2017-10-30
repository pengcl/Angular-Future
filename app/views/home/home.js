"use strict";

app.config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {

    // 设定路由
    $stateProvider
        .state('ljIndexAPhones', { //app首页
            url: "/phone/lj/A/phones",
            templateUrl: function ($stateParams) {
                return 'pages/phone/lj/A/index/index.html';
            },
            controller: "ljIndexAPhonesController"
        });
}]).controller('ljIndexAPhonesController', ['$scope', '$location', '$http', '$stateParams', '$interval', '$timeout', '$cookieStore', function ($scope, $location, $http, $stateParams, $interval, $timeout, $cookieStore) {

}]);