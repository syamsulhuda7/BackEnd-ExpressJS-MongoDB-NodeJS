const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");

let userSchema = Schema(
  {
    full_name: {
      type: String,
      required: [true, "Nama harus diisi"],
      minlength: [3, "Panjang nama harus antara 3 - 255 karakter"],
      maxlength: [255, "Panjang nama harus antara 3 - 255 karakter"],
    },

    customer_id: {
      type: Number,
    },

    email: {
      type: String,
      required: [true, "Email harus diisi"],
      maxlength: [255, "Panjang email maksimal 255 karakter"],
    },

    password: {
      type: String,
      required: [true, "Password harus diisi"],
      minlength: [3, "Panjang password minimal 3 karakter"],
      maxlength: [255, "Panjang password maksimal 255 karakter"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    token: [String],
  },
  { timestamps: true }
);


// Validasi email
userSchema.path('email').validate(
  function(value) {
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Perbaikan ekspresi reguler
    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid!`
);

// Validasi apakah email sudah terdaftar atau belum
userSchema.path('email').validate(
  async function(value) {
    try {
      const count = await this.constructor.countDocuments({ email: value }); // Menggunakan constructor untuk menghindari masalah this binding
      return count === 0; // Mengubah logika validasi
    } catch (err) {
      throw new Error(err.message);
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

// Hash password hanya jika password berubah
const HASH_ROUND = 10;
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(HASH_ROUND);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Mongoose Autoincrement -> mongoose-sequence
userSchema.plugin(AutoIncrement, { inc_field: 'customer_id' });

module.exports = model("User", userSchema);
