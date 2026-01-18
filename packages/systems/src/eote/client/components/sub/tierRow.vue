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
    import type { GenesysCharacter } from '../../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import TalentCard from './talentCard.vue';
    import TalentPlaceholder from './talentPlaceholder.vue';

    // Utils
    import { sortBy } from '@client/lib/utils/misc';

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

    const { current } = storeToRefs(useCharacterStore());
    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const tier = computed(() => props.tier);
    const readonly = computed(() => props.readonly);
    const character = computed<GenesysCharacter>(() => current.value as any);
    const mode = computed(() => systemStore.current?.id ?? 'genesys');
    const talentsList = computed(() => supplementStore.get(mode.value, 'talent'));

    const allTalents = computed(() =>
    {
        return character.value.details.talents
            .map((talentInst) =>
            {
                const talentBase = talentsList.value.find(({ id }) => id === talentInst.id);
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
