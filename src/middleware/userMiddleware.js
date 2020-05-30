import {Router} from 'express';
import {check,validationResult} from 'express-validator';




export default ()=>{
    let userMiddleware = Router()

    userMiddleware.use('/register',
    check('email').isEmail(),
    check('firstName').custom((value,{req}) => {
        if(value === null || value === ""|| !(value)){
            throw new Error('First name cannot be null')
        } 
        return true;
    }),
    check('password').isLength(5).isAlphanumeric(),
    (req,res,next) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            console.log("here")
            req.validation = "Validation-failed"
            next(error)
        }
        next()
    })

    return userMiddleware;
}