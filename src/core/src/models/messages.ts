//----------------------------------------------------------------------------------------------------------------------
// Messages Models
//----------------------------------------------------------------------------------------------------------------------

/**
 * Message for adding a new resource via WebSocket.
 */
export interface RPGKAddMessage<T = unknown>
{
    type : 'add';
    resource : string;
    payload : T;
}

/**
 * Message for updating an existing resource via WebSocket.
 */
export interface RPGKUpdateMessage<T = unknown>
{
    type : 'update';
    resource : string;
    payload : T;
}

/**
 * Message for removing a resource via WebSocket.
 */
export interface RPGKRemoveMessage
{
    type : 'remove';
    resource : string;
}

/**
 * Message for custom events via WebSocket.
 */
export interface RPGKEventMessage<Payload extends Record<string, unknown> = Record<string, unknown>>
{
    type : 'event';
    resource : string;
    payload : Payload;
}

/** Union type of all WebSocket message types. */
export type RPGKMessage = RPGKAddMessage | RPGKUpdateMessage | RPGKRemoveMessage | RPGKEventMessage;

//----------------------------------------------------------------------------------------------------------------------
