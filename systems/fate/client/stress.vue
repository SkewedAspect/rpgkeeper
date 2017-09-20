<!--------------------------------------------------------------------------------------------------------------------->
<!-- stress                                                                                                          -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="fate-stress" style="flex: 1">
        <md-toolbar class="md-dense">
            <h2 style="flex: 1" class="md-title">Physical Stress</h2>
        </md-toolbar>

        <table class="md-static-table">
            <tr>
                <td v-for="(_, index) in physicalStress">
                    <md-checkbox v-model="physicalStress[index]" :disabled="(index + 1) > totalPhysicalBoxes">
                        <b>{{ index + 1 }}</b>
                    </md-checkbox>
                </td>
            </tr>
        </table>

        <md-toolbar class="md-dense">
            <h2 style="flex: 1" class="md-title">Mental Stress</h2>
        </md-toolbar>

        <table class="md-static-table">
            <tr>
                <td v-for="(_, index) in mentalStress">
                    <md-checkbox v-model="mentalStress[index]" :disabled="(index + 1) > totalMentalBoxes">
                        <b>{{ index + 1 }}</b>
                    </md-checkbox>
                </td>
            </tr>
        </table>
    </md-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #fate-stress {
        .md-static-table {
            td {
                padding-top: 0;
                padding-bottom: 0;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------
    
    import _ from 'lodash';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        props: {
            character: {
                type: Object,
                required: true
            }
        },
        computed: {
            mentalStress(){ return this.character.mentalStress },
            physicalStress(){ return this.character.physicalStress },
            totalPhysicalBoxes()
            {
                const physique = _.find(this.character.skills, { name: "Physique" });
                if(physique && physique.rank >=1 && physique.rank < 3)
                {
                    return 3;
                }
                else if(physique && physique.rank >=3)
                {
                    return 4;
                }
                else
                {
                    return 2;
                } // end if
            },
            totalMentalBoxes()
            {
                const will = _.find(this.character.skills, { name: "Will" });
                if(will && will.rank >=1 && will.rank < 3)
                {
                    return 3;
                }
                else if(will && will.rank >=3)
                {
                    return 4;
                }
                else
                {
                    return 2;
                } // end if
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->