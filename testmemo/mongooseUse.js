// 주요 method

// mongoDB connect 1
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/goormdb', {useNewUrlParser})
// 연결 되는 순간에는 open 이벤트 발생
// connect는 단일 db 연결 

// mongoDB connect 2
var mongoose = require('mongoose');
var connection1 = mongoose.createConnection('mongodb://localhost/mydb1');
var connection2 = mongoose.createConnection('mongodb://localhost/mydb2');
// 여러 개의 데이터 베이스에 연결 

// 모델 정의하기 
// 모델 생성을 위한 스키마
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var ArticleSchema = new Schema({
    author: ObjectId,
    title : String,
    body : String,
    data : Data,
});

// 스키마를 이용한 모델 정의 
var ArticleModel = mongoose.model('Article', ArticleSchema);

// 모델 사용하기 - 모델을 사용하기 위해 모델 인스턴스를 생성
var instance = new ArticleModel();
instance.title = 'hello';

// 각각 event 발생 시 처리 내용 정리 
instance.save(function (err) {    
    // save 후 콜백 함수 내용 
});
instance.find({}, function(err, docs){
    // find 실행후  콜백 함수 내용 
});

// 검색하기 find(), findOne(), findById() - 이런 메소드들은 model 인스턴스에서 실행 
// Model.find(query, fields, options, callback)

// ex 1) some.value = 5, Document를 검색 
Model.find({'some.value': 5 },function(err, docs){
    // callback
});

// ex 2) 특정 필드 값을 얻으려고 검색한 모든 도큐먼트에서 그것이 생성될 때 디폴트로 만들어진 필드 값 
Model.find({}, ['first', 'last'], function(err, docs){
});


// 도큐먼트 추가 -- 새로운 도큐먼트를 저장하는 방법 
var article = new ArticleModel({title:"Title", body:"contents"});
article.data = new Data();
article.save(function(err){
    if (err) return handleError(err);

    // 성공 후 수행 
});

// 모델 인스턴스를 생성하지 않고 바로 추가
ArticleModel.create({title:"Title", body:"Contents", data: new Data()}, function(err){
    if (err) return handleError(err);
    // 성공 후 수행 
});

// 도큐 먼트 삭제 -- remove()
ArticleModel.remove({title:"Title"}, function(err){
    if (err) return handleError(err);
});