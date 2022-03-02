const express=require('express')
const app=express();
const path=require('path')
const port=process.env.PORT||5000
const authroute=require('./routes/auth')
require('dotenv').config();
app.use(express.json())
//EJS

app.set('view engine','ejs')

//import mongoose

const connectDB=require('./db/connectdb')

 //Routes

 app.use('/api/user',authroute)




const start= async ()=>{

     try {
        await connectDB(process.env.db)
        app.listen(port,console.log(`app is listening on the ${port}`))
         
     } catch (error) {
    console.log(error);         
     }
}
start();