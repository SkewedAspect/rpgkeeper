//----------------------------------------------------------------------------------------------------------------------
// Configuration for RPGKeeper
//----------------------------------------------------------------------------------------------------------------------

const DEBUG = (process.env.DEBUG?.toLowerCase() === 'true') ?? false;
const UNIT_TESTS = (process.env.UNIT_TESTS?.toLowerCase() === 'true') ?? false;

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    debug: DEBUG,
    debugStream: DEBUG,
    overrideAuth: DEBUG,
    unitTests: UNIT_TESTS,
    secret: process.env.SESSION_SECRET ?? 'etched municipality unconscionably fribble *&^%$## 88',
    key: 'rpgk_session',
    google: {
        clientID: '712153107187-8e00g8d18nbk5esiffhkrbtr12vktlvq.apps.googleusercontent.com',
        clientSecret: process.env.CLIENT_SECRET ?? 'hOsFjUL-f_yky8djy1OSuvmp'
    },
    http: {
        secure: false,
        port: process.env.SERVER_PORT ?? 5678
    },
    database: {
        connection: {
            filename: './db/rpgk.db'
        }
    },
    mail: {
        api: process.env.MAILGUN_KEY ?? 'key-7ff79b53f0f751441fc07d2a325cedb3'
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
