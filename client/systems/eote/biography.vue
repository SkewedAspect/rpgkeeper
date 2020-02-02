<!----------------------------------------------------------------------------------------------------------------------
  -- biography.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <rpgk-card id="eote-bio-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <div slot="header" class="d-flex">
            <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                <fa class="mr-1" icon="address-card"></fa>
                <span class="d-none d-md-inline">Biography</span>
            </h5>
            <div v-if="!readonly" class="ml-auto">
                <b-btn size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                    <fa icon="edit" fixed-width></fa>
                    <span class="d-none d-md-inline">Edit</span>
                </b-btn>
            </div>
        </div>

        <!-- Card Body -->
        <div :class="{ 'd-flex': mode === 'eote' }">
            <div class="bio-line" :class="{ 'w-50': mode === 'eote' }">
                <b>Species<span v-if="mode === 'genesys'">/Archetype</span>:</b>
                <span class="m-0">{{ species }}</span>
            </div>
            <div class="bio-line" :class="{ 'w-50': mode === 'eote' }">
                <b>Career:</b>
                <span class="m-0">{{ career }}</span>
            </div>
        </div>
        <div v-if="mode === 'eote'" class="bio-line">
            <b>Specializations:</b>
            <span class="m-0">{{ specialization }}</span>
        </div>

        <!-- Edit Modal -->
        <edit-modal ref="editModal"></edit-modal>
    </rpgk-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #eote-bio-block {
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
    import EditModal from './modals/editBiographyModal.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EotEBiographyBlock',
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
        subscriptions: {
            character: charMan.selected$,
            mode: eoteMan.mode$
        },
        computed: {
            species() { return this.character.details.species || 'Unknown'; },
            career() { return this.character.details.career || 'Unknown'; },
            specialization() { return this.character.details.specialization || 'Unknown'; }
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
