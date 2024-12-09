<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditTalentModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-talent-modal">
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
                    Talent
                    <CloseButton class="float-end" @click="cancel" />
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
                        <BFormInput id="name-input" v-model="name" autocomplete="off" />
                    </BFormGroup>
                </BCol>
                <BCol cols="2" class="pt-4">
                    <BFormCheckbox v-model="ranked" class="mt-3" name="ranked-check" switch>
                        <b>Ranked</b>
                    </BFormCheckbox>
                </BCol>
            </BFormRow>
            <BFormRow>
                <BCol>
                    <BFormGroup
                        label="Activation"
                        label-class="fw-bold"
                        label-for="activation-input"
                    >
                        <BFormSelect
                            id="activation-input"
                            v-model="activation"
                            :options="activations"
                        />
                    </BFormGroup>
                </BCol>
                <BCol>
                    <BFormGroup
                        v-if="mode === 'eote'"
                        label="Trees"
                        label-class="fw-bold"
                        label-for="trees-input"
                    >
                        <BFormInput id="trees-input" v-model="trees" autocomplete="off" />
                    </BFormGroup>
                    <BFormGroup
                        v-else
                        label="Tiers"
                        label-class="fw-bold"
                        label-for="tiers-input"
                    >
                        <BFormInput
                            id="tiers-input"
                            v-model="tier"
                            number
                            type="number"
                            step="1"
                            min="1"
                            max="5"
                            autocomplete="off"
                        />
                    </BFormGroup>
                </BCol>
            </BFormRow>

            <BFormGroup
                id="extras-input-group"
                label="Description"
                label-class="fw-bold"
                label-for="extras-input"
            >
                <MarkdownEditor v-model:text="description" height="250px" />
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
    import {
        EoteOrGenesysTalent,
        EoteTalent,
    } from '../../../../../common/interfaces/systems/eote';

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

    const emit = defineEmits<{
        add : [talent: EoteTalent]
        edit : [talent: EoteTalent]
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const id = ref<number | undefined>(undefined);
    const name = ref('');
    const description = ref('');
    const activation = ref('');
    const trees = ref('');
    const tier = ref(1);
    const reference = ref('');
    const ranked = ref(false);
    const scope = ref<'public' | 'user'>('user');
    const official = ref(false);

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => eoteMan.mode);
    const isEdit = computed(() => id.value !== undefined);
    const activations = computed(() =>
    {
        return Object.keys(eoteMan.activationEnum)
            .map((value) =>
            {
                const text = eoteMan.activationEnum[value];
                return {
                    text,
                    value,
                };
            });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(talent ?: EoteOrGenesysTalent) : void
    {
        if(talent)
        {
            id.value = talent.id;
            name.value = talent.name;
            description.value = talent.description;
            activation.value = talent.activation;
            trees.value = talent.trees;
            tier.value = talent.tier;
            reference.value = talent.reference;
            ranked.value = talent.ranked;
            scope.value = talent.scope;
            official.value = talent.official;
        }
        else
        {
            id.value = undefined;
            name.value = '';
            description.value = '';
            activation.value = '';
            trees.value = '';
            tier.value = 1;
            reference.value = '';
            ranked.value = false;
            scope.value = 'user';
            official.value = false;
        }

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
            const talent = await eoteMan.editSup('talents', {
                id: id.value,
                name: name.value,
                description: description.value,
                activation: activation.value,
                trees: trees.value,
                tier: tier.value,
                ranked: ranked.value,
                reference: reference.value,
                scope: undefined,
                official: false,
            });

            this.$emit('edit', talent);
        }
        else
        {
            const talent = await eoteMan.addSup('talents', {
                name: name.value,
                description: description.value,
                activation: activation.value,
                trees: trees.value,
                tier: tier.value,
                ranked: ranked.value,
                reference: reference.value,
                scope: undefined,
                official: false,
            });

            this.$emit('add', talent);
        }
    }

    function onCancel() : void
    {
        id.value = undefined;
        name.value = '';
        description.value = '';
        activation.value = '';
        trees.value = '';
        tier.value = 1;
        reference.value = '';
        ranked.value = false;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
