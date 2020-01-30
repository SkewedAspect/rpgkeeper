<!--------------------------------------------------------------------------------------------------------------------->
<!-- Character Component                                                                                             -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="eote-character" class="container" :class="isEotE ? 'eote-system' : 'genesys-system'">
        <span v-if="isEotE">
            EDGE OF THE EMPIRE, BABY!!!!!oneoneone
        </span>
        <span v-else>
            GENESYS RULES!!!!111oneoneone
        </span>

        <sy icon="force"></sy>

        <hr />

        <difficulty></difficulty> <difficulty></difficulty> <threat></threat> <boost></boost>
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

    // Managers
    import authMan from '../../api/managers/auth';
    import charMan from '../../api/managers/character';

    // Components
    import EoteSymbol from './symbol.vue';
    // import PortraitComponent from '../../../client/components/character/portrait.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        components: {
            sy: EoteSymbol
            // portrait: PortraitComponent
        },
        subscriptions: {
            account: authMan.account$,
            character: charMan.selected$
        },
        data()
        {
            return {
                // Data goes here
            };
        },
        computed: {
            isEotE()
            {
                return this.character.system === 'eote';
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
