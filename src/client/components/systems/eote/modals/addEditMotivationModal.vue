<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditMotivationModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-motivation-modal">
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
                Motivation
            </template>

            <!-- Modal Content -->
            <b-form-row>
                <b-col cols="9">
                    <b-form-group
                        label="Name"
                        label-class="font-weight-bold"
                        label-for="name-input"
                    >
                        <BFormInput id="name-input" v-model="name" autocomplete="off"></BFormInput>
                    </b-form-group>
                </b-col>
                <b-col cols="3">
                    <b-form-group
                        v-slot="{ ariaDescribedby }"
                        label="Type"
                        label-class="font-weight-bold"
                    >
                        <b-form-radio
                            v-model="type"
                            :aria-describedby="ariaDescribedby"
                            name="type-radios"
                            value="strength"
                            inline
                        >
                            Strength
                        </b-form-radio>
                        <b-form-radio
                            v-model="type"
                            :aria-describedby="ariaDescribedby"
                            name="type-radios"
                            value="flaw"
                            inline
                        >
                            Flaw
                        </b-form-radio>
                        <b-form-radio
                            v-model="type"
                            :aria-describedby="ariaDescribedby"
                            name="type-radios"
                            value="desire"
                            inline
                        >
                            Desire
                        </b-form-radio>
                        <b-form-radio
                            v-model="type"
                            :aria-describedby="ariaDescribedby"
                            name="type-radios"
                            value="fear"
                            inline
                        >
                            Fear
                        </b-form-radio>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-group
                id="description-input-group"
                label="Description"
                label-class="font-weight-bold"
                label-for="description-input"
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

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Models
    import {
        GenesysMotivation,
        GenesysMotivationType
    } from '../../../../../common/interfaces/systems/eote';

    // Components
    import EditReference from '../../../character/editReference.vue';
    import ScopeSelect from '../../../character/scopeSelect.vue';
    import MarkdownEditor from '../../../ui/markdownEditor.vue';
    import { BModal } from 'bootstrap-vue-next';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'add', motivation : GenesysMotivation) : void;
        (e : 'edit', motivation : GenesysMotivation) : void;
    }

    const emit = defineEmits<Events>();

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
                scope: scope.value
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
                scope: scope.value
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
