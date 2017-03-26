angular.module('info', [])
.controller('MainCtrl', ['$scope', '$http', '$location', function($scope, $http){
    $http.get("/info/json/" + document.location.pathname.split('/').pop()).then(function(success){
        $scope.profile = success.data.profile;
    }, function(error){
        $scope.profile = {};
    });
}]);