const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
const PostSchema = new mongoose.Schema(
    {
        userId:{
            type:ObjectId,
            ref:"User",
            // type:String,
            required:true
        },
        desc:{
            type:String,
            max:500
        },
        img:{
            type:String
        },
        time:{
            type:String,
        },
        date:{
            type:String,
        },
        likes:{
            type:Array,
            default:[]
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number],
                required: true
            },
        }
        
    },
    {timestamps: true}
);
PostSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("post",PostSchema);