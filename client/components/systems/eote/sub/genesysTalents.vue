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
<!--        <h6>Tier 1 ({{ tier1.length }})</h6>-->
<!--        <b-form-row class="talent-row">-->
<!--            <b-col v-for="talentInst in tier1" :key="talentInst.id" cols="4" class="mt-2">-->
<!--                <talent-card :talent="talentInst"></talent-card>-->
<!--            </b-col>-->
<!--        </b-form-row>-->
<!--        <h6>Tier 2 ({{ tier2.length }} / {{ tierMaxCount(2) }})</h6>-->
<!--        <b-form-row class="talent-row">-->
<!--            <b-col v-for="talentInst in tier2" :key="talentInst.id" cols="4" class="mt-2">-->
<!--                <talent-card :talent="talentInst"></talent-card>-->
<!--            </b-col>-->
<!--        </b-form-row>-->
<!--        <b-form-row style="margin-top: -0.5rem">-->
<!--            <b-col v-for="talentInst in talents" :key="talentInst.id" cols="4" class="mt-2">-->
<!--                <talent-card :talent="talentInst"></talent-card>-->
<!--            </b-col>-->
<!--        </b-form-row>-->

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
    // import TalentCard from '../components/talentCard.vue';
    import TierRow from './tierRow.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'GenesysSubTalents',
        components: {
            // TalentCard,
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
            tier1()
            {
                const filteredTalents = this.character.details.talents
                    .filter((talentInst) =>
                    {
                        const talentBase = _.find(eoteMan.talents, { id: talentInst.id });
                        return talentBase?.tier === 1;
                    });

                return _.sortBy(filteredTalents, [
                    (talentInst) =>
                    {
                        const talentBase = _.find(eoteMan.talents, { id: talentInst.id });
                        return (talentBase || {}).name;
                    }
                ]);
            },
            tier2()
            {
                const filteredTalents = this.character.details.talents
                    .filter((talentInst) =>
                    {
                        const talentBase = _.find(eoteMan.talents, { id: talentInst.id });
                        return talentBase?.tier === 2;
                    });

                return _.sortBy(filteredTalents, [
                    (talentInst) =>
                    {
                        const talentBase = _.find(eoteMan.talents, { id: talentInst.id });
                        return (talentBase || {}).name;
                    }
                ]);
            },
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
        },
        methods: {
            tierMaxCount(tier)
            {
                return Math.max(this[`tier${ tier - 1 }`].length - 1, 0);
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
