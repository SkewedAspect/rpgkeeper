<!----------------------------------------------------------------------------------------------------------------------
  -- tierRow.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="tier-row">
        <h6>
            Tier {{ tier }} ({{ talents.length }} / {{ maxTalents }})
        </h6>
        <div
            v-if="(talents.length > 0) || (talentPlaceholders.length > 0)"
            class="d-flex flex-wrap"
            style="margin-top: -0.5rem"
        >
            <TalentCard
                v-for="talentInst in talents"
                :key="talentInst.id"
                class="me-2 mt-2 flex-fill"
                :talent="talentInst"
                :readonly="readonly"
            />
            <TalentPlaceholder
                v-for="index in talentPlaceholders"
                :key="index"
                class="me-2 mt-2 flex-fill"
            />
        </div>
        <div v-else class="text-muted">
            No tier {{ tier }} talents.
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import { GenesysCharacter } from '../../../../../common/models/systems';

    // Stores
    import { useCharactersStore } from '../../../../lib/stores/characters';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import TalentCard from '../components/talentCard.vue';
    import TalentPlaceholder from '../components/talentPlaceholder.vue';

    // Utils
    import { sortBy } from '../../../../lib/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        tier : number;
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

    const tier = computed(() => props.tier);
    const readonly = computed(() => props.readonly);
    const character = computed<GenesysCharacter>(() => current.value as any);

    const allTalents = computed(() =>
    {
        return character.value.details.talents
            .map((talentInst) =>
            {
                const talentBase = eoteMan.talents.find(({ id }) => id === talentInst.id);
                return {
                    ...talentInst,
                    name: talentBase?.name,
                    base: talentBase,
                };
            })
            .sort(sortBy('name'));
    });

    const talents = computed(() =>
    {
        return allTalents.value
            .filter((talentInst) => talentInst?.base?.tier === tier.value);
    });

    const maxTalents = computed(() =>
    {
        if(tier.value === 1)
        {
            return talents.value.length + 1;
        }
        else
        {
            const priorTalents = allTalents.value
                .filter((talentInst) => talentInst?.base?.tier === (tier.value - 1));

            return Math.max(priorTalents.length - 1, 0);
        }
    });

    const talentPlaceholders = computed(() =>
    {
        return Array(Math.max(maxTalents.value - talents.value.length, 0))
            .fill(0)
            .map((x, y) => x + y);
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
