const express = require('express');
const router = require('./routes/router');
const methodOverride = require('method-override');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//asim 
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(flash())
app.use(session({
    secret: "this is secert text and have to be somewhat long",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.set('view engine','ejs');
app.use(methodOverride('_method',{methods: ['POST','GET']}));
//this line for enableing the pictures,js,css
app.use('/public', express.static('public'));
app.use('/img',express.static('img'));
app.use('/css',express.static('/css/'));
app.use('/js',express.static('/js/'));


app.use('/', router);




app.listen(1234,()=>{
    console.log('port is open');
   
})