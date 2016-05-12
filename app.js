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
        templateUrl: 'templates/items.html',
        controller: 'items'
    })
    .when('/item/:item_id', {
        templateUrl: 'templates/item.html',
        controller: 'item'
    })
})
.service('esclient', function(esFactory){
    return esFactory({
        host: 'http://search-fittery-challenge-pv7vc3ugoko5hngpgxdh4szuqm.us-east-1.es.amazonaws.com/'
    });
})
.controller('items', function($scope, esclient){
    $scope.$watch('searchString', function(str){
        esclient.search({
            index: 'items',
            q: str,
            size: 24
        })
        .then(function(resbody){
            $scope.items = resbody.hits.hits;
        });
    })


    $scope.$watch('items', function(items){
        $scope.itemRows = _.chunk(items, 4);
    })
})
.controller('item', function($scope, esclient, $routeParams){
    esclient.get({
        index: 'items',
        type: 'item',
        id: $routeParams.item_id
    })
    .then(function(item){
        $scope.item = item;
    });
})
