// ---------------------------------------------------------------------------------------------------------------------
// index.d.ts
// ---------------------------------------------------------------------------------------------------------------------

declare module 'rpgdicejs'
{
    export class Expression
    {
        toJSON() : Record<string, unknown>;
        render() : string;
        eval() : string;
    }

    export class Roll
    {
        toString() : string;
        toJSON() : Record<string, unknown>;
        render() : string;
        eval(scope : Record<string, unknown>, depth : number) : Roll;
        value : number;
        results : number[];
        sides : number;
        count : number;
    }
}

// ---------------------------------------------------------------------------------------------------------------------
