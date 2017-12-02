var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var bodyParser = require('body-parser');

var Product = require('./model/product.js');
var WishList = require('./model/wishlist.js');
var Cart = require('./model/cart.js');
var SaleItem = require('./model/sale-item.js')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

/*************************** PRODUCT ***************************/

router.post('/product', function(request, response){
    var product = new Product(request.body);
    product.save(function(err, savedProduct){
        if(err){
            response.status(500).send({error: "Could not save product"});
        }else{
            response.send(savedProduct);
        }
    });
});

router.get('/product', function(request, response){
    
    Product.find({}, function(err, products){
        if(err){
            response.status(500).send({error: "Could not retrieve products"});
        }else{
            response.send(products);   
        }
    });
});

/*************************** WISHLIST ***************************/

router.post('/wishlist', function(request, response){
   
    var wishlist = new WishList();
    wishlist.title = request.body.title;
    wishlist.save(function(err, newWishlist){
       if(err){
           response.status(500).send({error: "Could not create new wishlist"});
       }else{
           response.send(newWishlist);
       }
    });
});

router.get('/wishlist', function(request, response){
    
    WishList.find({}).populate({path:'products', model:'Product'}).exec(function(err, wishlists){
        if(err){
            response.status(500).send({error: "Could not retrieve wishlists"});
        }else{
            response.send(wishlists);
        }
    });
});

router.put('/wishlist/product/add', function(request, response){
   Product.findOne({_id: request.body.productId}, function(err, product){
      if(err){
          response.status(500).send("Could not add item to wishlist");
      }else{
          WishList.update({_id: request.body.wishlistId}, {$addToSet:{products: product._id}}, function(err, wishList){
              if(err){
                  response.status(500).send("Could not add item to wishlist");
              }else{
                  response.send("Successfully added to wishlist");
              }
          });
      }
   }); 
});

/*************************** CART ***************************/

router.post('/cart/add', function(request, response){
    var cartItem = new Cart();
    Product.findOne({_id: request.body.productId}, function(err, product){
        if(err){
            response.status(500).send("Could not add to cart");
        }else{
            cartItem.product = product;
            cartItem.save(function(err, newCartItem){
                if(err){
                    response.status(500).send({error: "Could not add to cart"});
                }else{
                    response.send(newCartItem);
                }
            });
        }
    });
});

router.get('/cart', function(request, response){
    Cart.find({}).populate({path:'product', model:'Product'}).exec(function(err, cartItems){
        if(err){
            response.status(500).send("Could not retrieve cart");
        }else{
            response.send(cartItems);
        }
    });
});

router.delete('/cart/delete/:productId', function(request, response){
    Cart.remove({product: request.params.productId}, function(err, removedItem){
        if(err){
            response.status.send({error: "Cannot remove cart item"});
        }else{
            response.send(removedItem);
        }
    });
});

/*************************** SALE ITEMS ***************************/

router.post('/saleitem', function(request, response){
    var saleItem = new SaleItem();
    Product.findOne({_id: request.body.productId}, function(err, product){
        if(err){
            response.status(500).send({error: "Cannot add sale item"});
        }else{
            saleItem.item = product;
            saleItem.save(function(err, newSaleItem){
                if(err){
                    response.status(500).send({error: "Cannot add sale item"});
                }else{
                    response.send(newSaleItem);
                }
            });
        }
    });
});

router.get('/saleitem', function(request, response){
    SaleItem.find({}).populate({path:'item', model:'Product'}).exec(function(err, saleitems){
        if(err){
            response.status(500).send({error: "Cannot retrieve sale items"});
        }else{
            response.send(saleitems);
        }
    });
});

router.put('/saleitem/relateditems', function(request, response){
    Product.findOne({_id:request.body.relatedItemId}, function(err, product){
        if(err){
            response.status(500).send({error:"Could not add related item"});
        }else{
            SaleItem.update({item: request.body.saleItemId}, {$addToSet:{relatedItems: product._id}}, function(err, saleitems){
                if(err){
                    response.status(500).send("Could not add to related items");
                }else{
                    response.send("Successfully added to related items");
                }
            });
        }
    });
});

module.exports = router;