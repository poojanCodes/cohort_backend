let express = require('express')
let userModel = require('../models/user.model.js')
let authRouter = express.Router();
let jwt = require('jsonwebtoken')
let crypto = require('crypto');
authRouter.post('/register',async(req,res)=>{
    const {email,name,password} = req.body ; 

        
    const isUserAlreadyExists = await userModel.findOne({email});
    if(isUserAlreadyExists){
        return res.status(409).json({
            message : "User with same email already exists"
        })
    }

    const hash = crypto.createHash('md5').update(password).digest('hex');
    
    let user = await userModel.create({
        email , name , password:hash
    });

    const token = jwt.sign(
        {
            id : user._id , 
        },
        process.env.JWT_SECRET
    )

    res.cookie('jwt_token',token);
    res.status(201).json({
        message : "User registered successfully",
        user,
        token
    })
});


authRouter.post('/protected',(req,res)=>{
    console.log(req.cookies);
    res.status(200).json({
        message : "This is protected route"
    })
});


authRouter.post('/login',async(req,res)=>{
    const {email,password} = req.body ; 

    const user = await userModel.findOne({email});
    if(!user){
        return res.status(404).json({
            message : "User does not exists"
        })
    }

    const isPasswordMatched = user.password===crypto.createHash('md5').update(password).digest('hex');

    if(!isPasswordMatched){
        return res.status(404).json({
            message : "Password Incorrect",
        })
    }

    const token = jwt.sign(
        {
            id : user._id,
        },
        process.env.JWT_SECRET,
        {expiresIn:'1h'}
    );

    res.cookie('jwt_token',token);

    res.status(200).json({
        message : "User logged in successfully",
        user
    })
});


authRouter.get('/get-me',async(req,res)=>{
    const token = req.cookies.jwt_token;

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    
    const user = await userModel.findById(decoded.id);

    res.json({
        name : user.name , 
        email : user.email , 
    })
})


module.exports = authRouter ; 