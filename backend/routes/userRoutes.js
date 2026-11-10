const express =require("express");
const { register, login, getMe, logout } = require("../controllers/authController");
const authmiddelware=require("../middelware/authmiddelware");
const router=express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/me', authmiddelware.protect, getMe);
router.post('/logout', authmiddelware.protect,logout);
module.exports=router;