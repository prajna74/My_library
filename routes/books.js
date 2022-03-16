const express=require("express");
const brouter=express.Router();
const path=require("path");
const books=require("./../models/books");

brouter.use(express.urlencoded({extended:false}));
const authors=require("./../models/authors");
const multer=require("multer");

const uploadPath=path.join("public",books.coverImage);
const imageMimeTypes=["image/jpeg","image/png","image/gif"];
const uploads=multer({
    dest:uploadPath,
    fileFilter:(req,file,callback)=>{
        callback(null,imageMimeTypes.includes(file.mimetype));
    }
})

brouter.get("/index",async (req,res)=>{
    var searchbook="";
    var pbefore=req.query.pbefore==null?"":req.query.pbefore;
    var pafter=req.query.pafter==null?"":req.query.pafter;
    if(req.query.book!=null && req.query.book!="")
    searchbook=req.query.book;
    try{
        const book=await books.find({
            $or:[
            {publishedDate:{
                $gte:pafter,
                $lte:pbefore
            }},
            {title:{$regex:searchbook}}
        ]});
        res.render("books/index",{books:book});
       
    }
   catch(e)
   {
       res.redirect("/books/new");
   }
})

brouter.get("/new",async (req,res)=>{
    const author= await authors.find();
    const book=new books();
    res.render("books/new",{
        authors:author,
        book:book,
    });
})

brouter.post("/",uploads.single("coverImage"),async (req,res)=>{
    const fileName= req.file==null ? "": req.file.filename;
    const book=new books({
          title:req.body.title,
          author:req.body.author,
          publishedDate:new Date(req.body.publishedDate),
          pagecount:req.body.pagecount,
          description:req.body.description,
          coverImage:fileName
    });
    try{
       await book.save();
       res.redirect("/books/index");
    }catch(e)
    {
        console.log(e);
        res.redirect("/books/new");
    }
});

brouter.get("/show/:id",async (req,res)=>{
    const book=await books.findById(req.params.id);
    const auth=await authors.findById(book.author);
    res.render("books/show",{books:book,author:auth});
})

brouter.delete("/delete/:id",async(req,res)=>{
    await books.findByIdAndDelete(req.params.id);
    res.redirect("/books/index");
})

brouter.get("/edit/:id",async (req,res)=>{
    const author= await authors.find();
    const book=await books.findById(req.params.id);
    res.render("books/edit",{
        authors:author,
        book:book,
    });
});

brouter.put("/:id",uploads.single("coverImage"), async (req,res)=>{
    const fileName= req.file==null ? "": req.file.filename;
    let book=await books.findById(req.params.id);
          book.title=req.body.title;
          book.author=req.body.author;
          book.publishedDate=new Date(req.body.publishedDate);
          book.pagecount=req.body.pagecount;
          book.description=req.body.description;
          book.coverImage=fileName;
    try{
       await book.save();
       res.redirect("/books/index");
    }catch(e)
    {
        console.log(e);
        res.redirect("/books/new");
    }
})

module.exports=brouter;