import express from 'express';
import initializeDB from '../db';
import middleware from '../middleware';
import userController from '../controller/userController';



let router = express()



//Connect to DB
initializeDB(db => {
    console.log("Successful Connection established with DB")

    router.use(middleware())


    //api routes v1
    router.use('/user',userController())
    //error handling route
    router.use((err,req,res,next)=>{
        console.log("iam in error handler")
         res.json(err);
    });


});

export default router;