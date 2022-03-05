const User=require('../model/User')
const  bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Joi=require('@hapi/joi')

const registerSchema = Joi.object({
    name: Joi.string().min(5).required(),
    email:Joi.string().email().min(8).required(),
    password:Joi.string().required().min(6)
})

const loginSchema = Joi.object({
    email:Joi.string().email().min(8).required(),
    password:Joi.string().required().min(6)
})

const createUser=async (req,res)=>{

    // validation
    const {error}  = registerSchema.validate(req.body);
    if (error) {
     return res.status(400).send(error.details[0].message)  
    } 

    // check if email already exist
    const emailExist=await User.findOne({email:req.body.email})
    if (emailExist) {
       return res.status(400).send('email already exists')
    }
    const salt=await bcrypt.genSalt(10);
    const hasedPassword=await bcrypt.hash(req.body.password,salt)
    const user = new User({
            name:req.body.name,
            email:req.body.email,
            password:hasedPassword
        })
    try {
        const savedUser=await user.save()
        res.status(201).json(savedUser)
    } catch (error) {
res.status(400).json({error})
    }
 }

// login user

const loginUser=async (req,res)=>{
     // check if email already exist
    const user=await User.findOne({email:req.body.email})
    if (!user) {
       return res.status(404).send("email doesn't exist")
    }
    const validPass=await bcrypt.compare(req.body.password,user.password)
    if (!validPass) {
      return  res.status(401).send('Invalid Password')
    }

    //generate jwt token
    const token =jwt.sign({_id:user._id},process.env.jwt_secret,{

           expiresIn: '8h' // expires in 8 hours

      })
    res.status(202).header('auth-token',token).send(`user logged in with token : "${token}"`)
}


module.exports={createUser,loginUser}
