var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dbuser:testmemo@mongo-memo.hbht4.mongodb.net/mongo-memo?retryWrites=true&w=majority', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console,"connection error:"));
db.once('open', () => {
  console.log("DB connected");
});

var Schema = mongoose.Schema;

var memo = new Schema({
  author: String,
  contents : String,
  data : Date,
});

var memoModel = mongoose.model('Memo', memo);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/load', function(req, res, next){
  memoModel.find({}, function(err, data){
    res.json(data);
  });
});

router.post('/write', function(req, res, next){
  var memo = new memoModel();
  memo.author = req.body.author;
  memo.contents = req.body.contents;
  memo.data = Date.now();
  memo.comments = [];
  memo.save(function(err){
    if (err) throw err;
    else res.json({status: "SUCCESS"});
  });
});

router.post('/del', function(req, res, next){
  memoModel.deleteOne({_id: req.body._id}, function(err, result){
    if (err) throw err;
    else res.json({status: "SUCCESS"});
  });
});

router.post('/modify', function(req, res, next){
  memoModel.findOne({ _id : req.body._id }, function(err, memo){
    if(err) throw err;
    else {
      memo.contents = req.body.contents;
      memo.save(function(err){
        if(err) throw err;
        else{
          res.json({status : "SUCCESS"});
        }
      });
    }
  });
});

module.exports = router;
