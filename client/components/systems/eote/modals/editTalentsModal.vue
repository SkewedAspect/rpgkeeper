<!----------------------------------------------------------------------------------------------------------------------
  -- EditTalentModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div v-if="character" class="edit-talent-modal">
        <b-modal
            ref="modal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xl"
            @ok="onSave"
            @shown="onShown"
        >
            <!-- Modal Header -->
            <template slot="modal-title">
                <fa icon="file-edit"></fa>
                Edit Talents
            </template>

            <!-- Modal Content -->
            <div :class="`${ mode }-system`">
                <supplement-select
                    ref="suppSelect"
                    label="Talents"
                    label-class="font-weight-bold"
                    :available="talents"
                    :selected="selectedTalents"
                    @add="onTalentAdd"
                    @remove="onTalentRemove"
                    @new="onTalentNew"
                    @edit="onTalentEdit"
                    @delete="onTalentDelete"
                >
                    <template #preview="{ instance, supplement }">
                        <div class="clearfix">
                            <div v-if="supplement.ranked" class="mb-2 float-right">
                                <label for="sb-inline">Ranks</label>
                                <b-form-spinbutton id="sb-inline" v-model="instance.ranks" inline></b-form-spinbutton>
                            </div>
                            <div class="mb-2">
                                <i>{{ getActivation(supplement) }}</i>
                            </div>
                            <markdown-block :text="supplement.description" inline></markdown-block>
                            <reference
                                class="float-right mt-2"
                                :reference="supplement.reference"
                            ></reference>
                        </div>
                        <div v-if="instance.notes" class="font-sm">
                            <hr />
                            <markdown-block :text="instance.notes" inline></markdown-block>
                        </div>
                    </template>
                </supplement-select>
            </div>

            <!-- Modal Buttons -->
            <template slot="modal-ok">
                <fa icon="save"></fa>
                Save
            </template>
            <template slot="modal-cancel">
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>

        <!-- Modals -->
        <add-edit-talent-modal ref="addEditTalentModal" @add="onTalentAdd"></add-edit-talent-modal>
        <delete-modal
            ref="delTalentModal"
            :name="delTalent.name"
            type="talent"
            @hidden="onDelTalentHidden"
            @delete="onDelTalentDelete"
        ></delete-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .edit-talent-modal {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Managers
    import charMan from '../../../../api/managers/character';
    import eoteMan from '../../../../api/managers/eote';

    // Components
    import SupplementSelect from '../../../character/supplementSelect.vue';
    import DeleteModal from '../../../ui/deleteModal.vue';
    import MarkdownBlock from '../../../ui/markdown.vue';
    import Reference from '../../../character/reference.vue';
    import AddEditTalentModal from './addEditTalentModal.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EditTalentModal',
        components: {
            DeleteModal,
            SupplementSelect,
            MarkdownBlock,
            Reference,
            AddEditTalentModal
        },
        subscriptions: {
            character: charMan.selected$,
            mode: eoteMan.mode$,
            talents: eoteMan.talents$
        },
        data()
        {
            return {
                selectedTalents: [],
                delTalent: {
                    id: undefined,
                    name: undefined
                }
            };
        },
        methods: {
            getActivation(talent)
            {
                return eoteMan.activationEnum[talent.activation] || 'Unknown';
            },
            async onSave()
            {
                this.character.details.talents = this.selectedTalents;

                // Save the character
                await charMan.save(this.character);
            },
            onShown()
            {
                this.selectedTalents = this.character.details.talents.concat();
            },
            getTalent(talentInstance)
            {
                return this.talents.find((talent) => talent.id === talentInstance.id);
            },
            onTalentAdd(talent)
            {
                const newTalent = { id: talent.id };

                if(this.getTalent(talent).ranked)
                {
                    newTalent.ranks = 1;
                } // end if

                this.selectedTalents.push(newTalent);
                this.selectedTalents = _.uniqBy(this.selectedTalents, 'id');
            },
            onTalentRemove(talent)
            {
                this.selectedTalents = _.remove(this.selectedTalents, (item) => item.id !== talent.id);
            },
            onTalentNew()
            {
                this.$refs.addEditTalentModal.show();
            },
            onTalentEdit(talent)
            {
                this.$refs.addEditTalentModal.show(talent);
            },
            onTalentDelete(talent)
            {
                this.delTalent.id = talent.id;
                this.delTalent.name = talent.name;

                this.$refs.delTalentModal.show();
            },
            onDelTalentHidden()
            {
                this.delTalent.id = '';
                this.delTalent.name = '';
            },
            async onDelTalentDelete()
            {
                this.$refs.suppSelect.clearSelection();
                this.selectedTalents = this.selectedTalents.filter((item) => item.id !== this.delTalent.id);
                this.character.details.talents = this.selectedTalents;

                return Promise.all([
                    await charMan.save(this.character),
                    await eoteMan.delSup('talents', this.delTalent)
                ]);
            },

            show()
            {
                this.$refs.modal.show();
            },
            hide()
            {
                this.$refs.modal.hide();
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
