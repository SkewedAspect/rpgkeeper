<!----------------------------------------------------------------------------------------------------------------------
  -- EotE Talents
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="eote-sub-talents">
        <div class="d-flex flex-wrap" style="margin-top: -0.5rem">
            <TalentCard
                v-for="talentInst in talents"
                :key="talentInst.id"
                class="me-2 mt-2 flex-fill"
                :talent="talentInst"
                :readonly="readonly"
            />
        </div>

        <h5 v-if="talents.length === 0" class="m-0 text-center">
            No Talents
        </h5>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Models
    import type { EoteCharacter } from '../../../models.ts';

    // Components
    import TalentCard from './talentCard.vue';

    // Utils
    import { sortBy } from '@client/lib/utils/misc';

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
    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<EoteCharacter>(() => current.value as any);
    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const talentsList = computed(() => supplementStore.get(mode.value, 'talent'));

    const talents = computed(() =>
    {
        return character.value.details.talents
            .map((talentInst) =>
            {
                const talentBase = talentsList.value.find(({ id }) => id === talentInst.id);
                return {
                    ...talentInst,
                    name: talentBase?.name,
                };
            })
            .sort(sortBy('name'));
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
