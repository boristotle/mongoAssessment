var express = require('express');
var router = express.Router();

var storeDb = require('monk')('localhost/storeDB');
var Stores = storeDb.get('store');

var productDB = require('monk')('localhost/productDB');
var Product = productDB.get('product');

var itemDB = require('monk')('localhost/itemDB');
var Item = itemDB.get('item');



// This is the index page for the store  that shows a list of all products
router.get('/', function(req, res, next) {
  Product.find({}, function(err, product) {
      res.render('index', {product: product})
  })
});


// This is the post page for users to add an item to the Item database
router.post('/', function(req, res, next){
  console.log('hello')
  // for each item entered add the associated productID as the type for this item
  Item.insert({type: req.body.type, item: req.body.item}, function(err, data){
    // console.log(data);
      res.redirect('/store')
  })

})

// This is the route takes users to the product type/:id that shows a list of all of the items in that product type
router.get('/:type', function(req, res, next) {
  Product.find({type: req.params.type}).then(function(product) {
  Item.find({type: product[0]._id.toString()}).then(function(item){
    return [item, product]
  }).then(function(data){
    console.log('item', data)
    res.render('items', {products: data})
    })
  })
})

// THIS IS THE DATA ARRAY
// [ 
//   [ { _id: 5631097daf176df662ebb9b4,
//      type: '562a684ac10cdea34c92b37b',
//      item: 'Pears' 
//     } 
//   ],
//   [ 
//     { _id: 562a684ac10cdea34c92b37b, type: 'Produce' } 
//   ] 
// ]





module.exports = router;
