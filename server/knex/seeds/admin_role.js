//----------------------------------------------------------------------------------------------------------------------
// Set us up a default role
//----------------------------------------------------------------------------------------------------------------------

const logger = require('trivial-logging').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

exports.seed = async(knex) =>
{
    try
    {
        // We always set _an_ account, and it will be setup as an admin.
        await knex('account')
            .insert({
                account_id: 1,
                hash_id: '3VAAgA',
                email: 'chris.case@g33xnexus.com',
                name: 'chris.case',
                avatar: 'https://lh3.googleusercontent.com/-r8fmbWdlFvg/AAAAAAAAAAI/AAAAAAAAA9g/oWyh8pnmDSY/s96-c/photo.jpg?sz=512',
                permissions: '[]',
                settings: '{}',
                created: knex.fn.now()

            });

        await knex('role')
            .insert({
                role_id: 1,
                name: 'Admins',
                permissions: JSON.stringify([ '*/*' ])
            });

        await knex('account_role')
            .insert({
                account_id: 1,
                role_id: 1
            });
    }
    catch (error)
    {
        logger.warn('Error running seed:', error);
    } // end try/catch
};

//----------------------------------------------------------------------------------------------------------------------
