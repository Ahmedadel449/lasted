const express = require('express');
const post_route = express();
const bodyParser = require('body-parser')
const router = require("express").Router();
const Post = require("../models/Post")

post_route.use(bodyParser.json());
post_route.use(bodyParser.urlencoded({extended:true}));

const post_controller = require("../controllers/postcontroller");

//post controller
post_route.post('/create-post/',post_controller.create_post)
post_route.put('/update-post/:id',post_controller.update_post)//postid
post_route.delete('/delete-post/:id',post_controller.delete_post)//postid
post_route.put('/react-post/:id/like',post_controller.react_post)//postid
post_route.get('/get-user-post/:name',post_controller.get_user_post)
post_route.get('/get-all-post/',post_controller.get_all_post)
post_route.get('/get-local-post/',post_controller.get_local_post)
module.exports = post_route;