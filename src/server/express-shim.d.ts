// ---------------------------------------------------------------------------------------------------------------------
// Custom type extensions
// ---------------------------------------------------------------------------------------------------------------------

// Models
import { Account } from '../../common/interfaces/models/account';

// ---------------------------------------------------------------------------------------------------------------------

declare global 
{
    namespace Express 
    {
        interface User 
        {
            email : string;
            id : string;
        }
    }
}

declare global 
{
    export namespace Express 
    {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        export interface User extends Account {}
        export interface Request 
        {
            user ?: User;
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
