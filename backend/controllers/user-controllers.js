const {validationResult}=require("express-validator");

const HttpError=require("../models/http-error");
const User=require("../models/user");
const Nutrient=require("../models/nutrient");
const Food=require("../models/food");

async function login(req,res,next){
    const {email,password}=req.body;
    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
        return next(new HttpError("Logging in failed,try again later",500));
    }
    if(!existingUser||existingUser.password!==password){
        return next( new HttpError("Invalid credentials",401));
    }
    res.json({"message":"Logged in successfully"});
}

async function signup(req,res,next){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid inputs passed",422));
    }
    const {name,age,email,password}= req.body;
    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
        return next(new HttpError("Signup failed,try again later",500));
    }
    if(existingUser){
        return next(new HttpError("User already exists, login instead",422));
    }
    const newUser=new User({
        name,
        age,
        image:"url",
        email,
        password
    });
    try{
        await newUser.save();
    }catch(err){
        return next(new HttpError("Could not create user, try again later",500));
    }
    res.status(201).json({"message": "User created successfully"});
}

async function getUser(req,res,next){
    const userId=req.params.uid;
    let foundUser,foundNutrients;
    try{
        foundUser=await User.findById(userId,"-password");
    }catch(err){
        return next(new HttpError("Could not fetch user,try again later",500));
    }
    try{
        foundNutrients=await Nutrient.find({userId:userId});
    }catch(err){
        return next(new HttpError("Could not fetch user,try again later",500));
    }
    if(!foundUser){
        return next(new HttpError("User does not exist",404));
    }
    if(!foundNutrients){
        return next(new HttpError("No data found",404));
    }
    res.json({
        user:foundUser.toObject({getters:true}),
        nutrients:foundNutrients.map(n=>n.toObject({getters:true}))
    });
}

async function updateUser(req,res,next){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid inputs passed",422));
    }
    const {email,age,password}=req.body;
    const userId=req.params.uid;
    let foundUser;
    try{
        foundUser=await User.findById(userId);
    }catch(err){
        return next(new HttpError("Cound not update details,try again later",500));
    }
    if(foundUser.password!==password){
        return next(new HttpError("Incorrect password",401));
    }
    foundUser.age=age;
    foundUser.email=email;
    try{
        await foundUser.save();
    }catch(err){
        return next(new HttpError("Cound not update details,try again later",500));
    }
    res.json({"message":"updated successfully"});
}

async function postNutrients(req,res,next){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid inputs passed",422));
    }
    const userId=req.params.uid;
    const{date,foodName,foodWeight}=req.body;
    let foundNutrientData,foundFoodData;
    try{
        foundNutrientData=await Nutrient.findOne({userId:userId,date:date});
    }catch(err){
        return next(new HttpError("Could not complete your request,please try again later",500));
    }
    try{
        foundFoodData=await Food.findOne({title:foodName});
    }catch(err){
        return next(new HttpError("Food item not found,please add the item first",404));
    }
    const carbs=foodWeight*foundFoodData.carbs/foundFoodData.weight;
    const fats=foodWeight*foundFoodData.fats/foundFoodData.weight;
    const calories=foodWeight*foundFoodData.calories/foundFoodData.weight;
    const proteins=foodWeight*foundFoodData.proteins/foundFoodData.weight;
    if(foundNutrientData){
        foundNutrientData.fats+=fats;
        foundNutrientData.calories+=calories;
        foundNutrientData.proteins+=proteins;
        foundNutrientData.carbs+=carbs;
        try{
            await foundNutrientData.save();
        }catch(err){
            return next(new HttpError("Could not complete your request,please try again later",500));
        }
    }else{
        const newNutrientData=new Nutrient({
            date,
            userId,
            carbs,
            fats,
            calories,
            proteins
        });
        try{
            await newNutrientData.save();
        }catch(err){
            console.log(err);
            return next(new HttpError("Could not complete your request,please try again later",500));   
        }
    }
    res.json({"message":"Successfully saved the deatils"});
}

exports.signup=signup;
exports.login=login;
exports.getUser=getUser;
exports.updateUser=updateUser;
exports.postNutrients=postNutrients;