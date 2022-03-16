const express=require("express");
const mongoose=require("mongoose");
const books=require("./books");
const auth=mongoose.Schema({
    aname:{
        type:String,
        required:true
    }
});

auth.pre("remove",function(next){
      books.find({author:this.id},(err,bookss)=>{
       if(err)
       {next(err);}
       else if(bookss.length>0)
       {
           next(new Error("Author still has books!Cant delete author"));
       }else{
         next();
       }
      }
    )
});
module.exports=mongoose.model("authors",auth);