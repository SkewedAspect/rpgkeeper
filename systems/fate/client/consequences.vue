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
                            <span v-if="mildConsequence1.detail">
                                {{ mildConsequence1.detail }}
                                <small v-if="mildConsequence1.healing"><i>(Healing)</i></small>
                            </span>
                            <span class="placeholder" v-else>Mild</span>
                        </td>
                    </tr>
                    <tr>
                        <td><b>4</b></td>
                        <td>
                            <span v-if="moderateConsequence.detail">
                                {{ moderateConsequence.detail }}
                                <small v-if="moderateConsequence.healing"><i>(Healing)</i></small>
                            </span>
                            <span class="placeholder" v-else>Moderate</span>
                        </td>
                    </tr>
                    <tr>
                        <td><b>6</b></td>
                        <td>
                            <span v-if="severeConsequence.detail">
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
                            <span v-if="mildConsequence2.detail && extraMildType !== 'none'">
                                {{ mildConsequence2.detail }}
                                <small v-if="mildConsequence2.healing"><i>(Healing)</i></small>
                            </span>
                            <span class="placeholder" v-else>
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
            <md-dialog-title>Edit Consequences</md-dialog-title>
            <md-dialog-content>
                <md-layout>
                    <md-layout md-flex="75">
                        <md-input-container md-clearable>
                            <label>2: Mild</label>
                            <md-input v-model="mildConsequence1Edit.detail"></md-input>
                        </md-input-container>
                    </md-layout>
                    <md-layout md-flex="25" style="padding-right: 50px;">
                        <md-checkbox v-model="mildConsequence1Edit.healing" :disabled="!mildConsequence1Edit.detail">Healing</md-checkbox>
                    </md-layout>
                </md-layout>
                <md-layout>
                    <md-layout md-flex="75">
                        <md-input-container md-clearable>
                            <label>
                                2: Mild
                                <span v-if="extraMildType !== 'none'">({{ extraMildType }})</span>
                            </label>
                            <md-input v-model="mildConsequence2Edit.detail" :disabled="extraMildType === 'none'"></md-input>
                        </md-input-container>
                    </md-layout>
                    <md-layout md-flex="25" style="padding-right: 50px;">
                        <md-checkbox v-model="mildConsequence2Edit.healing" :disabled="!mildConsequence2Edit.detail || extraMildType === 'none'">Healing</md-checkbox>
                    </md-layout>
                </md-layout>
                <md-layout>
                    <md-layout md-flex="75">
                        <md-input-container md-clearable>
                            <label>4: Moderate</label>
                            <md-input v-model="moderateConsequenceEdit.detail"></md-input>
                        </md-input-container>
                    </md-layout>
                    <md-layout md-flex="25" style="padding-right: 50px;">
                        <md-checkbox v-model="moderateConsequenceEdit.healing" :disabled="!moderateConsequenceEdit.detail">Healing</md-checkbox>
                    </md-layout>
                </md-layout>
                <md-layout>
                    <md-layout md-flex="75">
                        <md-input-container md-clearable>
                            <label>6: Severe</label>
                            <md-input v-model="severeConsequenceEdit.detail"></md-input>
                        </md-input-container>
                    </md-layout>
                    <md-layout md-flex="25" style="padding-right: 50px;">
                        <md-checkbox v-model="severeConsequenceEdit.healing" :disabled="!severeConsequenceEdit.detail">Healing</md-checkbox>
                    </md-layout>
                </md-layout>
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
                    @media(min-width: 600px) {
                        padding-right: 8px;
                    }
                }

                &:last-child {
                    @media(min-width: 600px) {
                        padding-left: 8px;
                    }
                }

                & > .table-left {
                    tr td:first-child {
                        width: 24px;
                        text-align: center;
                    }

                    tr td:last-child {
                        @media(min-width: 600px) {
                            border-right-width: 1px;
                        }
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

                        @media(min-width: 600px) {
                            border-left-width: 1px;
                            border-right-width: 0;
                        }
                    }
                }

                & > .md-static-table {
                    tr:last-child td {
                        border-bottom-width: 1px;
                    }
                }

                & > .table-right {
                    tr:last-child td {
                        @media(max-width: 599px) {
                            border-bottom-width: 0;
                        }
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

    // Pull in the shortID utility
    import { shortID } from '../../../server/utilities';
    
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
            mildConsequence1(){ return _.filter(this.aspects, { type: 'consequence', value: 2 })[0] || { detail: "", healing: false, value: 2 }; },
            mildConsequence2(){ return _.filter(this.aspects, { type: 'consequence', value: 2 })[1] || { detail: "", healing: false, value: 2 }; },
            moderateConsequence(){ return _.filter(this.aspects, { type: 'consequence', value: 4 })[0] || { detail: "", healing: false, value: 4 }; },
            severeConsequence(){ return _.filter(this.aspects, { type: 'consequence', value: 6 })[0] || { detail: "", healing: false, value: 6 }; },
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
            addOrUpdateAspect(aspect)
            {
                if(aspect.id)
                {
                    const originalAspect = _.find(this.aspects, { id: aspect.id });
                    originalAspect.detail = aspect.detail;
                    originalAspect.healing = !!aspect.healing;
                }
                else
                {
                    this.aspects.push({ id: shortID(), detail: aspect.detail, healing: aspect.healing, value: aspect.value, type: "consequence" });
                } // end if
            },
            removeAspect(aspect)
            {
                const aspectIndex = _.findIndex(this.aspects, { id: aspect.id });
                if(aspectIndex)
                {
                    this.aspects.splice(aspectIndex, 1);
                } // end if
            },
            openEdit()
            {
                // Reset the edit fields
                this.mildConsequence1Edit = _.cloneDeep(this.mildConsequence1);
                this.mildConsequence2Edit = _.cloneDeep(this.mildConsequence2);
                this.moderateConsequenceEdit = _.cloneDeep(this.moderateConsequence);
                this.severeConsequenceEdit = _.cloneDeep(this.severeConsequence);

                this.$refs.editDialog.open();
            },
            closeEdit(save)
            {
                if(save)
                {
                    if(this.mildConsequence1Edit.detail)
                    {
                        this.addOrUpdateAspect(this.mildConsequence1Edit);
                    }
                    else if(this.mildConsequence1Edit.id)
                    {
                        this.removeAspect(this.mildConsequence1Edit)
                    } // end if

                    if(this.mildConsequence2Edit.detail)
                    {
                        this.addOrUpdateAspect(this.mildConsequence2Edit);
                    }
                    else if(this.mildConsequence2Edit.id)
                    {
                        this.removeAspect(this.mildConsequence2Edit)
                    } // end if

                    if(this.moderateConsequenceEdit.detail)
                    {
                        this.addOrUpdateAspect(this.moderateConsequenceEdit);
                    }
                    else if(this.moderateConsequenceEdit.id)
                    {
                        this.removeAspect(this.moderateConsequenceEdit)
                    } // end if

                    if(this.severeConsequenceEdit.detail)
                    {
                        this.addOrUpdateAspect(this.severeConsequenceEdit);
                    }
                    else if(this.severeConsequenceEdit.id)
                    {
                        this.removeAspect(this.severeConsequenceEdit)
                    } // end if
                } // end if

                // Reset the edit fields
                this.mildConsequence1Edit = _.cloneDeep(this.mildConsequence1);
                this.mildConsequence2Edit = _.cloneDeep(this.mildConsequence2);
                this.moderateConsequenceEdit = _.cloneDeep(this.moderateConsequence);
                this.severeConsequenceEdit = _.cloneDeep(this.severeConsequence);

                // Close the dialog
                this.$refs.editDialog.close();
            }
        },
        data()
        {
            return {
                mildConsequence1Edit: { detail: "", healing: false, value: 2 },
                mildConsequence2Edit: { detail: "", healing: false, value: 2 },
                moderateConsequenceEdit: { detail: "", healing: false, value: 4 },
                severeConsequenceEdit: { detail: "", healing: false, value: 6 }
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->