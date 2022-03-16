const express=require("express");
const indexRouter=express.Router();
const books=require("./../models/books");
indexRouter.get("/",async (req,res)=>{
   const book=await books.find().sort({createdAt:"desc"}).limit(10)  ;
   res.render("index",{books:book});
});

module.exports=indexRouter;

