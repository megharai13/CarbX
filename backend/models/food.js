const mongoose=require("mongoose");

const foodSchema=new mongoose.Schema({
    title:{type:String,required:true},
    image:{type:String,required:true},
    calories:{type:Number,required:true},
    weight:{type:Number,required:true},
    carbs:{type:Number,required:true},
    fats:{type:Number,required:true},
    proteins:{type:Number,required:true},
    water:{type:Number,required:true}
});

module.exports=mongoose.model("Food",foodSchema);