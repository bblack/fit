var fit = angular.module('fit', [
    'ngRoute',
    'elasticsearch'
]);
fit
.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'templates/home.html'
    })
    .when('/items', {
        templateUrl: 'templates/items.html'
    })
})
.service('esclient', function(esFactory){
    return esFactory({
        host: 'http://search-fittery-challenge-pv7vc3ugoko5hngpgxdh4szuqm.us-east-1.es.amazonaws.com/'
    });
})
.controller('foo', function($scope, esclient){
    $scope.things = ['one', 'two'];
    esclient.ping({

    })
    .then(function(x){
        console.log('ok:', x);
    })

    esclient.search({
        index: 'items'
    })
    .then(function(resbody){
        $scope.items = resbody.hits
    })
})
