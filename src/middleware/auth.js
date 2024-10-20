// auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'TimberTechClaveJWTPrueba';

export const verifyToken = (req, res, next) => {
    try {
        // Primero verifica si hay cookies, si no, busca en headers
        const token = req.cookies?.jwt || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.redirect('/login');
        }

        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.redirect('/login');
    }
};

export const redirectIfAuthenticated = (req, res, next) => {
    // Primero verifica si hay cookies
    if (!req.cookies) {
        return next();
    }

    const token = req.cookies.jwt;

    if (token) {
        try {
            jwt.verify(token, JWT_SECRET, (err, user) => {
                if (!err) {
                    return res.redirect('/');
                }
                res.clearCookie('jwt');
                next();
            });
        } catch (error) {
            res.clearCookie('jwt');
            next();
        }
    } else {
        next();
    }
};