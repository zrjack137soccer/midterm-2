var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/purchaseDB', {useNewUrlParser: true});

var PurchasesSchema = new mongoose.Schema({
    Name: String,
    Price: String,
    URL: String,
    orders: {type: Number, default:0}
});

PurchasesSchema.methods.order = function(cb) {
    this.orders +=1;
    this.save(cb);
};

var Purchases = mongoose.model('Purchases', PurchasesSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log('Connected');
});

router.get('/admin', function(req, res, next){
    res.sendFile('admin.html', {root: "public"});
});

router.get('/shopper', function(req,res,next){
    res.sendFile('customer.html', {root: "public"});
});

router.param('item', function(req, res, next, id){
    var query = Purchases.findById(id);
    query.exec(function (err, item){
        if (err) {return next(err);}
        if (!item) { return next(new Error("can't find item")); }
        req.item = item;
        return next();
    });
});

router.get('/orders/:item', function(req, res) {
  res.json(req.item);
});

router.put('/orders/:item/order', function(req, res, next){
    console.log("Put Route"+req.item.Name);
    req.item.order(function(err, item){
        if(err) {return next(err); }
        res.json(item);
    });
});

router.delete('/orders/:item',function(req,res){
    req.item.remove();
    res.sendStatus(200);
});

router.get('/orders',function(req,res,next){
    console.log("Get Route");
    Purchases.find(function(err, items){
        if(err){ console.log("Error"); return next(err); }
        res.json(items);
        console.log("res.json Get Route");
    });
    console.log("returning Get Route");
});

router.post('/orders', function(req, res, next){
    console.log("Post Route");
    var item = new Purchases(req.body);
    console.log("Post Route");
    console.log(item);
    item.save(function(err, item){
        console.log("Post Route before json");
        res.json(item);
    });
});

module.exports = router;
