const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const cartItemSchema = Schema({
  name: {
    type: String,
    minlength: [5, "Panjang nama item minimal 5 karakter"],
    required: [true, "Nama item harus diisi"],
  },

  qty: {
    type: Number,
    required: [true, "qty harus diisi"],
    min: [1, "Item minimal adalah 1"],
  },

  price: {
    type: Number,
    default: 0,
  },

  image_url: String,

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

module.exports = model("CartItem", cartItemSchema);
