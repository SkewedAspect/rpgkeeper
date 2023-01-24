<!----------------------------------------------------------------------------------------------------------------------
  -- Character Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-container v-if="char" id="risus-character" fluid>
        <div class="d-flex bio-row">
            <PortraitCard class="mr-1 d-none d-lg-block" :src="char.portrait" size="lg"></PortraitCard>
            <BioCard
                v-model:char="char"
                class="mr-1 ml-1 w-50"
                :readonly="!isAuthorized"
                @save="onSave"
            ></BioCard>
            <RollsCard
                ref="roller"
                class="ml-1 w-50"
                :readonly="!isAuthorized"
            ></RollsCard>
        </div>
        <div class="d-flex mt-2 cliche-row">
            <ClichesCard
                class="w-50 mr-1"
                :readonly="!isAuthorized"
                @roll="onRoll"
                @save="onSave"
            ></ClichesCard>
            <HooksCard
                class="w-50 ml-1"
                :readonly="!isAuthorized"
                @save="onSave"
            ></HooksCard>
        </div>
    </b-container>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #risus-character {
        max-width: 1200px;

        @media screen and (max-width: 600px)
        {
            padding: 0 !important;
            .bio-row, .cliche-row {
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
    import { Character } from '../../../../common/interfaces/common';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Managers
    import charMan from '../../../lib/managers/character';

    // Components
    import BioCard from './bioCard.vue';
    import RollsCard from './rollsBlock.vue';
    import PortraitCard from '../../character/portrait.vue';
    import ClichesCard from './clichesCard.vue';
    import HooksCard from './hooksCard.vue';
    import { RisusSystemDetails } from '../../../../common/interfaces/systems/risus';

    //------------------------------------------------------------------------------------------------------------------
    // Card Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        isAuthorized : boolean;
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharactersStore());
    const roller = ref<InstanceType<typeof RollsCard> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<Character<RisusSystemDetails>>(() => current.value as any);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onRoll(dice : string, name : string) : void
    {
        roller.value.roll(dice, name);
    }

    async function onSave() : Promise<void>
    {
        await charMan.save();
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
