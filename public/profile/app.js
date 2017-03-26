angular.module('profile', [])
.controller('MainCtrl', ['$scope', '$http', function($scope, $http){
    $http.get("/profile/json").then(function(success){
        console.log(success)
        $scope.email = success.data.email;
        $scope.profile = success.data.profile;
    }, function(error){
        $scope.email = "[ERROR RETRIEVING EMAIL]"
        $scope.profile = {};
    });
}]);