<!----------------------------------------------------------------------------------------------------------------------
  -- Aspects
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <rpgk-card id="fate-aspects" :class="{ readonly: readonly }" no-body shrink>
        <div slot="header" class="d-flex">
            <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                <font-awesome-icon class="mr-1" icon="tasks"></font-awesome-icon>
                <span class="d-none d-md-inline">Aspects</span>
            </h5>
            <div class="ml-auto" v-if="!readonly">
                <b-btn @click="openEditModal()" size="sm" style="margin-bottom: 1px;">
                    <font-awesome-icon icon="edit" fixed-width></font-awesome-icon>
                    <span class="d-none d-md-inline">Edit</span>
                </b-btn>
            </div>
        </div>

        <!-- Content -->
        <table class="table table-bordered mb-0 font-sm">

            <!-- High Concept -->
            <tr>
                <td class="text-nowrap">
                    <b>High Concept:</b>
                </td>
                <td class="w-100">
                    {{ highConcept.detail }}
                </td>
            </tr>

            <!-- Trouble Concept -->
            <tr>
                <td class="text-nowrap">
                    <b>Trouble:</b>
                </td>
                <td class="w-100">
                    {{ trouble.detail }}
                </td>
            </tr>

            <!-- Extra Concepts -->
            <tr v-for="aspect in extraAspects">
                <td colspan="2">
                    {{ aspect.detail }}
                </td>
            </tr>
        </table>

        <!-- Modals -->
        <edit-aspects-modal ref="editModal" v-model="aspects"></edit-aspects-modal>
    </rpgk-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #fate-aspects {
        table {
            tr:last-child {
                td {
                    border-bottom-width: 1px;
                }
            }
        }
    }

    #edit-aspect-modal {
        .md-dialog {
            min-width: 60%;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Components
    import RpgkCard from '../../../client/components/ui/card.vue';
    import EditAspectsModal from './editAspectsModal.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'FateAspectsCard',
        components: {
            EditAspectsModal,
            RpgkCard
        },
        props: {
            value: {
                type: Array,
                required: true
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            aspects: {
                get(){ return this.value },
                set(val){ this.$emit('input', val); }
            },
            highConcept(){ return _.find(this.aspects, { type: 'high concept' }) || { detail: '' }; },
            trouble(){ return _.find(this.aspects, { type: 'trouble' }) || { detail: '' }; },
            extraAspects(){ return _.filter(this.aspects, { type: 'aspect' }); }
        },
        methods: {
            openEditModal()
            {
                this.$refs.editModal.show();
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
