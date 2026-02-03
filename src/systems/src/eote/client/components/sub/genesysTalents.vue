<!----------------------------------------------------------------------------------------------------------------------
  -- Genesys Talents
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="genesys-sub-talents">
        <TierRow :tier="1" :readonly="readonly" @add-talent="onAddTalent" @remove-talent="onRemoveTalent" @edit-talent="onEditTalent" />
        <TierRow class="mt-3" :tier="2" :readonly="readonly" @add-talent="onAddTalent" @remove-talent="onRemoveTalent" @edit-talent="onEditTalent" />
        <TierRow class="mt-3" :tier="3" :readonly="readonly" @add-talent="onAddTalent" @remove-talent="onRemoveTalent" @edit-talent="onEditTalent" />
        <TierRow class="mt-3" :tier="4" :readonly="readonly" @add-talent="onAddTalent" @remove-talent="onRemoveTalent" @edit-talent="onEditTalent" />
        <TierRow class="mt-3" :tier="5" :readonly="readonly" @add-talent="onAddTalent" @remove-talent="onRemoveTalent" @edit-talent="onEditTalent" />

        <h5 v-if="talents.length === 0" class="m-0 text-center">
            No Talents
        </h5>

        <!-- Modals -->
        <SelectTalentModal ref="selectTalentModal" @save="onTalentSelected" />
        <ConfirmModal ref="confirmModal" @confirm="onConfirmDelete" />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #genesys-sub-talents {
        .talent-row {
            margin-top: -0.5rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { EoteCharacter, EoteTalentInst, GenesysTalent } from '../../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';

    // Components
    import TierRow from './tierRow.vue';
    import SelectTalentModal from '../modals/selectTalentModal.vue';
    import ConfirmModal from '../modals/confirmModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        readonly : boolean;
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharacterStore());
    const characterStore = useCharacterStore();
    const supplementStore = useSupplementStore();
    const systemStore = useSystemStore();

    const selectTalentModal = ref<InstanceType<typeof SelectTalentModal>>();
    const confirmModal = ref<InstanceType<typeof ConfirmModal>>();
    const talentToDelete = ref<string | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<EoteCharacter>(() => current.value as any);
    const talents = computed(() => character.value.details.talents);
    const mode = computed(() => systemStore.current?.id ?? 'genesys');
    const allTalentsList = computed(() => supplementStore.get<GenesysTalent>(mode.value, 'talent'));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onAddTalent(tier : number) : void
    {
        selectTalentModal.value?.show(tier);
    }

    function onEditTalent(tier : number, talent : EoteTalentInst) : void
    {
        selectTalentModal.value?.show(tier, talent);
    }

    function validatePyramidAfterDelete(tier : number) : string
    {
        if(tier === 5)
        {
            return ''; // No higher tier to check
        }

        // Count talents in this tier (after deletion)
        const currentTierCount = talents.value
            .filter((tal) =>
            {
                const base = allTalentsList.value.find((talentBase) => talentBase.id === tal.id);
                return base?.tier === tier;
            })
            .length - 1; // -1 because we're simulating the deletion

        // Count talents in the next tier
        const nextTier = tier + 1;
        const nextTierCount = talents.value
            .filter((tal) =>
            {
                const base = allTalentsList.value.find((talentBase) => talentBase.id === tal.id);
                return base?.tier === nextTier;
            })
            .length;

        // Maximum allowed in next tier after deletion
        const maxNextTier = Math.max(currentTierCount - 1, 0);

        if(nextTierCount > maxNextTier)
        {
            const excess = nextTierCount - maxNextTier;
            return `Removing this talent will make the pyramid invalid. `
                + `You have ${ nextTierCount } tier ${ nextTier } talent(s), `
                + `but would only be able to have ${ maxNextTier }. `
                + `You must remove ${ excess } tier ${ nextTier } talent(s) first.`;
        }

        return '';
    }

    function onRemoveTalent(talentId : string) : void
    {
        // Find the talent and its tier
        const talentBase = allTalentsList.value.find((tal) => tal.id === talentId);
        if(!talentBase)
        {
            return;
        }

        const tier = talentBase.tier;

        // Check if removing this talent would break the pyramid
        const warning = validatePyramidAfterDelete(tier);

        // Show confirmation modal
        talentToDelete.value = talentId;
        confirmModal.value?.show({
            title: 'Remove Talent',
            message: `Are you sure you want to remove "${ talentBase.name }"?`,
            warning,
            confirmText: 'Remove',
            dangerButton: true,
        });
    }

    function onConfirmDelete() : void
    {
        if(talentToDelete.value)
        {
            const index = character.value.details.talents.findIndex((tal) => tal.id === talentToDelete.value);
            if(index !== -1)
            {
                character.value.details.talents.splice(index, 1);
                characterStore.save();
            }
            talentToDelete.value = null;
        }
    }

    function onTalentSelected(talentInst : EoteTalentInst, replacingId ?: string) : void
    {
        if(replacingId)
        {
            // Replace existing talent
            const index = character.value.details.talents.findIndex((tal) => tal.id === replacingId);
            if(index !== -1)
            {
                character.value.details.talents.splice(index, 1, talentInst);
            }
        }
        else
        {
            // Add new talent
            character.value.details.talents.push(talentInst);
        }

        characterStore.save();
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
