var express = require('express');
var SSE=require('sse-nodejs');
var bodyParser = require('body-parser');

var app=express();
app.set('port', (process.env.PORT || 5000));

//Set the public folder
app.use(express.static(__dirname + '/public'));

//Allows us to parse POST data.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//Messages Array
var messages=[];

//Serve the Homepage
app.get('/',function(req,res){
    messages = [];
    res.sendFile(__dirname+ '/public/index.html');
});

/**
 * Receives the Message body and adds to the array of messages
 */
app.post('/message',function (req,res) {
    var m=req.body.msg;
    var name=req.body.sender;

    //Insert new message at index 0
    messages.splice(0,0,{msg:m,sender:name});

    //Send a response
    res.status(200).send({});

});

/**
 * Source of Events listened to by the Client
 */
app.get('/message/sse',function(req,res){
    var a = SSE(res);
    
    //Event
    a.sendEvent('new_message', function () {
        return messages
    },2000);

    //Called when event ends
    a.disconnect(function () {
        console.log("disconnected");
    });
    
});


app.listen(app.get('port'), function(){
    console.log('Server listening on port: ', app.get('port'));
});
