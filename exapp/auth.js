// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'googleAuth' : {
        'clientID'      : '933668699455-rg2ubpr3cb04chop74ddr6j8blcs4bat.apps.googleusercontent.com', // your App ID
        'clientSecret'  : 'MqRQvTHSjiK-b8MArGLY6G8C', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    },

    

};
