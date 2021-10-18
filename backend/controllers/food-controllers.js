const uuid=require("uuid").v4;
const{validationResult}=require("express-validator");

const HttpError=require("../models/http-error");

let foodItems=[{
    id:1234,
    title:"burger",
        calories:"250",
        weight:"100",
        carbs:"120",
        fats:"40",
        proteins:"20",
        water:"50"
}]

function getFoodItems(req,res,next){
    res.json(foodItems);
}

function addFoodItem(req,res,next){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid inputs passed",422));
    }
    const {title,calories,weight,carbs,fats,proteins,water}=req.body;
    const newItem={
        id: uuid(),
        title,
        calories,
        weight,
        carbs,
        fats,
        proteins,
        water
    }
    foodItems.push(newItem);
    res.status(201).json({"message": "Item added successfully"});
}


exports.getFoodItems=getFoodItems;
exports.addFoodItem=addFoodItem;