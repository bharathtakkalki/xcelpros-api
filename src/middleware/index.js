import express from 'express';
import userMiddleware from './userMiddleware';







export default()=> {

    let middlewareRouter = express();

    //All Middleware defined here
    middlewareRouter.use('/user',userMiddleware())


    return middlewareRouter;

}
