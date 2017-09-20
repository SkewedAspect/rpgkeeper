<!--------------------------------------------------------------------------------------------------------------------->
<!-- aspects                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="fate-aspects" style="flex: 1">
        <md-toolbar class="md-dense">
            <h2 style="flex: 1" class="md-title">Aspects</h2>
            <md-button>Edit</md-button>
        </md-toolbar>

        <table class="md-static-table">
            <tr>
                <td style="width: 1%"><b>HC:</b></td>
                <td>{{ highConcept.detail }}</td>
            </tr>
            <tr>
                <td style="width: 1%"><b>TR:</b></td>
                <td>{{ trouble.detail }}</td>
            </tr>
            <tr v-for="aspect in extraAspects">
                <td style="width: 1%" class="no-sides"></td>
                <td class="no-sides">{{ aspect.detail }}</td>
            </tr>
        </table>
    </md-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #fate-aspects {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        props: {
            aspects: {
                type: Array,
                required: true
            }
        },
        computed: {
            highConcept(){ return _.find(this.aspects, { type: 'high concept' }); },
            trouble(){ return _.find(this.aspects, { type: 'trouble' }); },
            extraAspects(){ return _.filter(this.aspects, { type: 'aspect' }); }
        },
        data()
        {
            return {
                // Data goes here
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->