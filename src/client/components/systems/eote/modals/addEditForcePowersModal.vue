<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditForcePowersModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-edit-forcepower-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xxl"
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
                    ForcePowers
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormRow>
                <BCol cols="6">
                    <BFormRow>
                        <BCol>
                            <BFormGroup
                                label="Name"
                                label-class="fw-bold"
                                label-for="name-input"
                            >
                                <BFormInput
                                    id="name-input"
                                    v-model="name"
                                    autocomplete="off"
                                />
                            </BFormGroup>
                        </BCol>
                        <BCol style="max-width: 100px">
                            <BFormGroup
                                label="Min Rating"
                                label-class="fw-bold text-nowrap"
                                label-for="min-rating-input"
                            >
                                <BFormInput
                                    id="min-rating-input"
                                    v-model.number="minRating"
                                    type="number"
                                    min="0"
                                    step="1"
                                    autocomplete="off"
                                />
                            </BFormGroup>
                        </BCol>
                    </BFormRow>

                    <BFormGroup
                        id="description-input-group"
                        label="Description"
                        label-class="fw-bold"
                        label-for="extras-input"
                    >
                        <MarkdownEditor
                            v-model:text="description"
                            height="207px"
                        />
                    </BFormGroup>

                    <ScopeSelect v-model:scope="scope" v-model:official="official" />

                    <EditReference v-model:reference="reference" />
                </BCol>

                <BCol cols="6">
                    <BFormGroup
                        id="strength-input-group"
                        label="Strength"
                        label-class="fw-bold"
                        label-for="extras-input"
                    >
                        <template #label>
                            Strength
                            <BFormSpinbutton
                                v-model="upgrades.strength.available"
                                class="pull-right"
                                min="0"
                                step="1"
                                size="sm"
                                style="margin-top: -8px"
                                inline
                            />
                        </template>
                        <MarkdownEditor
                            v-if="upgrades.strength.available > 0"
                            v-model:text="upgrades.strength.description"
                            class="upgrade"
                            height="64.5px"
                        />
                        <BCard v-else class="overflow-hidden" no-body>
                            <i class="text-center d-inline message-margin">No Strength upgrades</i>
                        </BCard>
                    </BFormGroup>
                    <BFormGroup
                        id="magnitude-input-group"
                        label="Magnitude"
                        label-class="fw-bold"
                        label-for="extras-input"
                    >
                        <template #label>
                            Magnitude
                            <BFormSpinbutton
                                v-model="upgrades.magnitude.available"
                                class="pull-right"
                                min="0"
                                step="1"
                                size="sm"
                                style="margin-top: -8px"
                                inline
                            />
                        </template>
                        <MarkdownEditor
                            v-if="upgrades.magnitude.available > 0"
                            v-model:text="upgrades.magnitude.description"
                            class="upgrade"
                            height="64.5px"
                        />
                        <BCard v-else class="overflow-hidden" no-body>
                            <i class="text-center d-inline message-margin">No Magnitude upgrades</i>
                        </BCard>
                    </BFormGroup>
                    <BFormGroup
                        id="duration-input-group"
                        label="Duration"
                        label-class="fw-bold"
                        label-for="extras-input"
                    >
                        <template #label>
                            Duration
                            <BFormSpinbutton
                                v-model="upgrades.duration.available"
                                class="pull-right"
                                min="0"
                                step="1"
                                size="sm"
                                style="margin-top: -8px"
                                inline
                            />
                        </template>
                        <MarkdownEditor
                            v-if="upgrades.duration.available > 0"
                            v-model:text="upgrades.duration.description"
                            class="upgrade"
                            height="64.5px"
                        />
                        <BCard v-else class="overflow-hidden" no-body>
                            <i class="text-center d-inline message-margin">No Duration upgrades</i>
                        </BCard>
                    </BFormGroup>
                    <BFormGroup
                        id="range-input-group"
                        label="Range"
                        label-class="fw-bold"
                        label-for="extras-input"
                    >
                        <template #label>
                            Range
                            <BFormSpinbutton
                                v-model="upgrades.range.available"
                                class="pull-right"
                                min="0"
                                step="1"
                                size="sm"
                                style="margin-top: -8px"
                                inline
                            />
                        </template>
                        <MarkdownEditor
                            v-if="upgrades.range.available > 0"
                            v-model:text="upgrades.range.description"
                            class="upgrade"
                            height="64.5px"
                        />
                        <BCard v-else class="overflow-hidden" no-body>
                            <i class="text-center d-inline message-margin">No Range upgrades</i>
                        </BCard>
                    </BFormGroup>
                    <BFormGroup
                        id="mastery-input-group"
                        label="Mastery"
                        label-class="fw-bold"
                        label-for="extras-input"
                    >
                        <template #label>
                            Mastery
                            <BFormSpinbutton
                                v-model="upgrades.mastery.available"
                                class="pull-right"
                                min="0"
                                step="1"
                                size="sm"
                                style="margin-top: -8px"
                                inline
                            />
                        </template>
                        <MarkdownEditor
                            v-if="upgrades.mastery.available > 0"
                            v-model:text="upgrades.mastery.description"
                            class="upgrade"
                            height="64.5px"
                        />
                        <BCard v-else class="overflow-hidden" no-body>
                            <i class="text-center d-inline message-margin">No Mastery upgrades</i>
                        </BCard>
                    </BFormGroup>
                    <BFormGroup
                        id="control-input-group"
                        label="Control"
                        label-class="fw-bold"
                        label-for="extras-input"
                    >
                        <template #label>
                            Control
                            <BFormSpinbutton
                                v-model="controlAvailable"
                                class="pull-right"
                                min="0"
                                step="1"
                                size="sm"
                                style="margin-top: -8px"
                                inline
                            />
                        </template>
                        <MarkdownEditor
                            v-for="(_, index) in upgrades.control"
                            :key="index"
                            v-model:text="upgrades.control[index].description"
                            class="upgrade mt-2"
                            height="64.5px"
                        />
                        <BCard v-if="upgrades.control.length < 1" class="overflow-hidden" no-body>
                            <i class="text-center d-inline message-margin">No Control upgrades</i>
                        </BCard>
                    </BFormGroup>
                </BCol>
            </BFormRow>

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

<style lang="scss">
    .message-margin {
        margin: 0.4rem !important;
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import { EoteForcePower, EoteQuality } from '@rpgk/core/models/systems';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import EditReference from '../../../character/editReference.vue';
    import MarkdownEditor from '../../../ui/markdownEditor.vue';
    import ScopeSelect from '../../../character/scopeSelect.vue';
    import { BModal } from 'bootstrap-vue-next';

    // Utils
    import { deepClone } from '../../../../lib/utils';
    import CloseButton from '../../../ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------

    const defaultUpgrades = {
        strength: { available: 0, description: '' },
        magnitude: { available: 0, description: '' },
        duration: { available: 0, description: '' },
        range: { available: 0, description: '' },
        control: [],
        mastery: { available: 0, description: '' },
    };

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    const emit = defineEmits<{
        add : [power: EoteForcePower]
        edit : [power: EoteForcePower]
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const id = ref<number>(undefined);
    const minRating = ref(0);
    const name = ref('');
    const description = ref('');
    const reference = ref('');
    const upgrades = ref(deepClone(defaultUpgrades));
    const scope = ref<'public' | 'user'>('user');
    const official = ref(false);

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isEdit = computed(() => id.value !== undefined);

    const controlAvailable = computed({
        get() { return upgrades.value.control.length; },
        set(val)
        {
            const currLength = upgrades.value.control.length;

            if(val > currLength)
            {
                for(let toAdd = 0; toAdd < (val - currLength); toAdd++)
                {
                    // eslint-disable-next-line no-use-before-define
                    addControl();
                }
            }
            else
            {
                upgrades.value.control.splice((currLength - val) * -1);
            }
        },
    });

    //------------------------------------------------------------------------------------------------------------------
    // Method
    //------------------------------------------------------------------------------------------------------------------

    function show(forcePower ?: EoteForcePower) : void
    {
        if(forcePower)
        {
            id.value = forcePower.id;
            name.value = forcePower.name;
            minRating.value = forcePower.minRating;
            description.value = forcePower.description;
            reference.value = forcePower.reference;
            upgrades.value = {
                ...deepClone(defaultUpgrades),
                ...forcePower.upgrades,
            };
        }
        else
        {
            id.value = undefined;
            name.value = '';
            minRating.value = 0;
            description.value = '';
            reference.value = '';
            upgrades.value = deepClone(defaultUpgrades);
        }

        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    async function onSave() : Promise<void>
    {
        const forcePowerDef : EoteForcePower = {
            id: undefined,
            name: this.name,
            minRating: this.minRating,
            description: this.description,
            reference: this.reference,
            upgrades: deepClone(this.upgrades),
            scope: undefined,
            official: false,
        };

        // Filter out upgrades
        if(forcePowerDef.upgrades.strength.available === 0)
        {
            forcePowerDef.upgrades.strength = undefined;
        }

        if(forcePowerDef.upgrades.magnitude.available === 0)
        {
            forcePowerDef.upgrades.magnitude = undefined;
        }

        if(forcePowerDef.upgrades.duration.available === 0)
        {
            forcePowerDef.upgrades.duration = undefined;
        }

        if(forcePowerDef.upgrades.range.available === 0)
        {
            forcePowerDef.upgrades.range = undefined;
        }

        if(forcePowerDef.upgrades.mastery.available === 0)
        {
            forcePowerDef.upgrades.mastery = undefined;
        }

        // Filter out blank control entries
        forcePowerDef.upgrades.control = forcePowerDef.upgrades.control
            .filter((control) => control.description && control.description.length > 0);

        if(isEdit.value)
        {
            forcePowerDef.id = id.value;
            const forcePower = await eoteMan.editSup('forcepowers', forcePowerDef);

            this.$emit('edit', forcePower);
        }
        else
        {
            const forcePower = await eoteMan.addSup('forcepowers', forcePowerDef);

            this.$emit('add', forcePower);
        }
    }

    function onCancel() : void
    {
        id.value = undefined;
        name.value = '';
        minRating.value = 0;
        description.value = '';
        reference.value = '';
        upgrades.value = deepClone(defaultUpgrades);
    }

    function addControl() : void
    {
        upgrades.value.control.push({ description: '' });
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
