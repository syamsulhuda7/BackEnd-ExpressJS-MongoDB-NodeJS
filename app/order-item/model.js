const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderItemSchema = Schema({
    name: {
        type: String,
        minlength: [3, "Panjang nama item minimal 3 karakter"],
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
    // Define product as a reference to the Product schema
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Assuming your Product schema is named 'Product'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
});

module.exports = model('OrderItem', orderItemSchema);
