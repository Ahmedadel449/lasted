const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');

const bycrptjs = require('bcryptjs');
const config = require('../config/config');
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const randomstring = require("randomstring");


const create_token = async (id) => {
    try {
        const token = await jwt.sign({ _id: id }, config.secret_jwt, { expiresIn: '1h' });
        return token;
    } catch (err) {
        res.status(400).send(err.massage);
    }
}
const securePassword = async (password) => {
    try {
        const passwordhash = await bycrptjs.hash(password, 10);
        return passwordhash;
    } catch (err) {
        res.status(400).send({ success: false, });
    }
}

const register_user = async (req, res) => {

    try {
        const spassword = await securePassword(req.body.password);

        const user = new User({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            password: spassword,
            dateOfBirth: req.body.dateOfBirth,
            image: req.body.image
        });


        const userData = await User.findOne({ email: req.body.email });
        if (userData) {
            res.status(200).json({ success: false, msg: "This email is already exists", data: {} })
        } else {
            const data = await User.findOne({ name: req.body.name });
            if (data) {
                res.status(200).json({ success: false, msg: "This name is already exists", data: {} })
            } else {
                const phonee = await User.findOne({ phone: req.body.phone });
                if (phonee) {
                    res.status(200).json({ success: false, msg: "This phone is already exists", data: {} })
                } else {
                    const user_data = await user.save()
                    res.status(200).json({ success: true, msg: " register successfully ", data: user_data })
                }
            }

        }

    } catch (error) {
        console.log(error)
        res.status(400).json(error.massage);
    }
};


//login

const user_login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bycrptjs.compare(password, userData.password);
            if (passwordMatch) {
                const tokenData = await create_token(userData._id);
                // const userResult = {
                //     _id: userData._id,
                //     name: userData.name,
                //     email: userData.email,
                //     image: userData.image,
                //     phone: userData.phone,
                //     dateOfBirth: userData.dateOfBirth,
                //     token: tokenData
                // }
                const response = {
                    success: true,
                    msg: "login successfully",
                    data: userData
                }
                res.status(200).json(response);

            } else {
                res.status(200).json({ success: false, msg: "Login details are incorrect", data: {} })
            }

        } else {
            res.status(200).json({ success: false, msg: "Login details are incorrect", data: {} })
        }


    } catch (error) {
        console.log(error)
        res.status(400).json(error.massage);
    }
};
//logout

//updatepassword
const update_password = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const password = req.body.password;
        const data = await User.findOne({ _id: user_id });
        if (data) {
            const newPassword = await securePassword(password);
            const userData = await User.findByIdAndUpdate({ _id: user_id }, { $set: { password: newPassword } });
            res.status(200).json({ success: true, msg: "your passwoed has been updated", data: {} });
        }
        else {
            res.status(200).json({ success: false, msg: "User Id not found!", data: {} });

        }

    } catch (error) {
        res.status(400).json(error.message);

    }

}

// forget_password

const forget_password = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({ email: email });
        if (userData) {
            const randomString = randomstring.generate();
            const data = await User.updateOne({ email: email }, { $set: { token: randomString } });
            sendResetPasswordMail(userData.name, userData.email, randomString)
            res.status(200).json({ success: true, msg: "please cheak your inbox of mail and reset password", data: {} });

        }
        else {
            res.status(200).json({ success: true, msg: "this email dose not exists", data: {} });
        }


    } catch (error) {
        res.status(400).json(error.message);
    }
}

// send reset password 

const sendResetPasswordMail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });

        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'For Reset Password',
            html: '<p> appp ' + name + ', Please copy the link and <a href =" http://127.0.0.1:8080/forget-password?token=' + token + '">  reset your password</a>'
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Mail has been sent:- ", info.response);
            }
        })
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
}

// //reset_password

// const reset_password = async (req, res) => {
//     try {
//         const token = req.query.token;
//         const tokenData = await User.findOne({ token: token });
//         if (tokenData) {
//             const password = req.body.password;
//             const newPassword = await securePassword(password);
//             const userData = await User.findByIdAndUpdate({ _id: token._id }, { $set: { password: newPassword, token: '' } }, { new: true });
//             res.status(200).json({ success: true, msg: "user password has been reset", data: userData });
//         }
//         else {
//             res.status(200).json({ success: true, msg: "This Link has been expired.", data: {} });

//         }

//     } catch (err) {
//         res.status(400).json({ success: false, msg: error.message });
//     }
// }

//Update User

const update_user = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                return res.status(400).json(error)
            }
        } try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            // res.status(200).send(user) هيرجعلي بيانات اليوزر
            res.status(200).json({success:true, msg: "Account has been updated", data:{} })
        } catch (error) {
            return res.status(400).json(error)
        }
    } else {
        return res.status(400).json("you can update only your account")
    }
};

//Deleted User
const delete_user = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete({ _id: req.params.id });
            // res.status(200).send(user) هيرجعلي بيانات اليوزر
            return res.status(200).send({ success: true, msg: "account has been deleted" })
        } catch (error) {
            return res.status(400).send({ success: false, msg: error });
        }
    } else {
        return res.status(400).json({ success: false, msg: "you can deleted only your account" })
    }
};
//get a user

const get_user = async (req, res) => {
    try {
        // const name = req.params.name;
        // const user = await User.findOne({ name }).select("-password");
        const user = await User.findById(req.params.id);
        const { password, updateAt, ...other } = user._doc;
        res.status(200).json(other)
    } catch (err) {
        res.status(500).json(err)
    }
};

//getfriends

// router.get('/friends/:userId',
// const get_friends = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId);
//         const friends = await Promise.all(
//             user.followings.map((firendId) => {
//                 return User.findById({ firendId });
//             })
//         )
//         let friendList = []
//         friends.map(friend => {
//             const { _id, name } = friend;
//             friendList.push({ _id, name })
//         });
//         res.status(200).json(friendList)

//     } catch (error) {
//         res.status(500).json(error)

//     }
// }


//search user
// searchUser: async (req, res) => {
//     try {
//       const users = await Users.find({
//         username: { $regex: req.query.username },
//       })
//         .limit(10).select("fullname username avatar");

//       res.json({ users });
//     } catch (err) {
//       return res.status(500).json({ msg: err.message });
//     }
//   },
const search_user = async (req, res) => {
    try {
        const users = await User.find({ name: { $regex: req.query.name } })
            .limit(10).select("full name name avatar")
        res.status(200).json({ users })
    } catch (error) {
        return res.status(500).json(error)
    }
}
//follow a user

const follow_user = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.params.id)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json({ success: true, msg: "user has been followed", data: {} })

            } else {
                res.status(403).json("you allready follow this user")
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant follow yourself");
    }
};


//unfollow

const unfollow_user = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (currentUser.followings.includes(req.params.id)) {
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                await user.updateOne({ $pull: { followers: req.body.userId } });
                res.status(200).json({ msg: "user has been unfollowed", data: {} })

            } else {
                res.status(403).json("you allready unfollow this user")
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cant unfollow yourself");
    }
};

module.exports = {
    register_user,
    user_login,
    update_password,
    // forget_password,
    // reset_password,
    update_user,
    delete_user,
    get_user,
    // get_friends,
    search_user,
    follow_user,
    unfollow_user
};