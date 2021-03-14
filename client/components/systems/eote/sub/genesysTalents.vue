<!----------------------------------------------------------------------------------------------------------------------
  -- genesysTalents.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="genesys-sub-talents">
        <tier-row :tier="1"></tier-row>
        <tier-row class="mt-3" :tier="2"></tier-row>
        <tier-row class="mt-3" :tier="3"></tier-row>
        <tier-row class="mt-3" :tier="4"></tier-row>
        <tier-row class="mt-3" :tier="5"></tier-row>

        <h5 v-if="talents.length === 0" class="m-0 text-center">
            No Talents
        </h5>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #genesys-sub-talents {
        .talent-row {
            margin-top: -0.5rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Managers
    import charMan from '../../../../api/managers/character';
    import eoteMan from '../../../../api/managers/eote';

    // Components
    import TierRow from './tierRow.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'GenesysSubTalents',
        components: {
            TierRow
        },
        props: {
            readonly: {
                type: Boolean,
                default: false
            }
        },
        subscriptions: {
            character: charMan.selected$,
            mode: eoteMan.mode$
        },
        computed: {
            talents()
            {
                return _.sortBy(this.character.details.talents, [
                    (talentInst) =>
                    {
                        const talentBase = _.find(eoteMan.talents, { id: talentInst.id });
                        return (talentBase || {}).tier || 0;
                    },
                    (talentInst) =>
                    {
                        const talentBase = _.find(eoteMan.talents, { id: talentInst.id });
                        return (talentBase || {}).name;
                    }
                ]);
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
