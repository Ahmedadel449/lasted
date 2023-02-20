const express =require ('express');
const mongoose = require ('mongoose');
const path = require('path');

const app =express(); 

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/news",

{useNewUrlParser:true , useUnifiedTopology: true}, (err) => {
    if (err){
     console.log(err)
     return
    }else{
        console.log('connecting to DB')
    }
});
 
//user routes
const user_routes = require("./routers/userrouter");
const post_routes = require("./routers/postrouter")
app.use('/news',user_routes)
app.use('/posts',post_routes)

const port = process.env.PORT ||8080
app.listen(port,() => console.log('server listen on part 8080'));
