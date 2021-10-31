const{validationResult}=require("express-validator");

const HttpError=require("../models/http-error");
const Food=require("../models/food");

async function getFoodItems(req,res,next){
    let foundFoodItems;
    try{
        foundFoodItems=await Food.find();
    }catch(err){
        return next(new HttpError("Something went wrong, could not find food items.",500));
    }
    if(!foundFoodItems){
        return next(new HttpError("No food items found",404));
    }
    res.json({
        foodItems: foundFoodItems.map(food=>food.toObject({getters:true}))
    });
}

async function addFoodItem(req,res,next){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid inputs passed",422));
    }
    const {title,calories,weight,carbs,fats,proteins,water}=req.body;
    const newFoodItem= new Food({
        title,
        image:"url",
        calories,
        weight,
        carbs,
        fats,
        proteins,
        water
    });
    try{
        await newFoodItem.save();
    }catch(err){
        return next(new HttpError("New food item could not be created,Please try again",500));
    }
    res.status(201).json({"message": "Item added successfully"});
}


exports.getFoodItems=getFoodItems;
exports.addFoodItem=addFoodItem;