<!----------------------------------------------------------------------------------------------------------------------
  -- Character Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BContainer v-if="char" id="risus-character" fluid>
        <div class="d-flex bio-row">
            <PortraitCard class="me-1 d-none d-lg-block" :src="char.portrait" size="lg" />
            <BioCard
                v-model:char="char"
                class="me-1 ms-1 w-50"
                :readonly="!isAuthorized"
                @save="onSave"
            />
            <RollsCard
                ref="roller"
                class="ms-1 w-50"
                :readonly="!isAuthorized"
            />
        </div>
        <div class="d-flex mt-2 cliche-row">
            <ClichesCard
                class="w-50 me-1"
                :readonly="!isAuthorized"
                @roll="onRoll"
                @save="onSave"
            />
            <HooksCard
                class="w-50 ms-1"
                :readonly="!isAuthorized"
                @save="onSave"
            />
        </div>
    </BContainer>
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
    import { RisusSystemDetails } from '../../../../common/interfaces/systems/risus';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Managers
    import charMan from '../../../lib/managers/character';

    // Components
    import BioCard from './bioCard.vue';
    import RollsCard from './rollsBlock.vue';
    import PortraitCard from '../../character/charPortrait.vue';
    import ClichesCard from './clichesCard.vue';
    import HooksCard from './hooksCard.vue';

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
