const express=require("express");
const {check}=require("express-validator");

const router=express.Router();

const userControllers=require("../controllers/user-controllers");

router.post("/login",userControllers.login);

router.post("/signup",
[
    check("name").not().isEmpty(),
    check("age").not().isEmpty(),
    check("phoneNumber").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({min:8})
],
userControllers.signup);

router.get("/:uid",userControllers.getUser);

router.patch("/:uid",
[
    check("name").not().isEmpty(),
    check("age").not().isEmpty(),
    check("phoneNumber").not().isEmpty(),
]
,userControllers.updateUser);

module.exports=router;