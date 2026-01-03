<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditMotivationModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-motivation-modal">
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
                    <Fa icon="file-edit" />
                    <span v-if="isEdit">
                        Edit
                    </span>
                    <span v-else>
                        Add
                    </span>
                    Motivation
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormRow>
                <BCol cols="9">
                    <BFormGroup
                        label="Name"
                        label-class="fw-bold"
                        label-for="name-input"
                    >
                        <BFormInput id="name-input" v-model="name" autocomplete="off" />
                    </BFormGroup>
                </BCol>
                <BCol cols="3">
                    <BFormGroup
                        v-slot="{ ariaDescribedby }"
                        label="Type"
                        label-class="fw-bold"
                    >
                        <BFormRadio
                            v-model="type"
                            :aria-describedby="ariaDescribedby"
                            name="type-radios"
                            value="strength"
                            inline
                        >
                            Strength
                        </BFormRadio>
                        <BFormRadio
                            v-model="type"
                            :aria-describedby="ariaDescribedby"
                            name="type-radios"
                            value="flaw"
                            inline
                        >
                            Flaw
                        </BFormRadio>
                        <BFormRadio
                            v-model="type"
                            :aria-describedby="ariaDescribedby"
                            name="type-radios"
                            value="desire"
                            inline
                        >
                            Desire
                        </BFormRadio>
                        <BFormRadio
                            v-model="type"
                            :aria-describedby="ariaDescribedby"
                            name="type-radios"
                            value="fear"
                            inline
                        >
                            Fear
                        </BFormRadio>
                    </BFormGroup>
                </BCol>
            </BFormRow>
            <BFormGroup
                id="description-input-group"
                label="Description"
                label-class="fw-bold"
                label-for="description-input"
            >
                <MarkdownEditor v-model:text="description" />
            </BFormGroup>

            <ScopeSelect v-model:scope="scope" v-model:official="official" />

            <EditReference v-model:reference="reference" />

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <Fa icon="save" />
                    Save
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <Fa icon="times" />
                    Cancel
                </BButton>
            </template>
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Managers
    import eoteMan from '@client/lib/managers/systems/eote';

    // Models
    import type {
        EoteQuality,
        GenesysMotivation,
        GenesysMotivationType } from '@rpgk/core/models/systems';

    // Components
    import EditReference from '@client/components/character/editReference.vue';
    import ScopeSelect from '@client/components/character/scopeSelect.vue';
    import MarkdownEditor from '@client/components/ui/markdownEditor.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    const emit = defineEmits<{
        add : [motivation: GenesysMotivation]
        edit : [motivation: GenesysMotivation]
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const id = ref<number>(null);
    const name = ref('');
    const type = ref<GenesysMotivationType>('strength');
    const description = ref('');
    const reference = ref('');
    const scope = ref<'public' | 'user'>('user');
    const official = ref(false);

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isEdit = computed(() => !!id.value);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(motivation : Partial<GenesysMotivation>) : void
    {
        id.value = motivation.id ?? null;
        name.value = motivation.name ?? '';
        type.value = motivation.type ?? 'strength';
        description.value = motivation.description ?? '';
        reference.value = motivation.reference ?? '';
        scope.value = motivation.scope ?? 'user';
        official.value = motivation.official ?? false;

        // Show the modal
        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    async function onSave() : Promise<void>
    {
        if(isEdit.value)
        {
            const motivation = await eoteMan.editSup('motivations', {
                id: id.value,
                name: name.value,
                type: type.value,
                description: description.value,
                reference: reference.value,
                official: official.value,
                scope: scope.value,
            });

            emit('edit', motivation);
        }
        else
        {
            const motivation = await eoteMan.addSup('motivations', {
                id: id.value,
                name: name.value,
                type: type.value,
                description: description.value,
                reference: reference.value,
                official: official.value,
                scope: scope.value,
            });

            emit('add', motivation);
        }

        // Clear
        id.value = null;
        name.value = '';
        type.value = 'strength';
        description.value = '';
        reference.value = '';
        scope.value = 'user';
        official.value = false;
    }

    function onCancel() : void
    {
        id.value = null;
        name.value = '';
        type.value = 'strength';
        description.value = '';
        reference.value = '';
        scope.value = 'user';
        official.value = false;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
