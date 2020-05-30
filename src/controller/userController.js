import {Router} from 'express';







export default()=>{
    let api = Router()

    api.post('/register',(req,res,next) => {
        console.log('iam in controller')
         res.json("Got it");
    })


    return api;
}