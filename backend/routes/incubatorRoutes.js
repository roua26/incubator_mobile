const express =require("express");
const { createIncubator } = require("../controllers/incubatorController");
const authmiddleware=require("../middelware/authmiddelware");

const router=express.Router();
router.use(authmiddleware.protect);

router.route('/').post(createIncubator);
module.exports=router;