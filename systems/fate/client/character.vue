<!--------------------------------------------------------------------------------------------------------------------->
<!-- Character Component                                                                                             -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <b-container v-if="character" id="fate-character">
        <div class="d-flex">
            <portrait class="mr-1 d-none d-lg-block" :src="character.portrait" size="lg"></portrait>
            <identity class="mr-1 ml-1 w-50" :character="character" :readonly="!isAuthorized"></identity>
            <rolls class="ml-1 w-50" :skills="character.details.skills" :readonly="!isAuthorized"></rolls>
        </div>
        <div class="d-flex mt-2">
            <aspects v-model="character.details.aspects" :readonly="!isAuthorized"></aspects>
            <skills v-model="character.details.skills" :readonly="!isAuthorized"></skills>
        </div>
        <div class="d-flex mt-2">
            <extras class="w-50" v-model="character.details.extras" :readonly="!isAuthorized"></extras>
            <stunts class="w-50 ml-2" v-model="character.details.stunts" :readonly="!isAuthorized"></stunts>
        </div>
        <div class="d-flex mt-2">
            <stress class="w-50" v-model="character" :readonly="!isAuthorized"></stress>
            <!--<stunts class="w-50 ml-2" v-model="character.details.stunts" :readonly="!isAuthorized"></stunts>-->
        </div>
    </b-container>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #fate-character {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    // Managers
    import authMan from '../../../client/api/managers/auth';
    import charMan from '../../../client/api/managers/character';

    // Components
    import Identity from './identity.vue';
    import Rolls from './rolls.vue';
    import Aspects from './aspects.vue';
    import Skills from './skills.vue';
    import Extras from './extras.vue';
    import Stunts from './stunts.vue';
    import Stress from './stress.vue';
    // import Consequences from './consequences.vue';
    import RpgkCard from '../../../client/components/ui/card.vue';
    import Portrait from '../../../client/components/character/portrait.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        components: {
            RpgkCard,
            Portrait,
            Identity,
            Rolls,
            Aspects,
            Skills,
            Extras,
            Stunts,
            Stress,
            // Consequences
        },
        computed: {
            isAuthorized()
            {
                return !!this.account
                    && !!this.character
                    && (this.account.id || 'nope!') === this.character.account_id;
            }
        },
        subscriptions: {
            account: authMan.account$,
            character: charMan.selected$
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
