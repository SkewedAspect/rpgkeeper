<!----------------------------------------------------------------------------------------------------------------------
  -- Character Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="eote-character" class="container-fluid" :class="`${ char.system }-system`">
        <div class="d-flex">
            <portrait class="mr-1 d-none d-lg-block" :src="char.portrait" size="lg"></portrait>
            <div class="d-flex flex-column w-50">
                <BioCard :readonly="!isAuthorized" @save="onSave"></BioCard>
                <CharCard class="mt-1" :readonly="!isAuthorized" @save="onSave"></CharCard>
            </div>
            <RollsCard
                ref="roller"
                class="ml-1 w-50"
                :skills="char.details.skills"
                :readonly="!isAuthorized"
            ></RollsCard>
        </div>
        <div class="d-flex mt-1">
            <div class="d-flex flex-column flex-fill mr-1">
                <SkillsCard :readonly="!isAuthorized" @roll="onRoll" @save="onSave"></SkillsCard>
                <TalentsCard class="mt-1" :readonly="!isAuthorized" @save="onSave"></TalentsCard>
                <ForcePowers
                    v-if="showForcePowers"
                    class="mt-1"
                    :readonly="!isAuthorized"
                    @save="onSave"
                ></ForcePowers>
                <WeaponsCard class="mt-1" :readonly="!isAuthorized" @roll="onRoll" @save="onSave"></WeaponsCard>
                <ArmorCard class="mt-1" :readonly="!isAuthorized" @save="onSave"></ArmorCard>
            </div>
            <div class="d-flex flex-column" style="min-width: 300px; max-width: 300px;">
                <MotivationsCard
                    v-if="char.system === 'genesys'"
                    class="mb-1 flex-shrink-1 flex-grow-0"
                    :readonly="!isAuthorized"
                    @save="onSave"
                ></MotivationsCard>
                <ExpCard
                    class="flex-shrink-1 flex-grow-0"
                    :readonly="!isAuthorized"
                    @save="onSave"
                ></ExpCard>
                <DefensesCard
                    class="mt-1 flex-shrink-1 flex-grow-0"
                    :readonly="!isAuthorized"
                    @save="onSave"
                ></DefensesCard>
                <WoundsCard
                    class="mt-1 flex-shrink-1 flex-grow-0"
                    :readonly="!isAuthorized"
                    @save="onSave"
                ></WoundsCard>
                <ForcePool
                    v-if="char.system === 'eote'"
                    class=" mt-1 flex-shrink-1 flex-grow-0"
                    :readonly="!isAuthorized"
                    @save="onSave"
                ></ForcePool>
                <CriticalsCard
                    class="mt-1"
                    :readonly="!isAuthorized"
                    @save="onSave"
                ></CriticalsCard>
            </div>
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Models
    import { EoteOrGenCharacter } from '../../../../common/interfaces/systems/eote';

    // Managers
    import charMan from '../../../lib/managers/character';

    // Components
    import Portrait from '../../character/charPortrait.vue';
    import BioCard from './bioCard.vue';
    import CharCard from './charCard.vue';
    import RollsCard from './rollsCard.vue';
    import SkillsCard from './skillsCard.vue';
    import DefensesCard from './defensesCard.vue';
    import ExpCard from './expCard.vue';
    import WoundsCard from './woundsCard.vue';
    import CriticalsCard from './criticalsCard.vue';
    import WeaponsCard from './weaponsCard.vue';
    import ArmorCard from './armorCard.vue';
    import TalentsCard from './talentsCard.vue';
    import ForcePool from './forcePool.vue';
    import ForcePowers from './forcePowers.vue';
    import MotivationsCard from './motivationsCard.vue';

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

    const char = computed<EoteOrGenCharacter>(() => current.value as any);

    const showForcePowers = computed(() =>
    {
        // This is to make typescript work out the types correctly.
        const character = char.value;

        // Is the character force sensitive?
        return !!(character.system === 'eote' && character.details?.force?.sensitive);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onRoll(dice : Record<string, number>, name : string) : void
    {
        window.scrollTo(0, 0);
        roller.value.setDice(dice, name);
    }

    async function onSave() : Promise<void>
    {
        await charMan.save();
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
