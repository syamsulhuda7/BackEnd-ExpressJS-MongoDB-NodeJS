const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const orderItemSchema = Schema({

    name: {
        type: String,
        minlength: [5, "Panjang nama item minimal 5 karakter"],
        required: [true, "Nama item harus diisi"],
      },
    
      price: {
        type: Number,
        required: [true, 'Harga item harus diisi']
      },

      qty: {
        type: Number,
        required: [true, "Kuantitas harus diisi"],
        min: [1, "Kuantitas Item minimal adalah 1"],
      },
    
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },

      order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
      }
});

module.exports = model('OrderItem', orderItemSchema);