// ---------------------------------------------------------------------------------------------------------------------
// Messages Models
// ---------------------------------------------------------------------------------------------------------------------

export interface RPGKAddMessage<T = any>
{
    type : 'add';
    resource : string;
    payload : T
}

export interface RPGKUpdateMessage<T = any>
{
    type : 'update';
    resource : string;
    payload : T
}

export interface RPGKRemoveMessage
{
    type : 'remove';
    resource : string;
}

export interface RPGKEventMessage<Payload extends Record<string, unknown> = Record<string, unknown>>
{
    type : 'event';
    resource : string;
    payload : Payload;
}

export type RPGKMessage = RPGKAddMessage | RPGKUpdateMessage | RPGKRemoveMessage | RPGKEventMessage;

// ---------------------------------------------------------------------------------------------------------------------
