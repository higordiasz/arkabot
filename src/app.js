const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var path = require('path');
const flash = require('express-flash');
const session = require('express-session');
require('dotenv').config();
const app = express();
//Carregando models

const Conta = require(`./model/Conta/Model`);
const Global = require(`./model/Global/Model`);
const Grupo = require(`./model/Grupo/Model`);
const Instagram = require(`./model/Instagram/Model`);
const LicenseInsta = require(`./model/LicenseInsta/Model`);
const Payment = require(`./model/Payment/Model`);
const Afiliado = require(`./model/Afiliados/Afiliado`);
const CadAfiliado = require(`./model/Afiliados/CadAfiliado`);
const VendAfiliado = require(`./model/Afiliados/VendAfiliado`);
const PagAfiliado = require(`./model/Afiliados/PagAfiliado`);
const Venda = require(`./model/Venda/Model`);
const DadosAtivo = require(`./model/Dados/Ativo`);
const DadosBloqueio = require(`./model/Dados/Bloqueio`);
const DadosCadastro = require(`./model/Dados/Cadastro`);
const DadosCadastroInsta = require(`./model/Dados/InstaCadastro`);
const DadosPlatAtivo = require(`./model/Dados/PlatAtivo`);
const DadosTarefa = require(`./model/Dados/Tarefa`);
const DadosTarefaPlat = require(`./model/Dados/TarefaPlat`);
const DadosUtilizacao = require(`./model/Dados/Utilizacao`);
const MobileUA = require(`./model/UserAgent/Mobile`);
const NavegadorUA = require(`./model/UserAgent/Navegador`);

//Carregando Passport
const passport = require('passport');
require('./config/passport')(passport);
app.set('trust proxy', true)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/assets', express.static(path.join(__dirname, 'public/assets')))
app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')))
app.use('/img', express.static(path.join(__dirname, 'public/img')))
app.use('/js', express.static(path.join(__dirname, 'public/js')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Flash
app.use(flash());
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Database
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Mongoose default connection is open');
});

db.on('error', err => {
    console.log(`Mongoose default connection has occured \n${err}`);
});

db.on('disconnected', () => {
    console.log('Mongoose default connection is disconnected');
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log(
            'Mongoose default connection is disconnected due to application termination'
        );
        process.exit(0);
    });
});

//Mercado Pago
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: 'APP_USR-892335237051732-052613-9ef6bf964d8583d583021bbe0467d055-416710926'
});

// Ativar o HTTPS
app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele
    if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) //Checa se o protocolo informado nos headers é HTTP 
        res.redirect(`https://${req.headers.host}${req.url}`); //Redireciona pra HTTPS 
    else //Se a requisição já é HTTPS 
        next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado 
});

const gniRouter = require('./router/gni-router');
app.use('/api/gni', gniRouter);

const dizuRouter = require('./router/dizu-router');
app.use('/api/dizu', dizuRouter);

const kzomRouter = require('./router/kzom-router');
app.use('/api/kzom', kzomRouter);

const apiRouter = require('./router/api-router');
app.use('/api', apiRouter);

const indexRouter = require('./router/index-router');
app.use('/', indexRouter);

const mpRouter = require('./router/mp-router');
app.use('/checkout', mpRouter);

const afiliadoRouter = require('./router/afiliado-router');
app.use('/afiliado', afiliadoRouter)

app.use((req, res, next) => {
    return res.render('notvalidlink', { user: [], erro: "Pagina não encontrada" });
})

module.exports = app;