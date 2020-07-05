// ---------------------------------------------------------------------------------------------------------------------
// supplements.ts
// ---------------------------------------------------------------------------------------------------------------------

export const enum OwnerScope {
    Public = 'public',
    User = 'user'
}

export interface Supplement {
    id ?: number;
    owner ?: number;
    scope : OwnerScope;
    official : boolean;
    reference : string;

    // Add we can have as many extra properties as we want
    [ key : string ] : unknown
}

export interface SupplementValidationPath {
    /**
     * The dot-notation path to the supplement to validate
     */
    path : string;

    /**
     * Indicates the type of supplement to validate
     */
    type : string;

    /**
     * A dot-notation pat to a list containing objects that contain supplements. If set, `path` becomes relative to an
     * object inside the list pointed to by `list.`
     *
     * Example: Given an object of `{ foo: [ { barIDs: { id: 123 } }, { barIDs: { id: 456} } ]}`, the definition would
     * be: `{ list: 'foo', path: 'barIDs', type: 'bar' }`.
     */
    list ?: string;
}

// ---------------------------------------------------------------------------------------------------------------------
