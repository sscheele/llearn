var basePagePath = '/public/classes/' + classIDStr + '/' + pageNum;
angular.module("page", [])
.directive('pageContent', function(){
    var tmpUrl = basePagePath + '/layout.html';
    console.log('tmpUrl: ' + tmpUrl);
    return {
        restrict: 'E',
        replace: true,
        templateUrl: tmpUrl
    };
})
.directive('playOnClick', function(){
    var temp = '<span class="play-on-click" ng-click="playSound($event)" ng-transclude></span>';
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: temp,
        controller: 'pocCtrl'
    }
})
.controller('pocCtrl', ['$scope', function($scope){
    $scope.playSound = function($event){
        var fName = $event.target.dataset.file;
        var audio = new Audio(basePagePath + '/res/' + fName);
        console.log(fName);
        audio.play();
    };
}]);