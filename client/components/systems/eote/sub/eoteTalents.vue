<!----------------------------------------------------------------------------------------------------------------------
  -- eoteTalents.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="eote-sub-talents">
        <b-form-row>
            <b-col v-for="talent in talents" :key="talent.name" cols="4">
                <talent-card :talent="talent"></talent-card>
            </b-col>
        </b-form-row>

        <h5 v-if="talents.length === 0" class="m-0 text-center">
            No Talents
        </h5>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #eote-sub-talents {
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
    import TalentCard from '../components/talentCard.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EoteSubTalents',
        components: {
            TalentCard
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
                return _.sortBy(
                    this.character.details.talents,
                    (talentInst) =>
                    {
                        const talentBase = _.find(eoteMan.talents, { id: talentInst.id });
                        return talentBase.name;
                    }
                );
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
