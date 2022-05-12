const User=require('../models/user')
const jwt=require('jsonwebtoken')

const profile={}
const auth=async (req,res,next)=>{
    try {
        
        const token=req.header('Authorization').replace('Bearer ','');
        const decode=jwt.verify(token,'liveyourlife')
        const user=await User.findOne({_id:decode._id,'tokens.token':token})

        if(!user){
            throw new Error()
        }
        req.token=token;
        req.user=user;
       


        next()
    } catch (e) {
     
        res.status(401).send({Error:"Please authenticate"})
    }
}

module.exports=auth;