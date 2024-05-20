//----------------------------------------------------------------------------------------------------------------------
// HashID Primary Key Conversion
//----------------------------------------------------------------------------------------------------------------------

import { Knex } from 'knex';

//----------------------------------------------------------------------------------------------------------------------

export async function up(knex : Knex) : Promise<Knex.QueryBuilder>
{
    //------------------------------------------------------------------------------------------------------------------
    // Step 1: Rename tables, drop indexes
    //------------------------------------------------------------------------------------------------------------------

    await knex.schema.renameTable('account', 'bk_account');
    await knex.schema.renameTable('account_role', 'bk_account_role');
    await knex.schema.renameTable('ugc_mod_comment', 'bk_ugc_mod_comment');
    await knex.schema.renameTable('note', 'bk_note');
    await knex.schema.renameTable('note_page', 'bk_note_page');
    await knex.schema.renameTable('character', 'bk_character');

    //------------------------------------------------------------------------------------------------------------------
    // Step 2: Declare new tables
    //------------------------------------------------------------------------------------------------------------------

    // Account Table
    await knex.schema.createTable('account', (table) =>
    {
        table.string('account_id').primary();
        table.text('email').notNullable();
        table.text('name');
        table.text('avatar');
        table.json('permissions').notNullable()
            .defaultTo('[]');
        table.json('settings').notNullable()
            .defaultTo('{}');
        table.timestamp('created').notNullable()
            .defaultTo(knex.fn.now());
    });

    // Account Role Table
    await knex.schema.createTable('account_role', (table) =>
    {
        table.string('account_id')
            .references('account.account_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.integer('role_id')
            .references('role.role_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
    });

    // Mod Comment Table
    await knex.schema.createTable('ugc_mod_comment', (table) =>
    {
        table.increments('comment_id').primary();
        table.text('comment').notNullable();
        table.string('account_id')
            .references('account.account_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.integer('mod_id')
            .references('ugc_moderation.mod_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.timestamp('created').notNullable()
            .defaultTo(knex.fn.now());
        table.json('metadata').notNullable()
            .defaultTo('{}');
    });

    // The `notes` table
    await knex.schema.createTable('note', (table) =>
    {
        table.string('note_id').primary();
    });

    // The `notes_pages` table
    await knex.schema.createTable('note_page', (table) =>
    {
        table.integer('page_id').primary();
        table.text('title').notNullable();
        table.string('content');
        table.string('note_id')
            .references('note.note_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
    });

    // The `character` table
    await knex.schema.createTable('character', (table) =>
    {
        table.string('character_id').primary();
        table.string('system').notNullable()
            .index();
        table.string('name').notNullable();
        table.text('description');
        table.string('portrait');
        table.string('thumbnail');
        table.string('color');
        table.text('campaign');
        table.json('details').notNullable()
            .defaultTo('{}');
        table.string('note_id')
            .references('note.note_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('RESTRICT');
        table.string('account_id')
            .references('account.account_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
    });

    //------------------------------------------------------------------------------------------------------------------
    // Step 3: Copy tables.
    //------------------------------------------------------------------------------------------------------------------

    // Select out all the data from the old tables
    const accounts = await knex('bk_account').select();
    const account_roles = await knex('bk_account_role').select();
    const ugc_mod_comments = await knex('bk_ugc_mod_comment').select();
    const notes = await knex('bk_note').select();
    const note_pages = await knex('bk_note_page').select();
    const characters = await knex('bk_character').select();

    // Insert the data into the new tables
    if(accounts.length > 0)
    {
        await knex('account')
            .insert(accounts.map((account) =>
            {
                return {
                    account_id: account.hash_id,
                    email: account.email,
                    name: account.name,
                    avatar: account.avatar,
                    permissions: account.permissions,
                    settings: account.settings,
                    created: account.created
                };
            }));
    }

    if(account_roles.length > 0)
    {
        await knex('account_role')
            .insert(account_roles.map((account_role) =>
            {
                const account = accounts.find((acc) => acc.account_id === account_role.account_id);
                return {
                    account_id: account.hash_id,
                    role_id: account_role.role_id
                };
            }));
    }

    if(ugc_mod_comments.length > 0)
    {
        await knex('ugc_mod_comment')
            .insert(ugc_mod_comments.map((comment) =>
            {
                const account = accounts.find((acc) => acc.account_id === comment.account_id);
                return {
                    comment_id: comment.comment_id,
                    comment: comment.comment,
                    account_id: account.hash_id,
                    mod_id: comment.mod_id,
                    created: comment.created,
                    metadata: comment.metadata
                };
            }));
    }

    if(notes.length > 0)
    {
        await knex('note')
            .insert(notes.map((note) =>
            {
                return {
                    note_id: note.hash_id
                };
            }));
    }

    if(note_pages.length > 0)
    {
        await knex('note_page')
            .insert(note_pages.map((page) =>
            {
                const note = notes.find((nt) => nt.note_id === page.note_id);
                return {
                    page_id: page.page_id,
                    title: page.title,
                    content: page.content,
                    note_id: note.hash_id
                };
            }));
    }

    if(characters.length > 0)
    {
        await knex('character')
            .insert(characters.map((character) =>
            {
                const note = notes.find((nt) => nt.note_id === character.note_id);
                const account = accounts.find((acc) => acc.account_id === character.account_id);
                return {
                    character_id: character.hash_id,
                    system: character.system,
                    name: character.name,
                    description: character.description,
                    portrait: character.portrait,
                    thumbnail: character.thumbnail,
                    color: character.color,
                    campaign: character.campaign,
                    details: character.details,
                    note_id: note.hash_id,
                    account_id: account.hash_id
                };
            }));
    }

    //------------------------------------------------------------------------------------------------------------------
    // Step 4: Delete bk_* tables
    //------------------------------------------------------------------------------------------------------------------

    await knex.schema.dropTable('bk_account');
    await knex.schema.dropTable('bk_account_role');
    await knex.schema.dropTable('bk_ugc_mod_comment');
    await knex.schema.dropTable('bk_note');
    await knex.schema.dropTable('bk_note_page');
    await knex.schema.dropTable('bk_character');

    //------------------------------------------------------------------------------------------------------------------
    // Step 5: Re-add Indexes
    //------------------------------------------------------------------------------------------------------------------

    await knex.schema.table('account', (table) =>
    {
        table.unique('email');
    });

    await knex.schema.table('account_role', (table) =>
    {
        table.unique([ 'account_id', 'role_id' ]);
    });
}

//----------------------------------------------------------------------------------------------------------------------

export async function down(knex : Knex) : Promise<Knex.QueryBuilder>
{
    //------------------------------------------------------------------------------------------------------------------
    // Step 1: Rename tables, drop indexes
    //------------------------------------------------------------------------------------------------------------------

    await knex.schema.renameTable('account', 'bk_account');
    await knex.schema.renameTable('account_role', 'bk_account_role');
    await knex.schema.renameTable('ugc_mod_comment', 'bk_ugc_mod_comment');
    await knex.schema.renameTable('note', 'bk_note');
    await knex.schema.renameTable('note_page', 'bk_note_page');
    await knex.schema.renameTable('character', 'bk_character');

    //------------------------------------------------------------------------------------------------------------------
    // Step 2: Declare new tables
    //------------------------------------------------------------------------------------------------------------------

    // Account Table
    await knex.schema.createTable('account', (table) =>
    {
        table.integer('account_id').primary();
        table.string('hash_id').notNullable();
        table.text('email').notNullable()
            .unique()
            .index();
        table.text('name');
        table.text('avatar');
        table.json('permissions').notNullable()
            .defaultTo('[]');
        table.json('settings').notNullable()
            .defaultTo('{}');
        table.timestamp('created').notNullable()
            .defaultTo(knex.fn.now());
    });

    // Account Role Table
    await knex.schema.createTable('account_role', (table) =>
    {
        table.integer('account_id')
            .references('account.account_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.integer('role_id')
            .references('role.role_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
    });

    // Mod Comment Table
    await knex.schema.createTable('ugc_mod_comment', (table) =>
    {
        table.increments('comment_id').primary();
        table.text('comment').notNullable();
        table.integer('account_id')
            .references('account.account_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.integer('mod_id')
            .references('ugc_moderation.mod_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.timestamp('created').notNullable()
            .defaultTo(knex.fn.now());
        table.json('metadata').notNullable()
            .defaultTo('{}');
    });

    // The `notes` table
    await knex.schema.createTable('note', (table) =>
    {
        table.integer('note_id').primary();
        table.string('hash_id').notNullable()
            .unique()
            .index();
    });

    // The `notes_pages` table
    await knex.schema.createTable('note_page', (table) =>
    {
        table.integer('page_id').primary();
        table.text('title').notNullable();
        table.string('content');
        table.integer('note_id')
            .references('note.note_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
    });

    // The `character` table
    await knex.schema.createTable('character', (table) =>
    {
        table.integer('character_id').primary();
        table.string('system').notNullable()
            .index();
        table.string('name').notNullable();
        table.text('description');
        table.string('portrait');
        table.string('thumbnail');
        table.string('color');
        table.text('campaign');
        table.json('details').notNullable()
            .defaultTo('{}');
        table.integer('note_id')
            .references('note.note_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('RESTRICT');
        table.integer('account_id')
            .references('account.account_id')
            .notNullable()
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
    });

    //------------------------------------------------------------------------------------------------------------------
    // Step 3: Copy tables.
    //------------------------------------------------------------------------------------------------------------------

    // Select out all the data from the old tables
    const accounts = await knex('bk_account').select();
    const account_roles = await knex('bk_account_role').select();
    const ugc_mod_comments = await knex('bk_ugc_mod_comment').select();
    const notes = await knex('bk_note').select();
    const note_pages = await knex('bk_note_page').select();
    const characters = await knex('bk_character').select();

    // Insert the data into the new tables
    if(accounts.length > 0)
    {
        await knex('account')
            .insert(accounts.map((account, idx) =>
            {
                return {
                    account_id: idx,
                    hash_id: account.hash_id,
                    email: account.email,
                    name: account.name,
                    avatar: account.avatar,
                    permissions: account.permissions,
                    settings: account.settings,
                    created: account.created
                };
            }));
    }

    if(account_roles.length > 0)
    {
        await knex('account_role')
            .insert(account_roles.map((account_role) =>
            {
                const accountID = accounts.findIndex((acc) => acc.account_id === account_role.account_id);
                return {
                    account_id: accountID,
                    role_id: account_role.role_id
                };
            }));
    }

    if(ugc_mod_comments.length > 0)
    {
        await knex('ugc_mod_comment')
            .insert(ugc_mod_comments.map((comment) =>
            {
                const accountID = accounts.findIndex((acc) => acc.account_id === comment.account_id);
                return {
                    comment_id: comment.comment_id,
                    comment: comment.comment,
                    account_id: accountID,
                    mod_id: comment.mod_id,
                    created: comment.created,
                    metadata: comment.metadata
                };
            }));
    }

    if(notes.length > 0)
    {

        await knex('note')
            .insert(notes.map((note, idx) =>
            {
                return {
                    note_id: idx,
                    hash_id: note.note_id
                };
            }));
    }

    if(note_pages.length > 0)
    {
        await knex('note_page')
            .insert(note_pages.map((page) =>
            {
                const noteID = notes.findIndex((nt) => nt.note_id === page.note_id);
                return {
                    page_id: page.page_id,
                    title: page.title,
                    content: page.content,
                    note_id: noteID
                };
            }));
    }

    if(characters.length > 0)
    {
        await knex('character')
            .insert(characters.map((character, idx) =>
            {
                const noteID = notes.findIndex((nt) => nt.note_id === character.note_id);
                const accountID = accounts.findIndex((acc) => acc.account_id === character.account_id);
                return {
                    character_id: idx,
                    hash_id: character.character_id,
                    system: character.system,
                    name: character.name,
                    description: character.description,
                    portrait: character.portrait,
                    thumbnail: character.thumbnail,
                    color: character.color,
                    campaign: character.campaign,
                    details: character.details,
                    note_id: noteID,
                    account_id: accountID
                };
            }));
    }

    //------------------------------------------------------------------------------------------------------------------
    // Step 4: Delete bk_* tables
    //------------------------------------------------------------------------------------------------------------------

    await knex.schema.dropTable('bk_account');
    await knex.schema.dropTable('bk_account_role');
    await knex.schema.dropTable('bk_ugc_mod_comment');
    await knex.schema.dropTable('bk_note');
    await knex.schema.dropTable('bk_note_page');
    await knex.schema.dropTable('bk_character');

    //------------------------------------------------------------------------------------------------------------------
    // Step 5: Re-add Indexes
    //------------------------------------------------------------------------------------------------------------------

    await knex.schema.table('account', (table) =>
    {
        table.unique('email');
    });

    await knex.schema.table('account_role', (table) =>
    {
        table.unique([ 'account_id', 'role_id' ]);
    });
}

//----------------------------------------------------------------------------------------------------------------------
