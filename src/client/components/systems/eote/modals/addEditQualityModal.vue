<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditQualityModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-quality-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <fa icon="file-edit"></fa>
                    <span v-if="isEdit">
                        Edit
                    </span>
                    <span v-else>
                        Add
                    </span>
                    Quality
                    <CloseButton class="float-end" @click="cancel"></CloseButton>
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormRow>
                <BCol cols="10">
                    <BFormGroup
                        label="Name"
                        label-class="fw-bold"
                        label-for="name-input"
                    >
                        <BFormInput id="name-input" v-model="name" autocomplete="off"></BFormInput>
                    </BFormGroup>
                </BCol>
                <BCol cols="2" class="pt-4">
                    <BFormGroup v-model="passive" name="passive-check" switch>
                        <b>Passive</b>
                    </BFormGroup>
                    <BFormGroup v-model="ranked" name="ranked-check" switch>
                        <b>Ranked</b>
                    </BFormGroup>
                </BCol>
            </BFormRow>
            <BFormGroup
                id="extras-input-group"
                label="Description"
                label-class="fw-bold"
                label-for="extras-input"
            >
                <MarkdownEditor v-model:text="description"></MarkdownEditor>
            </BFormGroup>

            <ScopeSelect v-model:scope="scope" v-model:official="official"></ScopeSelect>

            <EditReference v-model:reference="reference"></EditReference>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <fa icon="save"></fa>
                    Save
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <fa icon="times"></fa>
                    Cancel
                </BButton>
            </template>
        </BModal>
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
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '../../../ui/closeButton.vue';

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
