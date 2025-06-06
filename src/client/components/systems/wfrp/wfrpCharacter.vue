<!----------------------------------------------------------------------------------------------------------------------
  -- Character Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BContainer v-if="char" id="wfrp-character" fluid>
        <div class="d-flex">
            <CharPortrait class="me-1 d-none d-lg-block" :src="char.portrait" size="lg" />
            <BioBlock class="me-1 ms-1 w-50" :readonly="!isAuthorized" />
        </div>
        <div class="d-flex mt-2">
            <StatsBlock class="w-50 me-1" :readonly="!isAuthorized" @save="onSave" />
            <SkillsBlock class="w-50 me-1" :readonly="!isAuthorized" @save="onSave" />
        </div>
    </BContainer>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';
    import { storeToRefs } from 'pinia';

    // Interfaces
    import { Character } from '../../../../common/models';
    import { WFRPSystemDetails } from '../../../../common/models/systems';

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
