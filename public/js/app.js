var app = angular.module('sse-chat', []);

/**
 * Angular Service that sends the message
 */
app.factory('MessageService',['$http',function($http){
    function sendMessage(data){
        return $http.post('/message', data, []);
    }

    return {
        sendMessage:sendMessage
    }

}]);

/**
 * Controller for the (chat) app
 */
app.controller('ChatController',['MessageService','$scope', function(MessageService,$scope) {
    var cc=this;
    $scope.messages = [];

    //Method called when form is submitted
    cc.sendMessage =function(){
        if(cc.msg && cc.name){
            MessageService.sendMessage({msg:cc.msg,sender:cc.name})
                .then(function successCallback(response) {
                    cc.msg=''; //Empty the chat message box
                }, function errorCallback(response) {
                    console.log(response.message);
                });
        }
    };

    //SSE Handler
    if(typeof(EventSource) !== "undefined") {
        var ev = new EventSource('/message/sse');
        //Event to listen to
        ev.addEventListener('new_message', function (event) {
            $scope.messages=JSON.parse(event.data); //Use JSON.parse to get it well formatted for display
            $scope.$apply(); 
        })
    } else {
        console.log('Sorry! No server-sent events support...');
    }

}]);