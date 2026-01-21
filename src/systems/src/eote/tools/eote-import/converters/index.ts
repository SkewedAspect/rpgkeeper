//----------------------------------------------------------------------------------------------------------------------
// Converters Index
//----------------------------------------------------------------------------------------------------------------------

export { convertArmor, convertArmors } from './armor.ts';
export type { InternalArmor } from './armor.ts';

export { convertWeapon, convertWeapons } from './weapon.ts';
export type { InternalWeapon, InternalQualityRef } from './weapon.ts';

export { convertTalent, convertTalents } from './talent.ts';
export type { InternalTalent } from './talent.ts';

export { convertAttachment, convertAttachments } from './attachment.ts';
export type { InternalAttachment, AttachmentType } from './attachment.ts';

export { convertQuality, convertQualities } from './quality.ts';
export type { InternalQuality } from './quality.ts';

export {
    buildTalentTreeMap,
    buildTalentKeyMap,
    enrichTalentsWithTreeInfo,
} from './treeBuilder.ts';
export type { TalentTreeInfo, TalentTreeMap } from './treeBuilder.ts';

//----------------------------------------------------------------------------------------------------------------------
