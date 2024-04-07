const User = require("../user/model");
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require("../../utils");

const register = async (req, res, next) => {
  try {
    const payload = req.body;

    let user = new User(payload);

    await user.save();

    return res.json(user);
  } catch (err) {
    // 1. cek kemungkinan kesalahan terkait validasi
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    // 2. error lainnya
    next(err);
  }
};

const localStrategy = async (email, password, done) => {
    try{
        let user = 
        await User
        .findOne({email})
        .select('-__v -createdAt -updatedAt -cart_items -token');
        if (!user) return done();
        if (bcrypt.compareSync(password, user.password)) {
            ({password, ...userWithoutPassword} = user.toJSON());
            return done(null, userWithoutPassword);
        }
    } catch (err) {
        done(err, null)
    }
    done();
};

const login = async (req, res, next) => {
    passport.authenticate('local', async function(err, user) {
        if (err) return next(err);

        if (!user) return res.json({error: 1, message: 'Email or Password incorrect'});

        let signed = jwt.sign(user, config.secretkey, {expiresIn: '1d'});

        await User.findByIdAndUpdate(user._id, {$push: {token: signed}});
        
        res.cookie('signed', signed,{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        });

        // Kirim respons JSON setelah mengatur cookie
        res.json({
            message: 'login successfully',
            user, 
            token: signed
        });
    })(req, res, next); // Perhatikan bahwa kita memanggil passport.authenticate dengan req, res, dan next di dalam tanda kurung
};

const logout = async (req, res, next) => {
    // Dapatkan token dari permintaan
    let token = getToken(req);
    // console.log(token)
    
    // Jika token tidak ditemukan, kirim respons dengan pesan kesalahan
    if (!token) {
        return res.json({
            error: 1,
            message: 'No Token Found!'
        });
    }

    // Temukan dan hapus token dari pengguna yang sesuai
    let user = await User.findOneAndUpdate(
        { token: token },
        { $pull: { token: token } },
        { useFindAndModify: false }
    );

    // Jika tidak ada pengguna yang ditemukan dengan token yang diberikan, kirim respons dengan pesan kesalahan
    if (!user) {
        return res.json({
            error: 1,
            message: 'No User Found!'
        });
    }

    // Jika berhasil logout, kirim respons berhasil
    return res.json({
        error: 0,
        message: 'Logout berhasil'
    });
}

const me = (req, res, next) => {
    if(!req.user) {
        res.json({
            err: 1,
            message: `You're not login or token expired`
        })
    }

    res.json(req.user);
}

module.exports = { register, localStrategy, login, logout, me };
