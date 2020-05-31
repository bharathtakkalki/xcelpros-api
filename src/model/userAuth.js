import mongoose from 'mongoose';

let userAuthSchema = mongoose.Schema({
    accessToken:{
        type:String,
    },
    loginAt:{
        type:Date,
        default:Date.now()
    },
    logoutAt:{
        type:Date
    },
    expiresAt:{
        type:Date
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }


})

let UserAuth = mongoose.model('UserAuth',userAuthSchema)

module.exports = UserAuth;