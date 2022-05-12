const express=require('express');
const auth = require('../middleware/auth');
const Task = require('../models/task');
const User = require('../models/user');


const router=new express.Router();


router.post('/tasks',auth,async (req,res)=>{
    // const task=new Task(req.body);

    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try {
        await task.save()
        res.send(task)
        
    } catch (error) {
        res.status(404).send(error)
    }

    
})

router.get('/tasks',async (req,res)=>{


    try {
        const task=await Task.find({})
        res.send(task)
    } catch (error) {
     
        res.send(500).send(error)
    }


    
})

router.get('/tasks/:id',auth,async (req,res)=>{

    const _id=req.params.id;

    try {

      const task=await Task.findOne({_id, owner:req.user._id})
        
       if(!task){
        return res.send('No task found')
    }

    res.send(task)
    } catch (error) {
        res.status(500).send(err)
    }

    
})


//update task by id

router.patch('/tasks/:id',async (req,res)=>{

    const updates=Object.keys(req.body);
    const allowedUpdates=['description','completed']

    const isValidator=updates.every((update)=>allowedUpdates.includes(update
        ))

    if(!isValidator){
        return res.status(400).send('Error:Invalid update')
    }

    try {

        const task=await Task.findById(req.params.id)

        updates.forEach((update)=>{
            task[update]=req.body[update]
        })

        await task.save();
        
        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})

        if(!task){
             return  res.status(404).send('There is no task')
        }
        
        res.send(task)

    } catch (error) {
        res.status(404).send((error));
    }
})

//delete task by id

router.delete('/tasks/:id',async (req,res)=>{

    try {

        const task=await Task.findByIdAndDelete(req.params.id);
        if(!task){
            return res.status(404).send("Task not Found")
        }

        res.send(task);
        
    } catch (error) {
        res.status(500).send(error)
    }
})


module.exports=router