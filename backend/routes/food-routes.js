const express=require("express");
const {check}=require("express-validator");

const router=express.Router();

const foodControllers=require("../controllers/food-controllers");

router.get("/",foodControllers.getFoodItems);

router.post("/newitem",
[
    check("title").not().isEmpty(),
    check("calories").not().isEmpty(),
    check("carbs").not().isEmpty(),
    check("proteins").not().isEmpty(),
    check("weight").not().isEmpty(),
    check("fats").not().isEmpty(),
    check("water").not().isEmpty()
],
foodControllers.addFoodItem);


module.exports=router;