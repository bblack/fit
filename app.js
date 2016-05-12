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
.controller('items', function($scope, esclient, $anchorScroll){
    $scope.size = 24;
    $scope.from = 0;
    $scope.$watch(function(){
        return _.pick($scope, 'size', 'from', 'searchString')
    }, function(newVal){
        $scope.req = esclient.search({
            index: 'items',
            q: newVal.searchString,
            size: newVal.size,
            from: newVal.from
        })
        .then(function(resbody){
            $scope.items = resbody.hits.hits;
            $scope.hits = resbody.hits.total;
            $anchorScroll()
        });
    }, true);
    $scope.canPrev = function(){
        return $scope.from - $scope.size > 0;
    }
    $scope.prev = function(){
        if ($scope.canPrev())
            $scope.from -= $scope.size;
    }
    $scope.canNext = function(){
        return $scope.from < $scope.hits;
    }
    $scope.next = function(){
        if ($scope.canNext())
            $scope.from += $scope.size
    }
    $scope.round = Math.round;
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
        var domainMatch = item._source.link.match(/(.*):\/\/(.*?)\//).slice(-1)
        $scope.retailerDomain = (domainMatch && domainMatch[0]) ||
            "the retailer's website";
    });
})
