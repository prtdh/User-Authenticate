const express=require('express');
const router=express.Router();

const {createUser,loginUser,posts}=require('../controllers/user')
//VALIDATION


router.route('/register').post(createUser)
router.route('/login').post(loginUser)

module.exports=router;