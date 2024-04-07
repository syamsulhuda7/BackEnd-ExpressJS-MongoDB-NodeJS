const Product = require("../product/model");
const CartItem = require("../cart-item/model");

const update = async (req, res, next) => {
  try {
    const { items } = req.body;
    // console.log(items)
    const productIds = items.map((item) => item.product._id);
    const products = await Product.find({ _id: { $in: productIds } });

    const operations = items.map((item) => {
      const relatedProduct = products.find(
        (product) => product._id.toString() === item.product._id
      );

      return {
        updateOne: {
          filter: { user: req.user._id, product: relatedProduct._id },
          update: {
            $setOnInsert: {
              product: relatedProduct._id,
              price: relatedProduct.price,
              image_url: relatedProduct.image_url,
              name: relatedProduct.name,
              user: req.user._id,
            },
            $inc: { qty: item.qty }
          },
          upsert: true,
        },
      };
    });

    await CartItem.bulkWrite(operations);

    const updatedCartItems = await CartItem.find({ user: req.user._id });

    return res.json(updatedCartItems);
  } catch (err) {
    next(err);
  }
};


const index = async (req, res, next) => {
  try {
    let items = await CartItem.find({ user: req.user._id }).populate("product");

    return res.json(items);
  } catch (err) {
    if (err && err.name == "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { productId } = req.body; // Ambil ID produk dari data yang dikirimkan dalam req.body

    // Hapus produk dari keranjang berdasarkan ID produk dan ID pengguna
    await CartItem.deleteOne({ product: productId, user: req.user._id });

    // Kirim respons bahwa produk telah dihapus
    return res.json({ message: 'Produk berhasil dihapus dari keranjang' });
  } catch (err) {
    // Tangani kesalahan dengan baik
    next(err);
  }
};

module.exports = {
  update,
  index,
  destroy
};
