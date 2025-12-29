<!----------------------------------------------------------------------------------------------------------------------
  -- Genesys Talents
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="genesys-sub-talents">
        <TierRow :tier="1" :readonly="readonly" />
        <TierRow class="mt-3" :tier="2" :readonly="readonly" />
        <TierRow class="mt-3" :tier="3" :readonly="readonly" />
        <TierRow class="mt-3" :tier="4" :readonly="readonly" />
        <TierRow class="mt-3" :tier="5" :readonly="readonly" />

        <h5 v-if="talents.length === 0" class="m-0 text-center">
            No Talents
        </h5>
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
    import { computed } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import { EoteCharacter } from '@rpgk/core/models/systems';

    // Stores
    import { useCharacterStore } from '../../../../lib/resource-access/stores/characters';

    // Components
    import TierRow from './tierRow.vue';

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

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);
    const character = computed<EoteCharacter>(() => current.value as any);
    const talents = computed(() => character.value.details.talents);
</script>

<!--------------------------------------------------------------------------------------------------------------------->
