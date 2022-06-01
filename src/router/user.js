
const express=require('express');
const auth = require('../middleware/auth');
const User=require('../models/user')
const bcrypt=require('bcrypt')



const router=new express.Router();



router.post('/users',async (req,res)=>{
    const user=new User(req.body);
    

    try {
        await user.save();

        const token=await user.generateAuthToken()
        res.status(201).json(user)
    } catch (error) {

        res.send(error)
    }

})

router.post('/users/login',async (req,res)=>{

    try {

        const user=await User.findByCredentials(req.body.email,req.body.password);

        const token=await user.generateAuthToken()
        res.send({user,token})
    } catch (e) {
        res.status(400).send();
    }
})

router.get('/users/me',auth, async (req,res)=>{

   res.json(req.user)
   
})


router.post('/users/logout',auth,async (req,res)=>{

    try {
        
        req.user.tokens=req.user.tokens.filter((token)=>{

            return token.token!==req.token
        })

        await req.user.save();

        res.send()

    } catch (e) {
        
        res.status(500).send()
    }

})


router.post('/users/logoutAll',auth,async (req,res)=>{

    try {
        req.user.tokens=[];
        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500).send()
    }
})




//update user by id
router.patch('/users/me',auth,async (req,res)=>{

    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age'];

    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send('error:Invalid updates')
    }

    try {
        


updates.forEach((update)=>{
    req.user[update]=req.body[update]
})

await req.user.save();

        // const user=await User.findByIdAndUpdate(req.params.id,req.body, {new:true,runValidators:true})

        

        res.send(req.user);
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete user by id

router.delete('/users/me',auth,async (req,res)=>{

    try {

        // const user=await User.findByIdAndDelete(req.user._id);
        // if(!user){
        //     return res.status(404).send("User not Found")
        // }

        await req.user.remove();
        res.send(req.user);
        
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/admin/users-info', async (req,res)=>{
    const users=await User.find();
    if(!users){
        return res.send('No User Found')
    }

    res.send(users)
})

router.patch('/admin/update-user/:id',async (req,res)=>{

    const _id=req.params.id;

    
try {

    const user=await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
    await user.save()
    res.send(user)
} catch (error) {
    res.send(error)
}
})

router.delete('/admin/delete-user/:id',async (req,res)=>{
    
   
   
try {
    const user=await User.findByIdAndDelete(req.params.id);
    res.send('Deleted') 
} catch (error) {
    res.send(error)
}
   
})

router.post('/admin-login',async (req,res)=>{
   
    try {
        const user=await User.findByAdminCredential(req.body.email,req.body.password);

   const token=await user.generateAuthToken()

   res.send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }
    
})

module.exports=router;
