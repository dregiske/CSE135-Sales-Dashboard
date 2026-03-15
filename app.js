require('dotenv').config();

const express = require('express');
const session = require('express-session');
const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/', authRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
