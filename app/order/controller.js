const CartItem = require('../cart-item/model');
const DeliveryAddress = require('../deliveryAddress/model');
const Order = require('../order/model');
const {Types} = require('mongoose');
const OrderItem = require('../order-item/model');

const store = async (req, res, next) => {

    try{
        let {delivery_fee, delivery_address, payment_method} = req.body;
        let items = await CartItem.find({ user: req.user._id }).populate({ path: 'product'});
        if(!items.length === 0) {
            return res.json({
                error: 1,
                message: `You're not create order because you have not items in cart`
            })
        }
        let address = await DeliveryAddress.findById(delivery_address);
        console.log(address);
        let order = new Order({
            _id: new Types.ObjectId(),
            status: 'waiting_payment',
            delivery_fee: delivery_fee,
            delivery_address: {
                provinsi: address.provinsi,
                kabupaten: address.kabupaten,
                kecamatan: address.kecamatan,
                kelurahan: address.kelurahan,
                detail: address.detail,
                name: address.name,
            },
            payment_method: payment_method,
            user: req.user._id
        });
        let orderItems =
        await OrderItem
        .insertMany(items.map(item => ({
            ...item,
            name: item.product.name,
            qty: parseInt(item.qty),
            price: parseInt(item.product.price),
            order: order._id,
            product: item.product._id
        })));
        orderItems.forEach(item => order.order_items.push(item));
        order.save();
        await CartItem.deleteMany({user: req.user._id});
        return res.json(order);
    } catch(err){
        if(err && err.name == 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            })
        }

        next(err);
    }
};

const index = async (req, res, next) => {
    try {
        // Destructuring objek req.query untuk mendapatkan nilai skip dan limit, default 0 dan 10
        let { skip = 0} = req.query;

        // Menghitung jumlah dokumen berdasarkan user ID
        let count = await Order.countDocuments({ user: req.user._id });

        // Mengambil daftar pesanan berdasarkan user ID dengan populate order_items dan mengurutkannya berdasarkan createdAt secara descending
        let orders = await Order.find({ user: req.user._id })
            .skip(parseInt(skip))
            // .limit(parseInt(limit))
            .populate('order_items')
            .sort({ createdAt: -1 });

        // Mengembalikan data dalam bentuk JSON
        return res.json({
            data: orders.map(order => order.toJSON({ virtuals: true })),
            count
        });
    } catch (err) {
        // Penanganan kesalahan
        if (err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
};

// const index = async (req, res, next) => {
//     try {
//         let {skip = 0, limit = 10} = req.query;
//         let count = await Order.find({user: req.user._id}).countDocuments();
//         let orders = await Order.find({ user: req.user._id })
//         .skip(parseInt(skip))
//         .limit(parseInt(limit))
//         .populate('order_items')
//         .sort({ createdAt: -1 });
//         console.log(orders);
//         return res.json({
//             data: orders.map(order => order.toJSON({virtuals: true})),
//             count
//         })
//     } catch (err) {
//         if(err && err.name == 'ValidationError') {
//             return res.json({
//                 error: 1,
//                 message: err.message,
//                 fields: err.errors
//             });
//         }

//         next(err);
//     }
// };

module.exports = {
    store,
    index
};