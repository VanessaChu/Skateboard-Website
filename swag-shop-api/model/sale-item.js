var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var saleItem = new Schema({
    item: {type: ObjectId, ref: 'Product'},
    relatedItems: [{type: ObjectId, ref: 'Product'}]
});

module.exports = mongoose.model('SaleItem', saleItem);