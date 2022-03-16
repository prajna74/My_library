const express=require("express");
const methodOverride = require("method-override");
const authors=require("./../models/authors");
const books=require("./../models/books");
const arouter=express.Router();
arouter.use(methodOverride("_method"));
arouter.use(express.urlencoded({extended:false}));


arouter.get("/index",async (req,res)=>{ 
    let searchOptions=""
  if (req.query.name != null && req.query.name !== '') {
   searchOptions = req.query.name;
  }
  try {
    const auth = await authors.find({aname:{$regex:searchOptions}})
    res.render('authors/index', {
      authors: auth,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

arouter.get("/new",(req,res)=>{
    res.render("authors/new");
})


arouter.post("/",async(req,res)=>{
    const author=new authors({
        aname:req.body.aname
    });
    try{
        await author.save();
        res.redirect("/authors/index");
    }
    catch(e)
    {
        console.log(e);
        res.redirect("/authors/new");
    }
})

arouter.get("/view/:id",async(req,res)=>{
  const auth= await authors.findById(req.params.id);
  const bookss=await books.find({author:req.params.id});
  res.render("authors/view",{
    author:auth,
    books:bookss
  });
});

arouter.get("/edit/:id",async (req,res)=>{
      const auth=await authors.findById(req.params.id);
      res.render("authors/edit",{author:auth});

});

arouter.put("/:id",async (req,res)=>{
      const auth=await authors.findById(req.params.id);
       auth.aname=req.body.aname;
       try{
         await auth.save();
         res.redirect(`/authors/view/${auth.id}`);
       }
       catch(e)
       {
         console.log(e);
         res.redirect("/authors/index");
       }

})

arouter.delete("/:id",async(req,res)=>{
    const auth=await authors.findById(req.params.id);
    try{
      await auth.remove();
      res.redirect("/authors/index");
    }
    catch(e)
    {
      if(auth==null)
      res.redirect("/")
      else
      res.redirect(`/authors/view/${auth.id}`);
    }
    
})

module.exports=arouter;