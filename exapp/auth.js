const GoogleStrategy = require('passport-google-    oauth').OAuth2Strategy;

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new GoogleStrategy({
            clientID: %933668699455-rg2ubpr3cb04chop74ddr6j8blcs4bat.apps.googleusercontent.com%,
           // clientSecret: %%,
            callbackURL: %localhost:3000/home.html%
        },
        (token, refreshToken, profile, done) => {
            return done(null, {
                profile: profile,
                token: token
            });
        }));
};