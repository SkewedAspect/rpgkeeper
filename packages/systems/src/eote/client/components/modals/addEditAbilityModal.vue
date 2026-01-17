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
                    <Fa icon="file-edit" />
                    <span v-if="isEdit">
                        Edit
                    </span>
                    <span v-else>
                        Add
                    </span>
                    Ability
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormGroup
                label="Name"
                label-class="fw-bold"
                label-for="name-input"
            >
                <BFormInput id="name-input" v-model="name" autocomplete="off" />
            </BFormGroup>
            <BFormGroup
                id="extras-input-group"
                label="Description"
                label-for="extras-input"
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

    // Models
    import type { EoteAbility, EoteForcePower } from '../../models.ts';

    // Managers
    import eoteMan from '@client/lib/managers/systems/eote';

    // Components
    import MarkdownEditor from '@client/components/ui/markdownEditor.vue';
    import EditReference from '@client/components/character/editReference.vue';
    import ScopeSelect from '@client/components/character/scopeSelect.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    const emit = defineEmits<{
        add : [ability: EoteAbility]
        edit : [ability: EoteAbility]
    }>();

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
                scope: scope.value,
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
                scope: scope.value,
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
