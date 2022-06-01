const express=require('express');
const Order=require('../models/order');


const router=new express.Router();

router.post('/orders',async (req,res)=>{

    const order=new Order(req.body);
    try {
        
        await order.save();
        res.send(order);
    } catch (error) {
        console.log(error);
    }
})


module.exports=router;
