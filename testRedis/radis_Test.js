var redis = require('redis');
var client = redis.createClient();

// 데이터 조작하기
// set 
client.set('String key', 'String Value', redis.print);

// get
client.get('String key', function(err, value){
    if(err) throw err;
    console.log(value);
});

// 해시 맵 데이터 조작
// hmset 해시테이블에 key로 식별되는 value 값들을 항목으로 추가 가능
client.hmset('codigm', {
    'goormIDE': 'cloud service', 
    'goormEDU': 'edu service'
}, redis.print);

client.hset('Hash Key', 'HashTest 1', '1', redis.print);
client.hset(['Hesh Key', 'HashTest 2', '2'], redis.print);

client.hget('codigm', 'goormIDE', function(){
    if(err) throw err;
    console.log('goormIDE is '+ value);
}); 

// 모든 키 데이터 가져오기
client.hkeys('codigm', function(err, keys){
    if(err) throw err;
    keys.forEach(function(key, i){
        console.log('codigm ' + i + ':' + key);
    });
});

// 리스트에 존재하는 데이터 조작하기

client.lpush('tasks', 'Node.js', redits.print);
client.lpush('tasks', 'Redis', redis.print);

//시작인자, 종료인자 이용해 리스트 항목 -1은 리스트 마지막 항목 의미 다 갖고오기 
client.lrange('tasks', 0, -1, function (err, itme) {
    if(err) throw err;
    console.log('list' + i + ':' + itme); 
});


client.on('error', function(err){
    console.log('error' + err);
});