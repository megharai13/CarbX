const uuid=require("uuid").v4;
const {validationResult}=require("express-validator");

const HttpError=require("../models/http-error");

let users=[{
    id: 12345,
    name: "ram",
    age: "25",
    email: "ram@gmail.com",
    password: "rampass",
    phoneNumber: "1234567890"
}];

function login(req,res,next){
    const {email,password}=req.body;
    const identifiedUser=users.find(u=>u.email===email);
    if(!identifiedUser||identifiedUser.password!==password){
        return next( new HttpError("Invalid email or password",401));
    }
    res.json({"message":"Logged in successfully"});
}

function signup(req,res,next){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid inputs passed",422));
    }
    const {name,age,email,password,phoneNumber}= req.body;
    const u=users.find(u=>u.email===email);
    if(u){
        return next(new HttpError("User already exixts",403));
    }
    const newUser={
        id: uuid(),
        name,
        age,
        email,
        password,
        phoneNumber
    };
    users.push(newUser);
    res.status(201).json({"message": "User created successfully"});
}

function getUser(req,res,next){
    const userId=req.params.uid;
    const u=users.find(u=>u.id==userId);
    if(!u){
        return next(new HttpError("User does not exist",404));
    }
    res.json({u});
}

function updateUser(req,res,next){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid inputs passed",422));
    }
    const {name,age,phoneNumber,password}=req.body;
    const userId=req.params.uid;
    const u=users.find(u=>u.id==userId);
    if(u.password!==password){
        return next(new HttpError("Incorrect password",401));
    }
    u.name=name;
    u.age=age;
    u.phoneNumber=phoneNumber;
    res.json({"message":"updated successfully"});
}

exports.signup=signup;
exports.login=login;
exports.getUser=getUser;
exports.updateUser=updateUser;