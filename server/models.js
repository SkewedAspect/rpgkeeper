//----------------------------------------------------------------------------------------------------------------------
/// Models
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import trivialModels from 'trivialmodels';

var types = trivialModels.types;
var db = { errors: trivialModels.errors };

//----------------------------------------------------------------------------------------------------------------------

db.Account = trivialModels.define({
    name: 'Account',
    driver: {
        name: 'TrivialDB',
        options: {
            name: 'accounts',
            dbPath: 'server/db',
            pk: 'email'
        }
    },
    schema: {
        email: types.String({ pk: true }),
        hash: types.String(),
        salt: types.String({ default: 'super-insecure-salt' }),
        iterations: types.Number({ default: 10000 }),
        mutedChats: types.Array({ default: [] }),
        created: types.Date({ auto: true })
    }
});

db.Character = trivialModels.define({
    name: 'Character',
    driver: {
        name: 'TrivialDB',
        options: {
            name: 'characters',
            dbPath: 'server/db'
        }
    },
    schema: {
        id: types.String({ pk: true }),
        name: types.String({ required: true }),
        avatar: types.String({ default: "https://placeholdit.imgix.net/~text?txtsize=33&txt=250%C3%97250&w=250&h=250" }),
        primary: types.Boolean({ default: false }),
        account: types.String({ required: true })
    }
});

db.Chat = trivialModels.define({
    name: 'Chat',
    driver: {
        name: 'TrivialDB',
        options: {
            name: 'chats',
            dbPath: 'server/db'
        }
    },
    schema: {
        id: types.String({ pk: true }),
        name: types.String(),
        type: types.String({ required: true }),
        avatar: types.String({ default: "https://placeholdit.imgix.net/~text?txtsize=33&txt=250%C3%97250&w=250&h=250" }),
        participants: types.Array({ required: true }),
        characters: types.Array({ default: [] }),
        owner: types.String(),
        archived: types.Boolean({ default: false })
    }
});

db.Message = trivialModels.define({
    name: 'Message',
    driver: {
        name: 'TrivialDB',
        options: {
            name: 'messages',
            dbPath: 'server/db'
        }
    },
    schema: {
        id: types.String({ pk: true }),
        type: types.String({ required: true }),
        chat: types.String({ required: true }),
        content: types.String({ required: true }),
        character: types.String({ required: true }),
        sent: types.Date({ auto: true })
    }
});

//----------------------------------------------------------------------------------------------------------------------

export default db;

//----------------------------------------------------------------------------------------------------------------------