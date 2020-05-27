//----------------------------------------------------------------------------------------------------------------------
// Modify description column
//----------------------------------------------------------------------------------------------------------------------

exports.up = async(knex) =>
{
    // Add a new column to the table
    await knex.schema.table('character', (table) =>
    {
        table.text('campaign');
    });

    // Copy from description to campaign
    await knex('character')
        .update({
            campaign: knex.raw('??', [ 'description' ])
        });

    // Copy from biography to description
    await knex('character')
        .update({
            description: knex.raw('??', [ 'biography' ])
        });

    // Drop biography column
    await knex.schema.table('character', (table) =>
    {
        table.dropColumn('biography');
    });
};

//----------------------------------------------------------------------------------------------------------------------

exports.down = async(knex) =>
{
    // Add a new column to the table
    await knex.schema.table('character', (table) =>
    {
        table.text('biography');
    });

    // Copy from campaign to description
    await knex('character')
        .update({
            description: knex.raw('??', [ 'campaign' ])
        });

    // Copy from description to biography
    await knex('character')
        .update({
            biography: knex.raw('??', [ 'description' ])
        });

    // Drop campaign column
    await knex.schema.table('character', (table) =>
    {
        table.dropColumn('campaign');
    });
};

//----------------------------------------------------------------------------------------------------------------------
