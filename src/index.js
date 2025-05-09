import express from 'express';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import { sequelize } from './database.js';
import paqueteRoutes from './routes/paquetes.routes.js';
import registroRoutes from './routes/registros.routes.js';
import authRoutes from './routes/auth.routes.js';

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
app.use(cookieParser());

// public files
app.use(express.static(join(__dirname, 'public')));

// routes 
app.use('/api/auth', authRoutes);
app.use('/', authRoutes);
app.use(paqueteRoutes);
app.use(registroRoutes);

// database sync
sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
}).catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
});

// run server
app.listen(app.get('port'), () => {
    console.log('Server running on port', app.get('port'));
});

export default app;