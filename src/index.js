import express from 'express';
import config from './config';
import routes from './routes';
import bodyParser from 'body-parser';
import cors from 'cors';


let app = express()

//body-parser
app.use(bodyParser.json({
    limit:config.limit
}))

app.use(cors({exposedHeaders: ['Authorization'],credentials:true}))


//api routes v1
app.use('/v1',routes);

//Start Server
app.listen(config.port,() => console.log('Started server on port '+config.port) );

export default app;