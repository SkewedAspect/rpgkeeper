<!----------------------------------------------------------------------------------------------------------------------
  -- Character Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BContainer v-if="char" id="coc-character" fluid>
        <div class="d-flex gap-2 bio-row">
            <PortraitCard class="d-none d-lg-block" :src="char.portrait" size="lg" />
            <div class="d-flex gap-2 flex-column">
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
    </BContainer>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #coc-character {
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
    // const roller = ref<InstanceType<typeof RollsCard> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<Character<CoCSystemDetails>>(() => current.value as any);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onRoll(dice : string, name : string) : void
    {
        // roller.value.roll(dice, name);
    }

    async function onSave() : Promise<void>
    {
        await charMan.save();
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
