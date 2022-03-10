// ---------------------------------------------------------------------------------------------------------------------
// Custom type extensions
// ---------------------------------------------------------------------------------------------------------------------

// Models
import { Account } from './models/account';

// ---------------------------------------------------------------------------------------------------------------------

declare global {
    export namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface User extends Account {}
        export interface Request {
            user ?: User;
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------