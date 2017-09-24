<!--------------------------------------------------------------------------------------------------------------------->
<!-- skills                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="fate-skills" style="flex: 1">
        <md-toolbar class="md-dense">
            <h2 style="flex: 1" class="md-title">Skills</h2>
            <md-button>Edit</md-button>
        </md-toolbar>

        <table class="md-static-table">
            <tr>
                <td><b>Superb (+5)</b></td>
                <td v-for="idx in columns">{{ getSkillName('superb', idx) }}</td>
            </tr>
            <tr>
                <td><b>Great (+4)</b></td>
                <td v-for="idx in columns">{{ getSkillName('great', idx) }}</td>
            </tr>
            <tr>
                <td><b>Good (+3)</b></td>
                <td v-for="idx in columns">{{ getSkillName('good', idx) }}</td>
            </tr>
            <tr>
                <td><b>Fair (+2)</b></td>
                <td v-for="idx in columns">{{ getSkillName('fair', idx) }}</td>
            </tr>
            <tr>
                <td><b>Average (+1)</b></td>
                <td v-for="idx in columns">{{ getSkillName('average', idx) }}</td>
            </tr>
        </table>
    </md-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #fate-skills {
        table {
            height: calc(100% - 48px);

            tr {
                td:first-child {
                    width: 1%;
                    white-space: nowrap;
                    text-align: right;
                }
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
            skills: {
                type: Array,
                required: true
            }
        },
        computed: {
            average(){ return _.filter(this.skills, { rank: 1 }) },
            fair(){ return _.filter(this.skills, { rank: 2 }) },
            good(){ return _.filter(this.skills, { rank: 3 }) },
            great(){ return _.filter(this.skills, { rank: 4 }) },
            superb(){ return _.filter(this.skills, { rank: 5 }) },

            // Should be a list of indexes for the other computed properties.
            columns(){ return _.range(this.average.length); }
        },
        methods: {
            getSkillName(list, idx)
            {
                return _.get(this, `${ list }[${ idx }].name`, '');
            }
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