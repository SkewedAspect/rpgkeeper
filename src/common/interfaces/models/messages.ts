// ---------------------------------------------------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------------------------------------------------

import { Character } from './character';

// ---------------------------------------------------------------------------------------------------------------------

export interface RPGKUpdateMessage
{
    type : 'update';
    resource : string;
    payload : Character;
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

export type RPGKMessage = RPGKUpdateMessage | RPGKRemoveMessage | RPGKEventMessage;

// ---------------------------------------------------------------------------------------------------------------------
