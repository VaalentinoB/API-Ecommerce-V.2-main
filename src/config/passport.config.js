import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from "passport-local";
import UsuarioModel from '../models/usuario.model.js';
import CartManager from '../dao/db/cart-manager-db.js';
import jwt from "passport-jwt";
import { createHash, isValidPassword } from '../util/util.js';
const cartManager = new CartManager()

const cookieExtractor = req => {
    let token = null;

    if (req && req.cookies) {
        token = req.cookies["passticketCookieToken"]
    }
}

const initializePassport = () => {
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([req => req.cookies['passticketCookieToken']]),
        secretOrKey: 'passticket'
    }, async (jwt_payload, done) => {
        try {
            const user = await UsuarioModel.findOne({ email: jwt_payload.usuario });
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }));
};

export default initializePassport;
