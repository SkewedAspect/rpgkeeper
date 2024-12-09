<!----------------------------------------------------------------------------------------------------------------------
  -- EditForcePowersModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-force-powers-modal">
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
                    Edit Force Powers
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div :class="`${ mode }-system`">
                <SupplementSelect
                    ref="suppSelect"
                    label="Force Powers"
                    label-class="fw-bold"
                    :available="forcePowers"
                    :selected="selectedForcePowers"
                    @add="onForcePowerAdd"
                    @remove="onForcePowerRemove"
                    @new="onForcePowerNew"
                    @edit="onForcePowerEdit"
                    @delete="onForcePowerDelete"
                >
                    <template #preview="{ instance, supplement }">
                        <div class="clearfix mb-3">
                            <MarkdownBlock :text="supplement.description" inline />
                        </div>
                        <h5>Upgrades</h5>
                        <BTable
                            class="font-sm"
                            :items="getUpgrades(instance, supplement)"
                            :fields="upgradeFields"
                            thead-class="d-none"
                            small
                            show-empty
                        >
                            <template #empty>
                                <div class="text-center">
                                    <i>No Upgrades</i>
                                </div>
                            </template>

                            <template #cell(name)="data">
                                <b>{{ sentenceCase(data.value) }}</b>
                                <DicePool
                                    v-model:current="data.item.purchased"
                                    :max="supplement.upgrades[data.value].available || 1"
                                    size="1x"
                                    no-edit
                                    no-auto-save
                                    @update:current="onUpgradeModify(data, instance)"
                                />
                            </template>
                            <template #cell(description)="data">
                                <MarkdownBlock :text="data.value" inline />
                            </template>
                        </BTable>
                        <ReferenceBlock
                            class="float-end mt-2"
                            :reference="supplement.reference"
                        />
                    </template>
                </SupplementSelect>
            </div>

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

        <!-- Modals -->
        <AddEditForcePowersModal
            ref="addEditForcePowersModal"
            @add="onForcePowerAdd"
            @edit="onForcePowerEdit"
        />
        <DeleteModal
            ref="delForcePowersModal"
            :name="delForcePower.name"
            type="forcePower"
            @hidden="onDelForcePowerHidden"
            @delete="onDelForcePowerDelete"
        />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    td.upgrade-name {
        min-width: 80px;
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import {
        EoteCharacter,
        EoteForcePower,
        EoteForcePowerInst, EoteForcePowerUpgrade,
        EoteTalentInst,
    } from '../../../../../common/interfaces/systems/eote';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import DicePool from '../../../character/dicePool.vue';
    import SupplementSelect from '../../../character/supplementSelect.vue';
    import DeleteModal from '../../../ui/deleteModal.vue';
    import MarkdownBlock from '../../../ui/markdownBlock.vue';
    import ReferenceBlock from '../../../character/referenceBlock.vue';
    import AddEditForcePowersModal from './addEditForcePowersModal.vue';
    import { BModal } from 'bootstrap-vue-next';

    // Utils
    import { startCase, uniqBy } from '../../../../lib/utils/misc';
    import CloseButton from '../../../ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface UpgradeInst
    {
        available ?: number;
        description : string;
        index ?: number;
        purchased : 0 | 1;
        name : string;
    }

    type Events = (e : 'save', talents : EoteTalentInst[]) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const upgradeFields = ref([
        { key: 'name', tdClass: 'upgrade-name' },
        { key: 'description' },
    ]);

    const selectedForcePowers = ref([]);

    const delForcePower = ref<{ id ?: number, name ?: string }>({
        id: undefined,
        name: undefined,
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);
    const addEditForcePowersModal = ref<InstanceType<typeof AddEditForcePowersModal> | null>(null);
    const delForcePowersModal = ref<InstanceType<typeof DeleteModal> | null>(null);
    const suppSelect = ref<InstanceType<typeof SupplementSelect> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => eoteMan.mode);
    const forcePowers = computed(() => eoteMan.forcePowers);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(character : EoteCharacter) : void
    {
        selectedForcePowers.value = character.details.force.powers;
        innerModal.value.show();
    }

    function hide() : void
    {
        selectedForcePowers.value = [];
        innerModal.value.hide();
    }

    function onSave() : void
    {
        emit('save', selectedForcePowers.value);
    }

    function onForcePowerAdd(forcePower : EoteForcePowerInst) : void
    {
        const newForcePower = {
            id: forcePower.id,
            upgrades: { strength: 0, magnitude: 0, duration: 0, range: 0, control: [], mastery: 0 },
        };

        selectedForcePowers.value.push(newForcePower);
        selectedForcePowers.value = uniqBy(selectedForcePowers.value, 'id');
    }

    function onForcePowerRemove(forcePower : EoteForcePowerInst) : void
    {
        selectedForcePowers.value = selectedForcePowers.value.filter((item) => item.id !== forcePower.id);
    }

    function onForcePowerNew() : void
    {
        addEditForcePowersModal.value.show();
    }

    function onForcePowerEdit(forcePower : EoteForcePower) : void
    {
        addEditForcePowersModal.value.show(forcePower);
    }

    function onForcePowerDelete(forcePower : EoteForcePower) : void
    {
        delForcePower.value.id = forcePower.id;
        delForcePower.value.name = forcePower.name;

        delForcePowersModal.value.show();
    }

    function onDelForcePowerHidden() : void
    {
        delForcePower.value.id = undefined;
        delForcePower.value.name = '';
    }

    async function onDelForcePowerDelete() : Promise<void>
    {
        suppSelect.value.clearSelection();
        selectedForcePowers.value = selectedForcePowers.value.filter((item) => item.id !== delForcePower.value.id);

        await eoteMan.delSup('forcepowers', { id: `${ delForcePower.value.id }` });

        onSave();
    }

    function onUpgradeModify(
        { item, value } : { item : UpgradeInst, value : string },
        instance : EoteForcePowerInst
    ) : void
    {
        // Are we an array'd upgrade, or not?
        if(item.index === undefined)
        {
            // Simple upgrade case, just update the instance
            instance.upgrades[value] = item.purchased;
        }
        else
        {
            // More complicated, we have to mess with the purchased array
            let purchased = instance.upgrades[value];
            if(item.purchased)
            {
                // We add `item.index` to the list of purchased upgrades
                purchased.push(item.index);
            }
            else
            {
                // We have to remove `item.index` from the list of purchased upgrades
                purchased = purchased.filter((instIdx) => instIdx !== item.index);
            }

            instance.upgrades[value] = purchased;
        }
    }

    function getUpgrades(instance : EoteForcePowerInst, supplement : EoteForcePower) : UpgradeInst[]
    {
        return Object.keys(supplement.upgrades).reduce((upgrades : UpgradeInst[], name) =>
        {
            const upgrade : (EoteForcePowerUpgrade | { description : string }[]) = supplement.upgrades[name];
            const upgradeInst : number | number[] = instance.upgrades[name];

            if(Array.isArray(upgrade) && Array.isArray(upgradeInst))
            {
                // If it's an array (i.e. `control`) we just add them as individual upgrades, all with the same
                // name. This is find, because we don't assume the name is unique. Also, we add the `index`
                // property, because that tells us which control item we've purchased.
                upgrades = upgrades.concat(upgrade.map((up, index) =>
                {
                    const purchased = upgradeInst.includes(index) ? 1 : 0;
                    return {
                        ...up,
                        name,
                        index,
                        purchased,
                    };
                }));
            }
            else
            {
                // In the simple case, we just push the upgrade with the name.
                upgrades.push({ ...(upgrade as EoteForcePowerUpgrade), name, purchased: (upgradeInst as 0 | 1) });
            }

            return upgrades;
        }, []);
    }

    function sentenceCase(text) : string
    {
        return startCase(text);
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
