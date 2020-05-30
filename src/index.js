import express from 'express';
import config from './config'



let app = express()
app.listen(config.port,() => console.log('Started server on port '+config.port) );
