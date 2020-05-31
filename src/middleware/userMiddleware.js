import {Router} from 'express';
import {check,validationResult} from 'express-validator';
import User from '../model/user';




export default ()=>{
    let userMiddleware = Router()

    userMiddleware.use('/register',
    check('email').isEmail().withMessage({ message: 'Email id is not valid', errorCode: 'SGN-003' }).custom((value,{req})=> {
        return User.findOne({email:value})
        .then(user =>{
            if(user){
                return Promise.reject({ message: 'Email id already exists', errorCode: 'SGN-004' })
            }
        })
    }).normalizeEmail(),
    check('firstName').trim().not().isEmpty().withMessage({ message: 'First name cannot be empty', errorCode: 'SGN-005' }),
    check('password').trim().isLength(5).isAlphanumeric().withMessage({ message: 'Password not strong enough,enter alpha numeric with min 5 length ', errorCode: 'SGN-003' }),
    (req,res,next) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            req.validation = "Validation-failed"
            error.json = error.errors
            error.statusCode = 400
            next(error)
        }
        User.find

        next()
    })


    return userMiddleware;
}