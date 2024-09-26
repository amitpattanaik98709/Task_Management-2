const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://amitpattanaik987:8AYkOkAk0FbWHKKX@cluster0.u6eaz.mongodb.net/");

const db=mongoose.connection;

db.on("connected",()=>{
    console.log("Database connected");
})

db.on("disconnected",()=>{
    console.log("Database disconnected");
})

db.on("error",(err)=>{
    console.log(err);
})

module.exports=db;