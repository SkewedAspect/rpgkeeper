<!----------------------------------------------------------------------------------------------------------------------
  -- weapons.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <rpgk-card id="eote-weapons-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <div slot="header" class="d-flex">
            <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                <fa class="mr-1" :icon="mode === 'eote' ? 'sword-laser-alt' : 'sword'"></fa>
                <span class="d-none d-md-inline">Weapons</span>
            </h5>
            <div v-if="!readonly" class="ml-auto">
                <b-btn size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                    <fa icon="edit" fixed-width></fa>
                    <span class="d-none d-md-inline">Edit</span>
                </b-btn>
            </div>
        </div>

        <!-- Card Body -->
        <b-table class="font-sm mb-0" :items="weapons" :fields="fields" small hover show-empty>
            <!-- Empty Slot -->
            <template v-slot:empty>
                <h5 class="mt-2 text-center">
                    No weapons
                </h5>
            </template>

            <!-- Qualities Slot -->
            <template v-slot:cell(qualities)="data">
                <quality v-for="quality in data.value" :key="quality.name" :name="quality.name" :rank="quality.rank"></quality>
            </template>
        </b-table>

        <!-- Edit Modal -->
        <edit-modal ref="editModal"></edit-modal>
    </rpgk-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #eote-weapons-block {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    // Managers
    import charMan from '../../api/managers/character';
    import eoteMan from '../../api/managers/eote';

    // Components
    import RpgkCard from '../../components/ui/card.vue';
    import EditModal from './modals/editDefensesModal.vue';
    import Quality from './components/quality.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EotEWeaponsBlock',
        components: {
            RpgkCard,
            EditModal,
            Quality
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
        data()
        {
            return {
                fields: [
                    { key: 'name' },
                    { key: 'skill' },
                    { key: 'damage' },
                    { key: 'criticalRating', label: 'Critical' },
                    {
                        key: 'range',
                        formatter(range)
                        {
                            return eoteMan.rangeEnum[range];
                        }
                    },
                    { key: 'encumbrance', label: 'Encumb.' },
                    { key: 'rarity' },
                    { key: 'qualities' }
                ]
            };
        },
        computed: {
            weapons() { return this.character.details.weapons; }
        },
        methods: {
            openEditModal()
            {
                this.$refs.editModal.show();
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
