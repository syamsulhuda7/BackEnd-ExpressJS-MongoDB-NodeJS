// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../app/user/model');
// const bcrypt = require('bcrypt');

// passport.use(new LocalStrategy({
//     usernameField: 'email'
//   }, async (email, password, done) => {
//     try {
//       const user = await User.findOne({ email });
//       if (!user) {
//         return done(null, false, { message: 'Incorrect email or password' });
//       }
  
//       // Memverifikasi password menggunakan bcrypt
//       const passwordMatch = await bcrypt.compare(password, user.password);
  
//       if (!passwordMatch) {
//         return done(null, false, { message: 'Incorrect email or password' });
//       }
  
//       // Jika password cocok, kembalikan pengguna
//       return done(null, user);
//     } catch (error) {
//       return done(error);
//     }
//   }));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     if (user) {
//       return done(null, user);
//     } else {
//       return done(new Error('User not found'));
//     }
//   } catch (error) {
//     return done(error);
//   }
// });

// module.exports = passport;
