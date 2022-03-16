const express=require("express");
const { get } = require("express/lib/response");
const path=require("path");
const mongoose=require("mongoose");
const coverImages="uploads/coverImages";
const bookSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    pagecount:{
        type:Number,
        required:true
    },
    publishedDate:{
        type:Date,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    coverImage:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"authors"
    }
});
bookSchema.virtual("coverImagePath").get(function(){
        if(this.coverImage!=null){
        return path.join("/",coverImages,this.coverImage)
        }
});
module.exports=mongoose.model("books",bookSchema);
module.exports.coverImage=coverImages;
