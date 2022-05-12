const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
type:String,
required:true,
unique:true,
trim:true,
lowercase:true,
validate:(value)=>{
    if(!validator.isEmail(value)){
        throw new Error('Email is invalid')
    }
}
    },
    password:{
type:String,
minlength:7,
trim:true,
validate:(value)=>{
if(value.includes('password')){
    throw new Error('Password cannot contain password')
}
}

    },
    age:{
        type:Number,
        min:0

    },

    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject();

delete userObject.password
delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken=async function(){
    const user=this

    const token=jwt.sign({_id:user._id.toString()},'liveyourlife')
    user.tokens=user.tokens.concat({token})

    await user.save();
    return token;
}

userSchema.statics.findByCredentials=async (email,password)=>{

    const user=await User.findOne({email:email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user;
}

//Hashing the password
userSchema.pre('save', async function(){
    const user=this
    
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    return
})


const User=mongoose.model('User',userSchema)



module.exports=User;
