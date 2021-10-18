const express=require("express");
const bodyParser=require("body-parser");

const foodRoutes=require("./routes/food-routes");
const userRoutes=require("./routes/user-routes");

const app=express();

app.use(bodyParser.json());

app.use("/api/food",foodRoutes);
app.use("/api/user",userRoutes);

app.use(function(error,req,res,next){
    if(req.headerSent){
        return next(error);
    }
    res.status(error.code||500);
    res.json({message:error.message||"An unknown error occurred."});
});

app.listen(5000);