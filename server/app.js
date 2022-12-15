const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser1 = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const HandleAccounts = require('./routes/HandleAccounts')
const HandleCreators = require('./routes/HandleCreators')
const HandleEvent = require('./routes/HandleEvents')


const uri = "mongodb+srv://homeric:Mq5VhyJlLs824rmK@cluster0.gclzigv.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then((result)=> { console.log("Connected to mongoDb (shoval is slightly gay)")}).catch((err)=> console.log("sdadas ", err))

app.set('view engine', 'ejs')

app.use(morgan('dev'));
app.use(bodyParser1.urlencoded({extended:false}));
app.use(bodyParser1.json());


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} 
else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000' , "https://pikmeserver.herokuapp.com/"],
        credentials: true
    }
    app.use(cors(corsOptions))
}


app.use('/handle-event', HandleEvent)
app.use('/handle-account', HandleAccounts)
app.use('/handle-creator', HandleCreators)

app.use((req,res,next)=>{
    const error = new Error('Not fsound')
    error.status = 404
    next(error)
});
app.use((error, req,res,next)=>{
    res.status(error.status || 500)
    res.json({
        error:{
            mesage: error.mesage
        }
    });
});

module.exports = app 