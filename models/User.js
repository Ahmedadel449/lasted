const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true,
        unque: true,
        minlength: [6, "Must be at least 6 characters long"],
        maxlength: [30, "Must be no more than 30 characters long"],
    },

    phone: {
        type: String,
        require: true,
        unique: true
    },

    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minLength: [8, "Must be at least 8 characters long"],
    },

    dateOfBirth: {
        type: String
    },

    image: {
        type: String,
        //maxlength:10000,
    },
    token: {
        type: String,
        default: ''
    },
    friends: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    desc: {
        type: String,
        max: 50
    },

},
    { timestamps: true }
);


module.exports = mongoose.model("User", UserSchema);

