<!----------------------------------------------------------------------------------------------------------------------
  -- qualityEdit.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="quality-edit">
        <supplement-select
            ref="suppSelect"
            label="Qualities"
            label-class="font-weight-bold"
            :available="qualities"
            :selected="selectedQualities"
            @add="onQualityAdd"
            @remove="onQualityRemove"
            @new="onQualityNew"
            @edit="onQualityEdit"
            @delete="onQualityDelete"
        >
        </supplement-select>

        <!-- Modals -->
        <!--        <add-edit-ability-modal ref="addEditAbilityModal" @add="onAbilityModalAdd"></add-edit-ability-modal>-->
        <delete-modal
            ref="delQualityModal"
            :name="delQuality.name"
            type="quality"
            @hidden="onDelQualityHidden"
            @delete="onDelQualityDelete"
        ></delete-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #quality-edit {
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
    import DeleteModal from '../../../ui/deleteModal';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EoteQualityEdit',
        components: {
            DeleteModal,
            SupplementSelect
        },
        props: {
            value: {
                type: Array,
                required: true
            }
        },
        subscriptions: {
            character: charMan.selected$,
            mode: eoteMan.mode$,
            qualities: eoteMan.qualities$
        },
        data()
        {
            return {
                delQuality: {
                    id: undefined,
                    name: undefined
                }
            };
        },
        computed: {
            selectedQualities: {
                get()
                {
                    return this.value.concat();
                },
                set(val)
                {
                    this.$emit('input', val);
                }
            }
        },
        methods: {
            getQual(qualityInstance)
            {
                return this.qualities.find((qual) => qual.id === qualityInstance.id);
            },
            onQualityAdd(quality)
            {
                const newQual = { id: quality.id };

                if(this.getQual(quality).ranked)
                {
                    newQual.rank = 1;
                } // end if

                this.selectedQualities.push(newQual);
                this.selectedQualities = _.uniqBy(this.selectedQualities, 'id');

                this.$emit('input', this.selectedQualities);
            },
            onQualityRemove(quality)
            {
                this.selectedQualities = _.remove(this.selectedQualities, (qual) => qual.id !== quality.id);
            },
            onQualityNew()
            {
                this.$refs.addEditQualityModal.show();
            },
            onQualityModalAdd(quality)
            {
                this.selectedQualities.push(quality.id);
            },
            onQualityEdit(quality)
            {
                this.$refs.addEditQualityModal.show(quality);
            },
            onQualityDelete(quality)
            {
                this.delQuality.id = quality.id;
                this.delQuality.name = quality.name;

                this.$refs.delQualityModal.show();
            },
            onDelQualityHidden()
            {
                this.delQuality.id = '';
                this.delQuality.name = '';
            },
            async onDelQualityDelete()
            {
                this.$refs.suppSelect.clearSelection();
                this.selectedQualities = _.without(this.selectedQualities, this.delQuality.id);
                this.character.details.qualities = this.selectedQualities;

                return Promise.all([
                    await charMan.save(this.character),
                    await eoteMan.delSup('qualities', this.delQuality)
                ]);
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
