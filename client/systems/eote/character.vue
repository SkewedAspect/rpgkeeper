<!----------------------------------------------------------------------------------------------------------------------
  -- Character Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="eote-character" class="container" :class="`${ mode }-system`">
        <div class="d-flex">
            <portrait class="mr-1 d-none d-lg-block" :src="character.portrait" size="lg"></portrait>
            <div class="d-flex flex-column w-50">
                <biography :readonly="!isAuthorized"></biography>
                <characteristics class="mt-1" :readonly="!isAuthorized"></characteristics>
            </div>
            <rolls ref="roller" class="ml-1 w-50" :skills="character.details.skills" :readonly="!isAuthorized"></rolls>
        </div>
        <div class="d-flex mt-2">
            <div class="d-flex flex-fill mr-1">
                <skills :readonly="!isAuthorized" @roll="onRoll"></skills>
            </div>
            <div class="d-flex flex-column" style="min-width: 300px; max-width: 300px;">
                <defenses class="flex-shrink-1 flex-grow-0" :readonly="!isAuthorized"></defenses>
                <wounds class=" mt-1 flex-shrink-1 flex-grow-0" :readonly="!isAuthorized"></wounds>
            </div>
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #eote-character {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Managers
    import authMan from '../../api/managers/auth';
    import charMan from '../../api/managers/character';
    import eoteMan from '../../api/managers/eote';

    // Components
    // import EoteSymbol from './symbol.vue';
    import Portrait from '../../../client/components/character/portrait.vue';
    import Biography from './biography.vue';
    import Characteristics from './characteristics.vue';
    import Rolls from './rolls.vue';
    import Skills from './skills';
    import Defenses from './defenses.vue';
    import Wounds from './wounds.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        components: {
            // sy: EoteSymbol,
            Biography,
            Characteristics,
            Portrait,
            Rolls,
            Skills,
            Defenses,
            Wounds
        },
        subscriptions: {
            account: authMan.account$,
            character: charMan.selected$,
            mode: eoteMan.mode$
        },
        computed: {
            isAuthorized() { return _.get(this.account, 'id', 'nope!') === this.character.account_id; }
        },
        methods: {
            onRoll(dice, name)
            {
                window.scrollTo(0, 0);
                this.$refs.roller.setDice(dice, name);
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
