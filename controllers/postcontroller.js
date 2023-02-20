const router = require("express").Router();
const Post = require("../models/Post")
const User = require('../models/User');

//create a post
// const create_post = async (req, res) => {
//     try {
//         const postData = await User.findOne({ _id: req.body.userId })
//         if (postData) {
//             if (!req.body.latitude || !req.body.longitude) {
//                 res.status(200).json({ success: false, msg: 'lat and log is not found!' })
//             } else {
//                 const userData = await Post.findOne({ userId: req.body.userId })
//                 if (userData) {
//                     res.status(200).json({ success: false, msg: 'This user is already created a post' })
//                 } else {
//                     const newPost = new Post({
//                         userId: req.body.userId,
//                         desc: req.body.desc,
//                         location:{
//                             type:"Path",
//                             coordinates:[parseFloat(req.body.longitude),parseFloat(req.body.latitude)]
//                         }
//                     });
//                     const savedPost =  await newPost.save();
//                     res.status(200).json({ success: true, msg: 'create post' ,data: savedPost});

//                 }
//             };
//         }else{
//             res.status(200).json({ success: false, msg: ' user Id dose not exists.' })

//         }
//     } catch (error) {
//         res.status(400).json(error.message)

//     }

// }
const create_post = async(req,res) => {

        const newPost = new Post(req.body)
    try{
        const savedPost =  await newPost.save();
        res.status(200).json({ success: true, msg: 'create post' , data: savedPost});
    }catch(err){
        res.status(500).json({success: false , msg:err})
    }
};

//update a post 

const update_post = async(req,res) => {
    try {
        const post = await Post.findById(req.params.postid); 
        if (post.userId == req.body.userId){
        await post.updateOne({$set: req.body});
            res.status(200).json({success:true ,msg:"the post has been updated",post:post});
        }else {
            // console.log(post)
            res.status(403).json({success:false ,msg:"you can update only your post",post:post})
        }
    }catch(err){
        res.status(500).json(err);
    }
};

//delete a post  

const delete_post = async(req,res) => {
    try {
        const post = await Post.findById(req.params.id).populate("userId","name");
        if (post.userId === req.body.userId){
            await post.findByIdAndDelete();
            res.status(200).json({ success:true ,msg:"the post has been deleted",data:{}})
        }else {
            // console.log(post)
            res.status(403).json({ success:false ,msg:"you can delete only your post",data:{}})
        }
    }catch(err){
        res.status(500).json(err);
    }
};


//like / dislike a post 

const react_post = async(req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json({msg:"the post has been liked",isliked:true,numOfLikes:post.likes.length})
        }else {
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json({msg:"the post has been disliked",isliked:false,numOfLikes:post.likes.length})
        }
    }catch(err){
        res.status(500).json(err);
    }
};



//get a post 

const get_post =  async(req,res) =>{
    try{
        const post =await Post.findById(req.params.id).populate("userId","name");
        res.status(200).json({success:true ,post:post});
    }catch(err){
        res.status(500).json(err)
    }
};

//get user post 
const get_user_post =  async(req,res) =>{
    try{
        const user = await User.findOne({name : req.params.name})
        const posts = await Post.find({userId: user._id}).populate("userId","name");
        return res.status(200).json({success:true,
                        result:posts.length
                        ,posts});
    }catch(err){
        res.status(500).json(err)
    }
};

//get all posts
const get_all_post = async(req,res) =>{
    try{
        const posts =await Post.find({}).populate("userId","name");
        return res.status(200).json({
            result:posts.length
            ,posts});
    }catch(err){
        res.status(500).json(err)
    }
};
//get local posts
const get_local_post = async(req,res) =>{
    try{
        const posts =await Post.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            req.query.long,
                            req.query.lat
                        ]
                    },
                    $maxDistance: 10000 // in meter => (radius)
                }
            }
        });
        return res.status(200).json({
            result:posts.length
            ,posts});
    }catch(err){
        res.status(500).json({
            message1 : " hierror",
            message : err
        })
    }
};
//get timeline posts

// router.get("/timelinepost/all",
// const timeline_post = async(req,res) => {
//     try{
//         const currentUser = await User.findById(req.body.userId);
//         const userPosts = await Post.find({userId: currentUser._id});
//         const friendPosts = Promise.all(
//             currentUser.following.map((firend_id)=>{
//                return Post.find({userId: firend_id}); 
//             })
//         );
//         res.status(200).json(userPosts.concat(...friendPosts))
//     }catch(err){
//         res.status(500).json(err)
//     }
// }

module.exports = {
    create_post,
    update_post,
    delete_post,
    react_post,
    get_post,
    // timeline_post,
    get_user_post,
    get_all_post,
    get_local_post
}