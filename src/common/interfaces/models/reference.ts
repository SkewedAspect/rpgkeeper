//----------------------------------------------------------------------------------------------------------------------
// Reference
//----------------------------------------------------------------------------------------------------------------------

export interface ReferenceOptions {
    abbr : string;
    name : string;
    productCode : string;
}

// FIXME: Once Models are removed, `ReferenceOptions` should be named 'Reference'.
export type Reference = ReferenceOptions;

//----------------------------------------------------------------------------------------------------------------------
