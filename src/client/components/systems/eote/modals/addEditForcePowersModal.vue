<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditForcePowersModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-edit-forcepower-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xxl"
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
                ForcePowers
            </template>

            <!-- Modal Content -->
            <b-form-row>
                <b-col cols="6">
                    <b-form-row>
                        <b-col>
                            <b-form-group
                                label="Name"
                                label-class="font-weight-bold"
                                label-for="name-input"
                            >
                                <b-form-input
                                    id="name-input"
                                    v-model="name"
                                    autocomplete="off"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col style="max-width: 100px">
                            <b-form-group
                                label="Min Rating"
                                label-class="font-weight-bold text-nowrap"
                                label-for="min-rating-input"
                            >
                                <b-form-input
                                    id="min-rating-input"
                                    v-model="minRating"
                                    number
                                    type="number"
                                    min="0"
                                    step="1"
                                    autocomplete="off"
                                ></b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-form-row>

                    <b-form-group
                        id="description-input-group"
                        label="Description"
                        label-class="font-weight-bold"
                        label-for="extras-input"
                    >
                        <MarkdownEditor
                            v-model:text="description"
                            height="207px"
                        ></MarkdownEditor>
                    </b-form-group>

                    <ScopeSelect v-model:scope="scope" v-model:official="official"></ScopeSelect>

                    <EditReference v-model:reference="reference"></EditReference>
                </b-col>

                <b-col cols="6">
                    <b-form-group
                        id="strength-input-group"
                        label="Strength"
                        label-class="font-weight-bold"
                        label-for="extras-input"
                    >
                        <template #label>
                            Strength
                            <b-form-spinbutton
                                v-model="upgrades.strength.available"
                                class="pull-right"
                                min="0"
                                step="1"
                                size="sm"
                                style="margin-top: -8px"
                                inline
                            ></b-form-spinbutton>
                        </template>
                        <MarkdownEditor
                            v-if="upgrades.strength.available > 0"
                            v-model:text="upgrades.strength.description"
                            class="upgrade"
                            height="64.5px"
                        ></MarkdownEditor>
                        <b-card v-else class="overflow-hidden" no-body>
                            <i class="text-center d-inline message-margin">No Strength upgrades</i>
                        </b-card>
                    </b-form-group>
                    <b-form-group
                        id="magnitude-input-group"
                        label="Magnitude"
                        label-class="font-weight-bold"
                        label-for="extras-input"
                    >
                        <template #label>
                            Magnitude
                            <b-form-spinbutton
                                v-model="upgrades.magnitude.available"
                                class="pull-right"
                                min="0"
                                step="1"
                                size="sm"
                                style="margin-top: -8px"
                                inline
                            ></b-form-spinbutton>
                        </template>
                        <MarkdownEditor
                            v-if="upgrades.magnitude.available > 0"
                            v-model:text="upgrades.magnitude.description"
                            class="upgrade"
                            height="64.5px"
                        ></MarkdownEditor>
                        <b-card v-else class="overflow-hidden" no-body>
                            <i class="text-center d-inline message-margin">No Magnitude upgrades</i>
                        </b-card>
                    </b-form-group>
                    <b-form-group
                        id="duration-input-group"
                        label="Duration"
                        label-class="font-weight-bold"
                        label-for="extras-input"
                    >
                        <template #label>
                            Duration
                            <b-form-spinbutton
                                v-model="upgrades.duration.available"
                                class="pull-right"
                                min="0"
                                step="1"
                                size="sm"
                                style="margin-top: -8px"
                                inline
                            ></b-form-spinbutton>
                        </template>
                        <MarkdownEditor
                            v-if="upgrades.duration.available > 0"
                            v-model:text="upgrades.duration.description"
                            class="upgrade"
                            height="64.5px"
                        ></MarkdownEditor>
                        <b-card v-else class="overflow-hidden" no-body>
                            <i class="text-center d-inline message-margin">No Duration upgrades</i>
                        </b-card>
                    </b-form-group>
                    <b-form-group
                        id="range-input-group"
                        label="Range"
                        label-class="font-weight-bold"
                        label-for="extras-input"
                    >
                        <template #label>
                            Range
                            <b-form-spinbutton
                                v-model="upgrades.range.available"
                                class="pull-right"
                                min="0"
                                step="1"
                                size="sm"
                                style="margin-top: -8px"
                                inline
                            ></b-form-spinbutton>
                        </template>
                        <MarkdownEditor
                            v-if="upgrades.range.available > 0"
                            v-model:text="upgrades.range.description"
                            class="upgrade"
                            height="64.5px"
                        ></MarkdownEditor>
                        <b-card v-else class="overflow-hidden" no-body>
                            <i class="text-center d-inline message-margin">No Range upgrades</i>
                        </b-card>
                    </b-form-group>
                    <b-form-group
                        id="mastery-input-group"
                        label="Mastery"
                        label-class="font-weight-bold"
                        label-for="extras-input"
                    >
                        <template #label>
                            Mastery
                            <b-form-spinbutton
                                v-model="upgrades.mastery.available"
                                class="pull-right"
                                min="0"
                                step="1"
                                size="sm"
                                style="margin-top: -8px"
                                inline
                            ></b-form-spinbutton>
                        </template>
                        <MarkdownEditor
                            v-if="upgrades.mastery.available > 0"
                            v-model:text="upgrades.mastery.description"
                            class="upgrade"
                            height="64.5px"
                        ></MarkdownEditor>
                        <b-card v-else class="overflow-hidden" no-body>
                            <i class="text-center d-inline message-margin">No Mastery upgrades</i>
                        </b-card>
                    </b-form-group>
                    <b-form-group
                        id="control-input-group"
                        label="Control"
                        label-class="font-weight-bold"
                        label-for="extras-input"
                    >
                        <template #label>
                            Control
                            <b-form-spinbutton
                                v-model="controlAvailable"
                                class="pull-right"
                                min="0"
                                step="1"
                                size="sm"
                                style="margin-top: -8px"
                                inline
                            ></b-form-spinbutton>
                        </template>
                        <MarkdownEditor
                            v-for="(_, index) in upgrades.control"
                            :key="index"
                            v-model:text="upgrades.control[index].description"
                            class="upgrade mt-2"
                            height="64.5px"
                        ></MarkdownEditor>
                        <b-card v-if="upgrades.control.length < 1" class="overflow-hidden" no-body>
                            <i class="text-center d-inline message-margin">No Control upgrades</i>
                        </b-card>
                    </b-form-group>
                </b-col>
            </b-form-row>

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

<style lang="scss">
    .message-margin {
        margin: 0.4rem !important;
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import { EoteForcePower } from '../../../../../common/interfaces/systems/eote';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import EditReference from '../../../character/editReference.vue';
    import MarkdownEditor from '../../../ui/markdownEditor.vue';
    import ScopeSelect from '../../../character/scopeSelect.vue';
    import { BModal } from 'bootstrap-vue';

    // Utils
    import { deepClone } from '../../../../lib/utils';

    //------------------------------------------------------------------------------------------------------------------

    const defaultUpgrades = {
        strength: { available: 0, description: '' },
        magnitude: { available: 0, description: '' },
        duration: { available: 0, description: '' },
        range: { available: 0, description: '' },
        control: [],
        mastery: { available: 0, description: '' }
    };

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'add', power : EoteForcePower) : void;
        (e : 'edit', power : EoteForcePower) : void;
    }

    const emit = defineEmits<Events>();

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
        }
    });

    //------------------------------------------------------------------------------------------------------------------
    // Method
    //------------------------------------------------------------------------------------------------------------------

    function show(forcePower : EoteForcePower) : void
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
                ...forcePower.upgrades
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
            official: false
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

    function addControl()
    {
        upgrades.value.control.push({ description: '' });
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
