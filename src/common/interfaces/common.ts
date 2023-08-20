// ---------------------------------------------------------------------------------------------------------------------
// Common Interfaces
// ---------------------------------------------------------------------------------------------------------------------

import { AccountOptions, AccountSettings as Settings } from './models/account';
import { SupplementOptions } from './models/supplement';
import { NotebookOptions, NotebookPageOptions } from './models/notebook';
import { CharacterOptions, SystemDetails as SysDetails } from './models/character';
import { Roll } from 'rpgdicejs';
import { RoleOptions } from './models/role';

// ---------------------------------------------------------------------------------------------------------------------

export const enum SupportStatus
{
    InDevelopment = 'dev',
    PublicBeta = 'beta',
    Disabled = 'disabled'
}

export type Account = AccountOptions;
export type AccountSettings = Settings;

export type Role = RoleOptions;

export interface System<Defaults extends Record<string, unknown>> {
    id : string;
    name : string;
    description : string;
    defaults : Defaults;
    status : SupportStatus;
}

export type SystemDetails = SysDetails;

export type Character<Details extends SystemDetails = SystemDetails> = CharacterOptions<Details>;

export type Supplement = SupplementOptions;

export type Notes = NotebookOptions;
export type NotePage = NotebookPageOptions;

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

export interface DiceRoll
{
    roll : Roll;
    name : string;
    display : string;
}

// ---------------------------------------------------------------------------------------------------------------------
