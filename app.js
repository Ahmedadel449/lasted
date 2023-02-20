const express =require ('express');
const mongoose = require ('mongoose');
const path = require('path');

const app =express(); 

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Ahmed:01214548429@test.0zokfyo.mongodb.net/lap?retryWrites=true&w=majority",

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
