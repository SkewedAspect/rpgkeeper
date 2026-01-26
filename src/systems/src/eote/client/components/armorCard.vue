<!----------------------------------------------------------------------------------------------------------------------
  -- armorCard.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-armor-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="helmet-battle" />
                    Armor
                    <span v-if="armor.name" class="ms-1"> - {{ armor.name }}</span>
                </h5>
                <div v-if="!readonly" class="ms-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <Fa icon="edit" fixed-width />
                        <span class="d-none d-md-inline">Edit</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <BTableSimple
            v-if="armor.name"
            class="font-sm mb-0"
            small
        >
            <BThead>
                <BTr>
                    <BTh class="text-center">
                        Defense
                    </BTh>
                    <BTh class="text-center">
                        Soak
                    </BTh>
                    <BTh class="text-center">
                        Hardpoints
                    </BTh>
                    <BTh class="text-center">
                        Encumb.
                    </BTh>
                    <BTh class="text-center">
                        Rarity
                    </BTh>
                    <BTh>
                        Upgrades
                    </BTh>
                    <BTh v-if="showAttachments">
                        Attachments
                    </BTh>
                </BTr>
            </BThead>
            <BTbody>
                <BTr>
                    <BTd class="text-center">
                        <template v-if="armorStats.defenseModifier !== 0">
                            {{ armor.defense }} ({{ armorStats.defenseModifier >= 0 ? '+' : '' }}{{ armorStats.defenseModifier }})
                        </template>
                        <template v-else>
                            {{ armor.defense }}
                        </template>
                    </BTd>
                    <BTd class="text-center">
                        <template v-if="armorStats.soakModifier !== 0">
                            {{ armor.soak }} ({{ armorStats.soakModifier >= 0 ? '+' : '' }}{{ armorStats.soakModifier }})
                        </template>
                        <template v-else>
                            {{ armor.soak }}
                        </template>
                    </BTd>
                    <BTd class="text-center">
                        {{ armor.hardpoints }}
                    </BTd>
                    <BTd class="text-center">
                        <template v-if="armorStats.encumbranceModifier !== 0">
                            {{ armor.encumbrance }} ({{ armorStats.encumbranceModifier >= 0 ? '+' : '' }}{{ armorStats.encumbranceModifier }})
                        </template>
                        <template v-else>
                            {{ armor.encumbrance }}
                        </template>
                    </BTd>
                    <BTd class="text-center">
                        {{ armor.rarity }}
                    </BTd>
                    <BTd class="text-nowrap">
                        <QualityTag
                            v-for="quality in computeArmorQualities(armor, allAttachments)"
                            :id="quality.id"
                            :key="quality.id"
                            :ranks="quality.totalRanks"
                        />
                        <span v-if="computeArmorQualities(armor, allAttachments).length === 0" class="text-muted">
                            None
                        </span>
                    </BTd>
                    <BTd v-if="showAttachments" class="text-nowrap">
                        <AttachmentTag
                            v-for="att in (armor.attachments as EoteAttachmentRef[])"
                            :id="att.id"
                            :key="att.id"
                            :activated-mods="att.activatedMods"
                        />
                        <span v-if="armor.attachments.length === 0" class="text-muted">
                            None
                        </span>
                    </BTd>
                </BTr>
            </BTbody>
        </BTableSimple>
        <h5 v-else class="mt-2 text-center">
            No armor
        </h5>

        <!-- Edit Modal -->
        <EditArmorModal ref="editArmorModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #eote-armor-block {
        .table tr td {
            vertical-align: middle !important;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Models
    import type {
        EoteArmorRef,
        EoteAttachment,
        EoteAttachmentRef,
        EoteOrGenCharacter,
        GenesysCharacter,
    } from '../../models.ts';

    // Utils
    import { computeArmorQualities, computeArmorStats } from '../lib/qualityUtils';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import QualityTag from './sub/qualityTag.vue';
    import AttachmentTag from './sub/attachmentTag.vue';
    import EditArmorModal from './modals/editArmorModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        readonly : boolean;
    }

    const props = defineProps<Props>();

    type Events = (e : 'save') => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharacterStore());
    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    const editArmorModal = ref<InstanceType<typeof EditArmorModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<EoteOrGenCharacter>(() => current.value as any);
    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const readonly = computed(() => props.readonly);

    const armor = computed(() => char.value.details.armor);
    const allAttachments = computed(() => supplementStore.get<EoteAttachment>(mode.value, 'attachment'));
    const armorStats = computed(() => computeArmorStats(armor.value, allAttachments.value));

    const showAttachments = computed(() =>
    {
        if(mode.value === 'eote')
        {
            return true;
        }
        else if(mode.value === 'genesys')
        {
            return (char.value as GenesysCharacter).details.useAttachmentRules ?? false;
        }

        return false;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editArmorModal.value?.show(char.value);
    }

    function onEditSave(newArmor : EoteArmorRef) : void
    {
        char.value.details.armor = newArmor;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
