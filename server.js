const express=require("express");
const app=express();
const expressLayouts=require("express-ejs-layouts");
app.set("view engine","ejs");
app.set("views",__dirname+"/views");
app.set("layout","layouts/layout");
app.use(expressLayouts);
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'))


const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/mybrary");
const db=mongoose.connection;
db.on("error",(error)=>console.error(error));
db.once("open",()=>console.log("connected to mongoose"));



const indexRouter=require("./routes/index");
app.use("/",indexRouter);

const arouter=require("./routes/authors");
app.use("/authors",arouter);
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const brouter=require("./routes/books");
app.use("/books",brouter);




app.listen(process.env.PORT||5000);

