import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import UserAuth from '../model/userAuth';


const TOKENTIME = 60*60
const SECRET = 'Batman 1s C00l & N0t Superman';

let authenticateToken = expressJwt({credentialsRequired: false,secret:SECRET});
    
let checkLoggedOut = (req,res,next) => {
    UserAuth.findOne({user:req.user.uuid})
    .then(user => {
        if(user.logoutAt){
            const error = new Error()
            error.json = {message:"User has logged out please login",errorCode:"ATH-003"}
            error.statusCode =  401
            next(error)
        }else{
            next();
        }
    })
}


let generateAccessToken = (req,res,next)=> {
    req.token = jwt.sign({
        email:req.user.email,
        uuid:req.user._id
    },SECRET,{
        expiresIn:TOKENTIME
    });
    next();
}

let respond = (req,res,next) =>{
    let newAuth = new UserAuth({
        accessToken:req.token,
        expiresAt:new Date(new Date().getTime() + TOKENTIME*1000),
        user:req.user.id,
    })
    newAuth.save()
    .then(result =>{
        res.setHeader('Authorization',req.token)
        res.status(200).json({
            uuid:req.user.id,
        });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    })
};

module.exports = {
    generateAccessToken,
    respond,
    authenticateToken,
    checkLoggedOut
};
