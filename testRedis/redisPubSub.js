var redis = require('redis');
var subscriber = redis.createClient();
var publisher = redis.createClient();
var msg_count = 0;

subscriber.on('subscribe', function(channel, count){
    publisher.publish('Goorm Channel', '발행자 첫 메세지');
    publisher.publish('Goorm Channel', '발행자 둘 메세지');
    publisher.publish('Goorm Channel', '발행자 막 메세지');
});

subscriber.on('message', function(channel, message){
    console.log('채널명 : ' + channel + ', 메세지: ' + message);

    msg_count += 1;

    if(msg_count == 3){
        subscriber.unsubscribe();
        subscriber.end();
        publisher.end();
    }
});

subscriber.subscribe('Goorm Channel');
