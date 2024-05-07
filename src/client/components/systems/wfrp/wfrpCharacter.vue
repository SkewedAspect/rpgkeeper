<!----------------------------------------------------------------------------------------------------------------------
  -- Character Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BContainer v-if="char" id="wfrp-character" fluid>
        <div class="d-flex">
            <CharPortrait class="me-1 d-none d-lg-block" :src="char.portrait" size="lg"></CharPortrait>
            <BioBlock class="me-1 ms-1 w-50" :readonly="!isAuthorized"></BioBlock>
        </div>
        <div class="d-flex mt-2">
            <StatsBlock class="w-50 me-1" :readonly="!isAuthorized" @save="onSave"></StatsBlock>
            <SkillsBlock class="w-50 me-1" :readonly="!isAuthorized" @save="onSave"></SkillsBlock>
        </div>
    </BContainer>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';
    import { storeToRefs } from 'pinia';

    // Interfaces
    import { Character } from '../../../../common/interfaces/common';
    import { WFRPSystemDetails } from '../../../../common/interfaces/systems/wfrp';

    // Store
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Managers
    import charMan from '../../../lib/managers/character';

    // Components
    import BioBlock from './bioCard.vue';
    import StatsBlock from './statsCard.vue';
    import SkillsBlock from './skillsCard.vue';
    import CharPortrait from '../../character/charPortrait.vue';

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

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<Character<WFRPSystemDetails>>(() => current.value as any);

    const stats = computed(() => char.value.details.stats);
    const skills = computed(() => char.value.details.skills);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    async function onSave() : Promise<void>
    {
        await charMan.save();
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
