<!----------------------------------------------------------------------------------------------------------------------
  -- defenses.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <rpgk-card id="eote-defenses-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="mr-1" icon="shield"></fa>
                    <span class="d-none d-md-inline">Defenses</span>
                </h5>
                <div v-if="!readonly" class="ml-auto">
                    <b-btn size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <fa icon="edit" fixed-width></fa>
                        <span class="d-none d-md-inline">Edit</span>
                    </b-btn>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <div class="d-flex">
            <b-card class="flex-fill mr-2" no-body>
                <div class="p-2 text-center">
                    <b>Soak</b>
                    <hr class="m-1" />
                    <h5 class="m-0">
                        {{ defenses.soak }}
                    </h5>
                </div>
            </b-card>
            <b-card class="flex-fill" no-body>
                <div class="p-2 text-center">
                    <b>Melee / Ranged</b>
                    <hr class="m-1" />
                    <h5 class="m-0">
                        {{ defenses.melee }} / {{ defenses.ranged }}
                    </h5>
                </div>
            </b-card>
        </div>

        <!-- Edit Modal -->
        <edit-modal ref="editModal"></edit-modal>
    </rpgk-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #eote-defenses-block {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts">
    //------------------------------------------------------------------------------------------------------------------

    import Vue from 'vue';

    // Managers
    import charMan from '../../../lib/managers/character';

    // Components
    import RpgkCard from '../../ui/card.vue';
    import EditModal from './modals/editDefensesModal.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default Vue.extend({
        name: 'EotEDefensesBlock',
        components: {
            RpgkCard,
            EditModal
        },
        props: {
            readonly: {
                type: Boolean,
                default: false
            }
        },
        subscriptions()
        {
            return {
                character: charMan.selected$
            };
        },
        computed: {
            defenses() { return this.character.details.defenses; }
        },
        methods: {
            openEditModal()
            {
                this.$refs.editModal.show();
            }
        }

    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
