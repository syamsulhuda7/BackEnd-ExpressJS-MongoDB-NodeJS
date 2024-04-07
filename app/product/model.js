const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const productSchema = Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang nama makanan minimal 3 karakter"],
      required: [true, "Nama makanan harus diisi"],
    },

    description: {
      type: String,
      maxlength: [1000, "Panjang deskripsi maksimal 1000 karakter"],
      required: [true, "Deskripsi harus diisi"],
    },

    price: {
      type: Number,
      default: 0,
      required: [true, "Harga harus diisi"],
    },

    stock: {
      type: Number,
      default: 0,
      required: [true, "Stok harus diisi"],
    },

    image_url: String,

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Kategori harus diisi"],
    },

    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: [true, "Tag harus diisi"],
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);
