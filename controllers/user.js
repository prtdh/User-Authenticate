const User=require('../model/User')
const  bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const createUser=async (req,res)=>{

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
        res.status(200).json(savedUser)
    } catch (error) {
res.status(400).json({error})
    }
}

// login user

const loginUser=async (req,res)=>{
     // check if email already exist
    const user=await User.findOne({email:req.body.email})
    if (!user) {
       return res.status(400).send("email doesn't exist")
    }
    const validPass=await bcrypt.compare(req.body.password,user.password)
    if (!validPass) {
      return  res.status(400).send('Invalid Password')
    }

    //generate jwt token
    const token =jwt.sign({_id:user._id},process.env.jwt_secret)
    res.header('auth-token',token).send(`user logged in with token : "${token}"`)
}


module.exports={createUser,loginUser}