import express from "express";
import { fileURLToPath } from "url";
import { join, dirname } from 'path';
import morgan from "morgan";
import { engine } from "express-handlebars";
import { sequelize } from './database.js';
import { Paquete } from "./models/Paquete.js";
import routes from './routes/paquetes.routes.js';

// init
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.use(routes);

/* HOME */
app.get('/', (req, res) => {
    res.render('index');
});

/* REGISTROS */
app.get('/crear-registro', (req, res) => {
    res.render('partials/registros/crear-registro');
});

// public files
app.use(express.static(join(__dirname, 'public')));

sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
}).catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
});

// run server
app.listen(app.get('port'), () => {
    console.log('Server running on port ', app.get('port'));
});