const express =require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore =require('express-mysql-session');
const pasport = require('passport');

const {database}=require('./keys');

//initializations
const app= express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 4200);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs',exphbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'parcials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine','.hbs');

//middlewares
app.use(session({
    secret:'larrymysqlnodesession',
    resave:false,
    saveUninitialized:false,
    store: new MySQLStore(database)
}));
app.use (flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(pasport.initialize());
app.use(pasport.session());


//global Variables
app.use((req,res,next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));
app.use('/clientes',require('./routes/clientes'));
app.use('/categorias',require('./routes/categorias'));
app.use('/productos',require('./routes/productos'));
app.use('/entradas',require('./routes/entradas'));
app.use('/salidas',require('./routes/salidas'));
app.use('/in',require('./routes/in'));
app.use('/ventas',require('./routes/ventas'));


//Public
app.use(express.static(path.join(__dirname,'public')));


//Starting the server
app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
});