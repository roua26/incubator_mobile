const express =require("express");
const { createBaby, getBaby, addVitalSigns, getAllBabies } = require("../controllers/babyController");
const authmiddelware=require("../middelware/authmiddelware");
const router=express.Router();
router.use(authmiddelware.protect);

router.route('/').post(createBaby);
router.get('/all',getAllBabies);
router.route('/:id').get(getBaby).post(addVitalSigns);


module.exports=router;