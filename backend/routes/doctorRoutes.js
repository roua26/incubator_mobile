const express = require('express');
const router = express.Router();

const authmiddelware=require("../middelware/authmiddelware");
const { createDoctor, getAllDoctors, getDoctor } = require('../controllers/doctorController');


router.use(authmiddelware.protect);


router.post('/create', createDoctor);
router.get('/', getAllDoctors);
router.get('/:id', getDoctor);

module.exports = router;