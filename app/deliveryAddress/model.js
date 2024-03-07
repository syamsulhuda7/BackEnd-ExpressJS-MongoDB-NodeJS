const {Schema, model} = require('mongoose');

const DeliveryAddressSchema = Schema({

    name: {
        type: String,
        required: [true, 'Nama alamat harus diisi'],
        maxlength: [255, 'Panjang maksimal nama alamat adalah 255 karakter']
    },
    
    kelurahan: {
        type: String,
        required: [true, 'Kelurahan harus diisi'],
        maxlength: [255, 'Panjang maksimal kelurahan adalah 255 karakter']
    },
    
    kecamatan: {
        type: String,
        required: [true, 'Kecamatan harus diisi'],
        maxlength: [255, 'Panjang maksimal kecamatan adalah 255 karakter']
    },
    
    kabupaten: {
        type: String,
        required: [true, 'Kabupaten harus diisi'],
        maxlength: [255, 'Panjang maksimal kabupaten adalah 255 karakter']
    },
    
    provinsi: {
        type: String,
        required: [true, 'Provinsi harus diisi'],
        maxlength: [255, 'Panjang maksimal provinsi adalah 255 karakter']
    },
    
    detail: {
        type: String,
        required: [true, 'Detail harus diisi'],
        maxlength: [255, 'Panjang maksimal detail adalah 255 karakter']
    },
    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {timestamps: true});

module.exports = model('DeliveryAddress', DeliveryAddressSchema)