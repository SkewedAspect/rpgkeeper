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
            @hidden="onCancel"
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
                            v-model.number="tier"
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
    import type {
        EoteOrGenesysTalent,
        EoteTalent,
    } from '../../../models.ts';
    import type { BoundedRange } from '@rpgk/core/utils/types';

    type TalentActivation = 'p' | 'ai' | 'aio' | 'am' | 'aa';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Constants
    import { activationEnum } from '../../constants';

    // Components
    import EditReference from '@client/components/character/editReference.vue';
    import MarkdownEditor from '@client/components/ui/markdownEditor.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    // Utils
    import { normalizeReference } from '@client/lib/utils/misc';

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

    const id = ref<string | undefined>(undefined);
    const name = ref('');
    const description = ref('');
    const activation = ref<TalentActivation | ''>('');
    const trees = ref('');
    const tier = ref<BoundedRange<1, 5>>(1 as BoundedRange<1, 5>);
    const reference = ref('');
    const ranked = ref(false);
    const forceTalent = ref(false);

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const isEdit = computed(() => id.value !== undefined);
    const activations = computed(() =>
    {
        return Object.keys(activationEnum)
            .map((value) =>
            {
                const text = activationEnum[value];
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
            trees.value = talent.trees ?? '';
            tier.value = (talent as { tier ?: BoundedRange<1, 5> }).tier ?? (1 as BoundedRange<1, 5>);
            reference.value = normalizeReference(talent.reference);
            ranked.value = talent.ranked;
            forceTalent.value = talent.forceTalent ?? false;
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
            forceTalent.value = false;
        }

        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    async function onSave() : Promise<void>
    {
        if(isEdit.value)
        {
            const talent = await supplementStore.update<EoteTalent>(mode.value, 'talent', {
                id: id.value,
                name: name.value,
                description: description.value,
                activation: (activation.value || 'p') as TalentActivation,
                trees: trees.value,
                tier: tier.value,
                ranked: ranked.value,
                forceTalent: forceTalent.value,
                reference: reference.value,
                official: false,
            });

            emit('edit', talent);
        }
        else
        {
            const talent = await supplementStore.add<EoteTalent>(mode.value, 'talent', {
                name: name.value,
                description: description.value,
                activation: (activation.value || 'p') as TalentActivation,
                trees: trees.value,
                tier: tier.value,
                ranked: ranked.value,
                forceTalent: forceTalent.value,
                reference: reference.value,
                official: false,
            });

            emit('add', talent);
        }
    }

    function onCancel() : void
    {
        id.value = undefined;
        name.value = '';
        description.value = '';
        activation.value = '';
        trees.value = '';
        tier.value = 1 as BoundedRange<1, 5>;
        reference.value = '';
        ranked.value = false;
        forceTalent.value = false;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
