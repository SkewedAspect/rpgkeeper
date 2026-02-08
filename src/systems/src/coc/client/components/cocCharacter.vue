<!----------------------------------------------------------------------------------------------------------------------
  -- Character Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BContainer v-if="char" id="coc-character" fluid>
        <div class="d-flex gap-2 bio-row">
            <PortraitCard class="d-none d-lg-block" :src="char.portrait" size="lg" />
            <div class="d-flex gap-2 flex-column flex-fill">
                <BioCard
                    v-model:char="char"
                    :readonly="!isAuthorized"
                    @save="onSave"
                />
                <CharCard :readonly="!isAuthorized" @save="onSave" />
            </div>
            <RollsCard
                ref="roller"
                class="w-75"
                :readonly="!isAuthorized"
            />
        </div>
        <div class="d-flex gap-2 mt-2 stats-row">
            <StatsCard
                class="flex-fill"
                :readonly="!isAuthorized"
                @save="onSave"
            />
            <SkillsCard
                class="flex-fill"
                :readonly="!isAuthorized"
                @save="onSave"
            />
        </div>
        <div class="d-flex gap-2 mt-2 combat-row">
            <WeaponsCard
                class="flex-fill"
                :readonly="!isAuthorized"
                @save="onSave"
            />
            <GearCard
                class="flex-fill"
                :readonly="!isAuthorized"
                @save="onSave"
            />
        </div>
        <div class="d-flex gap-2 mt-2 backstory-row">
            <BackstoryCard
                class="flex-fill"
                :readonly="!isAuthorized"
                @save="onSave"
            />
        </div>
    </BContainer>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #coc-character {
        max-width: 1200px;

        @media screen and (max-width: 600px)
        {
            padding: 0 !important;
            .bio-row, .stats-row, .combat-row, .backstory-row {
                flex-wrap: wrap;

                & > div {
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                    flex-basis: 100%;

                    &:not(:first-child) {
                        margin-top: 0.5rem;
                    }
                }
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Interfaces
    import type { Character } from '@rpgk/core';
    import type { CoCSystemDetails } from '../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Managers
    import charMan from '@client/lib/managers/character';

    // Components
    import BioCard from './bioCard.vue';
    import CharCard from './charCard.vue';
    import RollsCard from './rollsBlock.vue';
    import SkillsCard from './skillsCard.vue';
    import StatsCard from './statsCard.vue';
    import WeaponsCard from './weaponsCard.vue';
    import GearCard from './gearCard.vue';
    import BackstoryCard from './backstoryCard.vue';
    import PortraitCard from '@client/components/character/charPortrait.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        isAuthorized : boolean;
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharacterStore());
    const roller = ref<InstanceType<typeof RollsCard> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<Character<CoCSystemDetails>>(() => current.value as any);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onRoll(dice : number, name ?: string) : void
    {
        roller.value?.roll(dice, name);
    }

    async function onSave() : Promise<void>
    {
        await charMan.save();
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
