//----------------------------------------------------------------------------------------------------------------------
// Configuration for RPGKeeper
//
// @module characters.js
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    debug: true,
    secret: process.env.SESSION_SECRET || "etched municipality unconscionably fribble *&^%$## 88",
    key: "rpgmap-session",
    google: {
        clientID: "712153107187-8e00g8d18nbk5esiffhkrbtr12vktlvq.apps.googleusercontent.com",
        clientSecret: process.env.CLIENT_SECRET || "hOsFjUL-f_yky8djy1OSuvmp"
    },
    http: {
        domain: process.env.WEB_DOMAIN || 'http://localhost:4500',
        port: process.env.SERVER_PORT || 5678
    },
    rethink: {
        host: process.env.RETHINK_DB_HOST || 'localhost',
        port: process.env.RETHINK_DB_PORT || 28015,
        db: 'rpgmap'
    },
    logging: {
        streams: [
            {
                stream: process.stdout,
                level: "info"
            }
        ]
    },
    mail: {
        api: process.env.MAILGUN_KEY || "key-7ff79b53f0f751441fc07d2a325cedb3"
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------