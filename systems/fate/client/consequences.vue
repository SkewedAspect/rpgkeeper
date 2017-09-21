<!--------------------------------------------------------------------------------------------------------------------->
<!-- consequences                                                                                                    -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="fate-consequences" style="flex: 1">
        <md-toolbar class="md-dense">
            <h2 style="flex: 1" class="md-title">Consequences</h2>
            <md-button @click.native="openEdit()">Edit</md-button>
        </md-toolbar>

        <md-layout class="table-layout">
            <md-layout md-flex-xsmall="100" md-flex="50">
                <table class="md-static-table table-left">
                    <tr>
                        <td><b>2</b></td>
                        <td>
                            <span v-if="mildConsequences[0]">
                                {{ mildConsequences[0].detail }}
                                <small v-if="mildConsequences[0].healing"><i>(Healing)</i></small>
                            </span>
                            <span class="placeholder" v-else>Mild</span>
                        </td>
                    </tr>
                    <tr>
                        <td><b>4</b></td>
                        <td>
                            <span v-if="moderateConsequence">
                                {{ moderateConsequence.detail }}
                                <small v-if="moderateConsequence.healing"><i>(Healing)</i></small>
                            </span>
                            <span class="placeholder" v-else>Moderate</span>
                        </td>
                    </tr>
                    <tr>
                        <td><b>6</b></td>
                        <td>
                            <span v-if="severeConsequence">
                                {{ severeConsequence.detail }}
                                <small v-if="severeConsequence.healing"><i>(Healing)</i></small>
                            </span>
                            <span class="placeholder" v-else>Severe</span>
                        </td>
                    </tr>
                </table>
            </md-layout>
            <md-layout md-flex-xsmall="100" md-flex="50">
                <table class="md-static-table table-right">
                    <tr>
                        <td :class="{ 'disabled': extraMildType === 'none' }">
                            <b>2</b>
                        </td>
                        <td>
                            <span v-if="mildConsequences[1] && extraMildType !== 'none'">
                                {{ mildConsequences[1].detail }}
                                <small v-if="mildConsequences[1].healing"><i>(Healing)</i></small>
                            </span>
                            <span class="placeholder">
                                Mild
                                <span v-if="extraMildType !== 'none'">({{ extraMildType }})</span>
                            </span>
                        </td>
                    </tr>
                </table>
            </md-layout>
        </md-layout>

        <!-- Edit Dialog -->
        <md-dialog ref="editDialog">
            <md-dialog-title>Edit Dialogs</md-dialog-title>
            <md-dialog-content>
                Nemo, nobis necessitatibus ut illo, ducimus ex.
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click.native="closeEdit()">Cancel</md-button>
                <md-button class="md-accent" @click.native="closeEdit(true)">Save</md-button>
            </md-dialog-actions>
        </md-dialog>
    </md-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #fate-consequences {
        .table-layout {
            margin-top: 0;
            margin-bottom: 0;

            & > .md-layout {
                margin-top: 0;
                margin-bottom: 0;

                &:first-child {
                    padding-right: 8px;
                }

                &:last-child {
                    padding-left: 8px;
                }

                & > .table-left {
                    tr td:first-child {
                        width: 24px;
                        text-align: center;
                    }

                    tr td:last-child {
                        border-right-width: 1px;
                    }
                }

                td {
                    .placeholder {
                        color: rgba(0, 0, 0, 0.26);
                    }
                }

                & > .table-right {
                    tr td:first-child {

                        &.disabled {
                            color: rgba(0, 0, 0, 0.26);
                        }

                        width: 24px;
                        text-align: center;
                        border-left-width: 1px;
                        border-right-width: 0;
                    }
                }

                & > .md-static-table {
                    tr:last-child td {
                        border-bottom-width: 1px;
                    }
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
            character: {
                type: Object,
                required: true
            }
        },
        computed: {
            aspects(){ return this.character.aspects; },
            mildConsequences(){ return _.filter(this.aspects, { type: 'consequence', value: 2 }); },
            moderateConsequence(){ return _.filter(this.aspects, { type: 'consequence', value: 4 })[0]; },
            severeConsequence(){ return _.filter(this.aspects, { type: 'consequence', value: 6 })[0]; },
            extraMildType()
            {
                const will = _.find(this.character.skills, { name: "Will" });
                const physique = _.find(this.character.skills, { name: "Physique" });

                if((physique && physique.rank >= 5) && (will && will.rank >= 5))
                {
                    return 'Mental and Physical';
                }
                else if(physique && physique.rank >= 5)
                {
                    return 'Physical';
                }
                else if(will && will.rank >= 5)
                {
                    return 'Mental';
                }
                else
                {
                    return 'none';
                } // end if
            }
        },
        methods: {
            openEdit()
            {
                this.$refs.editDialog.open();
            },
            closeEdit(save)
            {
                this.$refs.editDialog.close();
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->