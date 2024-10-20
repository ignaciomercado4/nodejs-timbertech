import jwt from 'jsonwebtoken';

const JWT_SECRET = 'TimberTechClaveJWTPrueba';

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
        
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

