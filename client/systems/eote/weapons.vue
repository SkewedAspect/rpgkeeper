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
                <b-btn size="sm" style="margin-bottom: 1px;" @click="openAddEditModal()">
                    <fa icon="plus" fixed-width></fa>
                    <span class="d-none d-md-inline">Add</span>
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
                <quality v-for="(quality, index) in data.value" :key="index" :name="quality.name" :rank="quality.rank"></quality>
            </template>

            <!-- Buttons Slot -->
            <template v-slot:cell(buttons)="data">
                <b-btn size="sm" @click="openAddEditModal(data.item)">
                    <fa icon="edit"></fa>
                </b-btn>
                <b-btn variant="danger" size="sm" @click="openDeleteModal(data.item)">
                    <fa icon="trash-alt"></fa>
                </b-btn>
            </template>
        </b-table>

        <!-- Edit Modal -->
        <edit-modal ref="editModal"></edit-modal>

        <!-- Delete Modal -->
        <delete-modal
            v-if="delWeapon"
            ref="delModal"
            :name="delWeapon.name"
            type="weapon"
            @hidden="onDelModalHidden"
            @delete="onDelWeaponDelete"
        ></delete-modal>
    </rpgk-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #eote-weapons-block {
        .table tr td {
            vertical-align: middle !important;
        }
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
    import DeleteModal from '../../components/ui/deleteModal.vue';
    import EditModal from './modals/editWeaponsModal.vue';
    import Quality from './components/quality.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EotEWeaponsBlock',
        components: {
            RpgkCard,
            DeleteModal,
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
                delWeapon: undefined,
                fields: [
                    { key: 'name', headerTitle: 'Weapon name' },
                    { key: 'skill', headerTitle: 'Required Skill', tdClass: 'text-nowrap' },
                    { key: 'damage', label: 'Dmg.', headerTitle: 'Weapon Damage', tdClass: 'text-center' },
                    { key: 'criticalRating', label: 'Crit.', headerTitle: 'Weapon Critical rating', tdClass: 'text-center' },
                    {
                        key: 'range',
                        formatter(range)
                        {
                            return eoteMan.rangeEnum[range];
                        },
                        tdClass: 'text-center'
                    },
                    { key: 'encumbrance', label: 'Enc.', headerTitle: 'Weapon Encumbrance', tdClass: 'text-center' },
                    { key: 'rarity', label: 'Rar.', headerTitle: 'Weapon Rarity', tdClass: 'text-center' },
                    { key: 'qualities', label: 'Special', headerTitle: 'Weapon Qualities' },
                    { key: 'buttons', label: '', thStyle: 'min-width: 80px' }

                    /* TODO: Add in weapon modification support. */
                ]
            };
        },
        computed: {
            weapons() { return this.character.details.weapons; }
        },
        methods: {
            onDelModalHidden()
            {
                this.delWeapon = undefined;
            },
            onDelWeaponDelete()
            {
                this.removeWeapon(this.delWeapon);
            },
            openAddEditModal(weapon)
            {
                this.$refs.editModal.show(weapon);
            },
            openDeleteModal(weapon)
            {
                this.delWeapon = weapon;
                this.$nextTick(() =>
                {
                    this.$refs.delModal.show();
                });
            },
            async removeWeapon(weapon)
            {
                const index = this.character.details.weapons.indexOf(weapon);
                if(index !== -1)
                {
                    // Remove the weapon
                    this.character.details.weapons.splice(index, 1);

                    // Save
                    await charMan.save(this.character);
                } // end if
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
