var basePagePath = '/public/classes/' + classIDStr + '/' + pageNum;
angular.module("page", [])
    .directive('pageContent', function () {
        var tmpUrl = basePagePath + '/layout.html';
        console.log('tmpUrl: ' + tmpUrl);
        return {
            restrict: 'E',
            replace: true,
            templateUrl: tmpUrl
        };
    })
    .directive('playOnClick', function () {
        var temp = '<span class="play-on-click" ng-click="playSound($event)" ng-transclude></span>';
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: temp,
            controller: 'pocCtrl'
        }
    })
    .controller('pocCtrl', function ($scope) {
        $scope.playSound = function ($event) {
            console.log($event);
            var fName = $event.target.dataset.file;
            var audio = new Audio(basePagePath + '/res/' + fName);
            audio.play();
        };
    })
    .directive('multiChoice', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: basePagePath + '/res/quiz.html'
        };
    })
    .controller('quizCtrl', function ($scope) {
        var currValidate = 0;
        $scope.validate = function ($event) {
            if (currValidate >= $scope.answers.length){
                console.log(currValidate);
                return;
            }
            var selection = $event.target.innerText;
            var options = $scope.answers[currValidate].split("|");
            if (options.indexOf(selection) == -1) {
                $event.target.classList.add('btn-danger');
                return;
            }
            $event.target.classList.add('btn-success');
            currValidate = currValidate + 1;
        };
    })
    .directive('quizOption', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<button class="btn" ng-click="validate($event)" ng-transclude></button>'
        }
    })
    .directive('quizAnswer', function(){
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<span ng-transclude></span>'
        }
    });
