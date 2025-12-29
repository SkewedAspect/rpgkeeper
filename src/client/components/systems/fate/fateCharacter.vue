<!----------------------------------------------------------------------------------------------------------------------
  -- Character Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BContainer v-if="char" id="fate-char" fluid>
        <div class="d-flex">
            <PortraitCard class="me-1 d-none d-lg-block" :src="char.portrait" size="lg" />
            <IdentityCard class="me-1 ms-1 w-50" :readonly="!isAuthorized" @save="onSave" />
            <RollsCard class="ms-1 w-50" :skills="char.details.skills" :readonly="!isAuthorized" />
        </div>
        <div class="d-flex mt-2">
            <AspectsCard v-model:aspects="char.details.aspects" :readonly="!isAuthorized" @save="onSave" />
            <SkillsCard v-model:skills="char.details.skills" :readonly="!isAuthorized" @save="onSave" />
        </div>
        <div class="d-flex mt-2">
            <ExtrasCard v-model:extras="char.details.extras" class="w-50" :readonly="!isAuthorized" @save="onSave" />
            <StuntsCard
                v-model:stunts="char.details.stunts"
                class="w-50 ms-2"
                :readonly="!isAuthorized"
                @save="onSave"
            />
        </div>
        <div class="d-flex mt-2">
            <StressCard
                v-model:physical="char.details.physicalStress"
                v-model:mental="char.details.mentalStress"
                :skills="char.details.skills"
                style="flex-basis: 40%"
                :readonly="!isAuthorized"
                @save="onSave"
            />
            <ConsequencesCard
                v-model:aspects="char.details.aspects"
                :skills="char.details.skills"
                style="flex-basis: 60%"
                class="ms-2"
                :readonly="!isAuthorized"
                @save="onSave"
            />
        </div>
    </BContainer>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Interfaces
    import { Character } from '../../../../common/models';
    import { FateSystemDetails } from '../../../../common/models/systems';

    // Stores
    import { useCharacterStore } from '../../../lib/resource-access/stores/characters';

    // Managers
    import charMan from '../../../lib/managers/character';

    // Components
    import IdentityCard from './identityCard.vue';
    import RollsCard from './rollsCard.vue';
    import AspectsCard from './aspectsCard.vue';
    import SkillsCard from './skillsCard.vue';
    import ExtrasCard from './extrasCard.vue';
    import StuntsCard from './stuntsCard.vue';
    import StressCard from './stressCard.vue';
    import ConsequencesCard from './consequencesCard.vue';
    import PortraitCard from '../../character/charPortrait.vue';

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

    const char = computed<Character<FateSystemDetails>>(() => current.value as any);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onRoll(dice : string, name : string) : void
    {
        roller.value?.roll();
    }

    async function onSave() : Promise<void>
    {
        await charMan.save();
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
