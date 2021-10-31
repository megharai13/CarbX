const mongoose=require("mongoose");

const nutrientSchema=new mongoose.Schema({
    date:{type:Date,required:true},
    userId:{type:mongoose.Types.ObjectId,required:true,ref:"User"},
    calories:{type:Number,required:true},
    fats:{type:Number,required:true},
    carbs:{type:Number,required:true},
    proteins:{type:Number,required:true}
});

module.exports=mongoose.model("Nutrient",nutrientSchema);