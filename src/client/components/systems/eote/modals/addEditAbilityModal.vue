<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditAbilityModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-ability-modal">
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
                    Ability
                    <CloseButton class="float-end" @click="cancel"></CloseButton>
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormGroup
                label="Name"
                label-class="fw-bold"
                label-for="name-input"
            >
                <BFormInput id="name-input" v-model="name" autocomplete="off"></BFormInput>
            </BFormGroup>
            <BFormGroup
                id="extras-input-group"
                label="Description"
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
    import { EoteAbility } from '../../../../../common/interfaces/systems/eote';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import MarkdownEditor from '../../../ui/markdownEditor.vue';
    import EditReference from '../../../character/editReference.vue';
    import ScopeSelect from '../../../character/scopeSelect.vue';
    import { BModal } from 'bootstrap-vue-next';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'add', ability : EoteAbility) : void;
        (e : 'edit', ability : EoteAbility) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const id = ref<number>(null);
    const name = ref('');
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

    function show(ability ?: EoteAbility) : void
    {
        if(ability)
        {
            id.value = ability.id;
            name.value = ability.name;
            description.value = ability.description;
            reference.value = ability.reference;
            scope.value = ability.scope;
            official.value = ability.official;
        }
        else
        {
            id.value = null;
            name.value = '';
            description.value = '';
            reference.value = '';
            scope.value = 'user';
            official.value = false;
        }

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
            const ability = await eoteMan.editSup<EoteAbility>('abilities', {
                id: id.value,
                name: name.value,
                description: description.value,
                reference: reference.value,
                official: official.value,
                scope: scope.value
            });

            emit('edit', ability);
        }
        else
        {
            const ability = await eoteMan.addSup<EoteAbility>('abilities', {
                name: name.value,
                description: description.value,
                reference: reference.value,
                official: official.value,
                scope: scope.value
            });

            emit('add', ability);
        }
    }

    function onCancel() : void
    {
        id.value = null;
        name.value = '';
        description.value = '';
        reference.value = '';
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
