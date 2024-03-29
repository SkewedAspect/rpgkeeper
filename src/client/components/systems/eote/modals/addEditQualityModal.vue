<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditQualityModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-quality-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                <span v-if="isEdit">
                    Edit
                </span>
                <span v-else>
                    Add
                </span>
                Quality
            </template>

            <!-- Modal Content -->
            <b-form-row>
                <b-col cols="10">
                    <b-form-group
                        label="Name"
                        label-class="font-weight-bold"
                        label-for="name-input"
                    >
                        <b-form-input id="name-input" v-model="name" autocomplete="off"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="2" class="pt-4">
                    <b-form-checkbox v-model="passive" name="passive-check" switch>
                        <b>Passive</b>
                    </b-form-checkbox>
                    <b-form-checkbox v-model="ranked" name="ranked-check" switch>
                        <b>Ranked</b>
                    </b-form-checkbox>
                </b-col>
            </b-form-row>
            <b-form-group
                id="extras-input-group"
                label="Description"
                label-class="font-weight-bold"
                label-for="extras-input"
            >
                <MarkdownEditor v-model:text="description"></MarkdownEditor>
            </b-form-group>

            <ScopeSelect v-model:scope="scope" v-model:official="official"></ScopeSelect>

            <EditReference v-model:reference="reference"></EditReference>

            <!-- Modal Buttons -->
            <template #modal-ok>
                <fa icon="save"></fa>
                Save
            </template>
            <template #modal-cancel>
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import { EoteQuality } from '../../../../../common/interfaces/systems/eote';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import EditReference from '../../../character/editReference.vue';
    import MarkdownEditor from '../../../ui/markdownEditor.vue';
    import ScopeSelect from '../../../character/scopeSelect.vue';
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'add', quality : EoteQuality) : void;
        (e : 'edit', quality : EoteQuality) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const id = ref<number>(undefined);
    const name = ref('');
    const description = ref('');
    const reference = ref('');
    const passive = ref(false);
    const ranked = ref(false);
    const scope = ref<'public' | 'user'>('user');
    const official = ref(false);

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isEdit = computed(() => id.value !== undefined);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(quality ?: EoteQuality) : void
    {
        if(quality)
        {
            id.value = quality.id;
            name.value = quality.name;
            description.value = quality.description;
            passive.value = !!quality.passive;
            ranked.value = !!quality.ranked;
            reference.value = quality.reference;
            scope.value = quality.scope;
            official.value = quality.official;
        }
        else
        {
            id.value = undefined;
            name.value = '';
            description.value = '';
            passive.value = false;
            ranked.value = false;
            reference.value = '';
            scope.value = 'user';
            official.value = false;
        }

        innerModal.value.show();
    }

    function hide() : void
    {
        id.value = undefined;
        name.value = '';
        description.value = '';
        passive.value = false;
        ranked.value = false;
        reference.value = '';
        scope.value = 'user';
        official.value = false;

        innerModal.value.hide();
    }

    async function onSave()
    {
        if(isEdit.value)
        {
            const quality = await eoteMan.editSup('qualities', {
                id: id.value,
                name: name.value,
                description: description.value,
                passive: passive.value,
                ranked: ranked.value,
                reference: reference.value,
                scope: scope.value,
                official: official.value
            });

            emit('edit', quality);
        }
        else
        {
            const quality = await eoteMan.addSup('qualities', {
                name: name.value,
                description: description.value,
                passive: passive.value,
                ranked: ranked.value,
                reference: reference.value,
                scope: scope.value,
                official: official.value
            });

            emit('add', quality);
        }
    }

    function onCancel() : void
    {
        id.value = undefined;
        name.value = '';
        description.value = '';
        passive.value = false;
        ranked.value = false;
        reference.value = '';
        scope.value = 'user';
        official.value = false;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
