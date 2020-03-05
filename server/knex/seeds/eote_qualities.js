//----------------------------------------------------------------------------------------------------------------------
// Populate a default set of EotE/Genesys Qualities
//----------------------------------------------------------------------------------------------------------------------

exports.seed = async function(knex)
{
    const qualities = [
        { name: 'Stun', description: 'When activated, it inflicts strain equal to the weapon\'s Stun rating. It is _not_ reduce by the target\'s soak.', passive: false, ranked: false, reference: 'E-CRB:157', official: true },
        { name: 'Vicious', description: 'When an attack with this weapon results in a Critical Injury, add 10 times the Vicious rating to the result rolled on the critical injury table.', passive: true, ranked: true, reference: 'E-CRB:157', official: true }
    ];

    const genesysRefs = {
        Stun: 'G-CRB:88',
        Vicious: 'G-CRB:89'
    };

    // Deletes ALL existing entries
    knex('eote_quality').del();
    knex('genesys_quality').del();

    // Inserts seed entries
    await knex('eote_quality').insert(qualities);
    await knex('genesys_quality').insert(qualities
        .map((qual) =>
        {
            return {
                ...qual,
                reference: genesysRefs[qual.name]
            };
        }));
};

//----------------------------------------------------------------------------------------------------------------------
