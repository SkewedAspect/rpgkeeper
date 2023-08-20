<!----------------------------------------------------------------------------------------------------------------------
  -- EotE Talents
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="eote-sub-talents">
        <div class="d-flex flex-wrap" style="margin-top: -0.5rem">
            <TalentCard
                v-for="talentInst in talents"
                :key="talentInst.id"
                class="mr-2 mt-2 flex-fill"
                :talent="talentInst"
                :readonly="readonly"
            ></TalentCard>
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
    import { useCharactersStore } from '../../../../lib/stores/characters';

    // Models
    import { EoteCharacter } from '../../../../../common/interfaces/systems/eote';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import TalentCard from '../components/talentCard.vue';

    // Utils
    import { sortBy } from '../../../../../common/utils/misc';

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

    const { current } = storeToRefs(useCharactersStore());

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<EoteCharacter>(() => current.value as any);

    const talents = computed(() =>
    {
        return character.value.details.talents
            .map((talentInst) =>
            {
                const talentBase = eoteMan.talents.find(({ id }) => id === talentInst.id);
                return {
                    ...talentInst,
                    name: talentBase?.name
                };
            })
            .sort(sortBy('name'));
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
