import mongoose from 'mongoose';
import config from './config';

export default (callback) => {
    let db = mongoose.connect(config.mongoUrl,{useNewUrlParser:true, useUnifiedTopology: true });
    mongoose.set('useCreateIndex',true);
    mongoose.set('useFindAndModify', false);
    callback(db);
}