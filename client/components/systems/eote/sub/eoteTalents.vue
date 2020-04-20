<!----------------------------------------------------------------------------------------------------------------------
  -- eoteTalents.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="eote-sub-talents">
        <b-form-row>
            <b-col v-for="talent in talents" :key="talent.name" cols="4">
                <talent-card :talent="talent"></talent-card>
            </b-col>
        </b-form-row>

        <h5 v-if="talents.length === 0" class="m-0 text-center">
            No Talents
        </h5>

        <!-- Delete Modal -->
        <delete-modal
            v-if="delTalent"
            ref="delModal"
            :name="delTalent.name"
            type="talent"
            @hidden="onDelModalHidden"
            @delete="onDelTalentDelete"
        ></delete-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #eote-sub-talents {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    // Managers
    import charMan from '../../../../api/managers/character';
    import eoteMan from '../../../../api/managers/eote';

    // Components
    import TalentCard from '../components/talentCard.vue';
    import DeleteModal from '../../../ui/deleteModal';
    // import EditModal from '../modals/editTalentsModal.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EoteSubTalents',
        components: {
            TalentCard,
            DeleteModal
            // EditModal,
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
                delTalent: undefined
            };
        },
        computed: {
            talents() { return this.character.details.talents; }
        },
        methods: {
            onDelModalHidden()
            {
                this.delTalent = undefined;
            },
            onDelTalentDelete()
            {
                this.removeTalent(this.delTalent);
            },
            openAddEditModal(talent)
            {
                this.$refs.editModal.show(talent);
            },
            openDeleteModal(talent)
            {
                this.delTalent = talent;
                this.$nextTick(() =>
                {
                    this.$refs.delModal.show();
                });
            },
            async removeTalent(talent)
            {
                const index = this.character.details.talents.indexOf(talent);
                if(index !== -1)
                {
                    // Remove the talent
                    this.character.details.talents.splice(index, 1);

                    // Save
                    await charMan.save(this.character);
                } // end if
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
