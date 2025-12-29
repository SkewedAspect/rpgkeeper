<!----------------------------------------------------------------------------------------------------------------------
  -- Character Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="eote-character" class="container-fluid" :class="`${ char.system }-system`">
        <div class="d-flex">
            <Portrait class="me-1 d-none d-lg-block" :src="char.portrait" size="lg" />
            <div class="d-flex flex-column w-50">
                <BioCard :readonly="!isAuthorized" @save="onSave" />
                <CharCard class="mt-1" :readonly="!isAuthorized" @save="onSave" />
            </div>
            <RollsCard
                ref="roller"
                class="ms-1 w-50"
                :skills="char.details.skills"
                :readonly="!isAuthorized"
            />
        </div>
        <div class="d-flex mt-1">
            <div class="d-flex flex-column flex-fill me-1">
                <SkillsCard :readonly="!isAuthorized" @roll="onRoll" @save="onSave" />
                <TalentsCard class="mt-1" :readonly="!isAuthorized" @save="onSave" />
                <ForcePowers
                    v-if="showForcePowers"
                    class="mt-1"
                    :readonly="!isAuthorized"
                    @save="onSave"
                />
                <WeaponsCard class="mt-1" :readonly="!isAuthorized" @roll="onRoll" @save="onSave" />
                <ArmorCard class="mt-1" :readonly="!isAuthorized" @save="onSave" />
            </div>
            <div class="d-flex flex-column" style="min-width: 300px; max-width: 300px;">
                <MotivationsCard
                    v-if="char.system === 'genesys'"
                    class="mb-1 flex-shrink-1 flex-grow-0"
                    :readonly="!isAuthorized"
                    @save="onSave"
                />
                <ExpCard
                    class="flex-shrink-1 flex-grow-0"
                    :readonly="!isAuthorized"
                    @save="onSave"
                />
                <DefensesCard
                    class="mt-1 flex-shrink-1 flex-grow-0"
                    :readonly="!isAuthorized"
                    @save="onSave"
                />
                <WoundsCard
                    class="mt-1 flex-shrink-1 flex-grow-0"
                    :readonly="!isAuthorized"
                    @save="onSave"
                />
                <ForcePool
                    v-if="char.system === 'eote'"
                    class=" mt-1 flex-shrink-1 flex-grow-0"
                    :readonly="!isAuthorized"
                    @save="onSave"
                />
                <CriticalsCard
                    class="mt-1"
                    :readonly="!isAuthorized"
                    @save="onSave"
                />
            </div>
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useCharacterStore } from '../../../lib/resource-access/stores/characters';

    // Models
    import { EoteOrGenCharacter } from '../../../../common/models/systems';

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

    const { current } = storeToRefs(useCharacterStore());
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
