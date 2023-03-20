<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditTalentModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-talent-modal">
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
                Talent
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
                    <b-form-checkbox v-model="ranked" class="mt-3" name="ranked-check" switch>
                        <b>Ranked</b>
                    </b-form-checkbox>
                </b-col>
            </b-form-row>
            <b-form-row>
                <b-col>
                    <b-form-group
                        label="Activation"
                        label-class="font-weight-bold"
                        label-for="activation-input"
                    >
                        <b-form-select
                            id="activation-input"
                            v-model="activation"
                            :options="activations"
                        ></b-form-select>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group
                        v-if="mode === 'eote'"
                        label="Trees"
                        label-class="font-weight-bold"
                        label-for="trees-input"
                    >
                        <b-form-input id="trees-input" v-model="trees" autocomplete="off"></b-form-input>
                    </b-form-group>
                    <b-form-group
                        v-else
                        label="Tiers"
                        label-class="font-weight-bold"
                        label-for="tiers-input"
                    >
                        <b-form-input
                            id="tiers-input"
                            v-model="tier"
                            number
                            type="number"
                            step="1"
                            min="1"
                            max="5"
                            autocomplete="off"
                        ></b-form-input>
                    </b-form-group>
                </b-col>
            </b-form-row>

            <b-form-group
                id="extras-input-group"
                label="Description"
                label-class="font-weight-bold"
                label-for="extras-input"
            >
                <MarkdownEditor v-model:text="description" height="250px"></MarkdownEditor>
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
    import {
        EoteOrGenesysTalent,
        EoteTalent
    } from '../../../../../common/interfaces/systems/eote';

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
        (e : 'add', talent : EoteTalent) : void;
        (e : 'edit', talent : EoteTalent) : void;
    }

    const emit = defineEmits<Events>();

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
                    value
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
                official: false
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
                official: false
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
