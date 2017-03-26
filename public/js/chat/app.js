var app = angular.module('chatApp', ['btford.socket-io']);
app.factory('socket', function (socketFactory) {
    var myIoSocket = io.connect(serverBaseUrl);

    var socket = socketFactory({
        ioSocket: myIoSocket
    });

    return socket;
});
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
app.controller('MainCtrl', function ($scope, Window, GUI, $mdDialog, socket, $http) {

    //Listen for new messages (Objective 3)
    socket.on('message created', function (data) {
        //Push to new message to our $scope.messages
        $scope.messages.push(data);
        //Empty the textarea
        $scope.message = "";
    });
    //Send a new message (Objective 4)
    $scope.send = function (msg) {
        //Notify the server that there is a new message with the message as packet
        socket.emit('new message', {
            room: $scope.room,
            message: msg,
            username: $scope.username
        });

    };
});