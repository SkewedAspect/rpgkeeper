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
            size="xl"
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
                            v-if="instance"
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
                                <b>{{ sentenceCase(data.value as string) }}</b>
                                <DicePool
                                    v-model:current="data.item.purchased"
                                    :max="getUpgradeMax(supplement, data.value as string)"
                                    size="1x"
                                    no-edit
                                    no-auto-save
                                    @update:current="onUpgradeModify(
                                        { item: data.item, value: data.value as string },
                                        instance
                                    )"
                                />
                            </template>
                            <template #cell(description)="data">
                                <MarkdownBlock :text="data.value as string" inline />
                            </template>
                        </BTable>
                        <ReferenceBlock
                            class="float-end mt-2"
                            :reference="supplement.reference ?? ''"
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
    import { computed, ref, useTemplateRef } from 'vue';

    // Models
    import type {
        EoteCharacter,
        EoteForcePower,
        EoteForcePowerInst,
        EoteForcePowerUpgrade } from '../../../models.ts';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import DicePool from '@client/components/character/dicePool.vue';
    import SupplementSelect from '@client/components/character/supplementSelect.vue';
    import DeleteModal from '@client/components/ui/deleteModal.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import ReferenceBlock from '@client/components/character/referenceBlock.vue';
    import AddEditForcePowersModal from './addEditForcePowersModal.vue';
    import { BModal } from 'bootstrap-vue-next';

    // Utils
    import { startCase, uniqBy } from '@client/lib/utils/misc';
    import CloseButton from '@client/components/ui/closeButton.vue';

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

    type Events = (e : 'save', powers : EoteForcePowerInst[]) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const upgradeFields = ref<{ key : string; tdClass ?: string }[]>([
        { key: 'name', tdClass: 'upgrade-name' },
        { key: 'description' },
    ]);

    const selectedForcePowers = ref<EoteForcePowerInst[]>([]);

    const delForcePower = ref<{ id ?: string, name ?: string }>({
        id: undefined,
        name: undefined,
    });

    const innerModal = useTemplateRef('innerModal');
    const addEditForcePowersModal = useTemplateRef('addEditForcePowersModal');
    const delForcePowersModal = useTemplateRef('delForcePowersModal');
    const suppSelect = useTemplateRef('suppSelect');

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const forcePowers = computed(() => supplementStore.get<EoteForcePower>(mode.value, 'forcepower'));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(character : EoteCharacter) : void
    {
        selectedForcePowers.value = character.details.force.powers;
        innerModal.value?.show();
    }

    function hide() : void
    {
        selectedForcePowers.value = [];
        innerModal.value?.hide();
    }

    function onSave() : void
    {
        emit('save', selectedForcePowers.value);
    }

    function onForcePowerAdd(forcePower : { id ?: string }) : void
    {
        if(!forcePower.id) { return; }

        const newForcePower : EoteForcePowerInst = {
            id: forcePower.id,
            upgrades: { strength: 0, magnitude: 0, duration: 0, range: 0, control: [], mastery: 0 },
        };

        selectedForcePowers.value.push(newForcePower);
        selectedForcePowers.value = uniqBy(selectedForcePowers.value, 'id');
    }

    function onForcePowerRemove(forcePower : { id ?: string }) : void
    {
        if(!forcePower.id) { return; }
        selectedForcePowers.value = selectedForcePowers.value.filter((item) => item.id !== forcePower.id);
    }

    function onForcePowerNew() : void
    {
        addEditForcePowersModal.value?.show();
    }

    function onForcePowerEdit(forcePower : EoteForcePower) : void
    {
        addEditForcePowersModal.value?.show(forcePower);
    }

    function onForcePowerDelete(forcePower : EoteForcePower) : void
    {
        delForcePower.value.id = forcePower.id;
        delForcePower.value.name = forcePower.name;

        delForcePowersModal.value?.show();
    }

    function onDelForcePowerHidden() : void
    {
        delForcePower.value.id = undefined;
        delForcePower.value.name = '';
    }

    async function onDelForcePowerDelete() : Promise<void>
    {
        suppSelect.value?.clearSelection();
        selectedForcePowers.value = selectedForcePowers.value.filter((item) => item.id !== delForcePower.value.id);

        if(delForcePower.value.id)
        {
            await supplementStore.remove(mode.value, 'forcepower', delForcePower.value.id);
        }

        onSave();
    }

    function onUpgradeModify(
        { item, value } : { item : UpgradeInst, value : string },
        instance : EoteForcePowerInst
    ) : void
    {
        const instUpgrades = instance.upgrades as Record<string, number | number[]>;

        // Are we an array'd upgrade, or not?
        if(item.index === undefined)
        {
            // Simple upgrade case, just update the instance
            instUpgrades[value] = item.purchased;
        }
        else
        {
            // More complicated, we have to mess with the purchased array
            let purchased = instUpgrades[value] as number[];
            if(item.purchased)
            {
                // We add `item.index` to the list of purchased upgrades
                purchased.push(item.index);
            }
            else
            {
                // We have to remove `item.index` from the list of purchased upgrades
                purchased = purchased.filter((instIdx : number) => instIdx !== item.index);
            }

            instUpgrades[value] = purchased;
        }
    }

    function getUpgrades(instance : EoteForcePowerInst, supplement : EoteForcePower) : UpgradeInst[]
    {
        const suppUpgrades = supplement.upgrades as Record<string, unknown>;
        const instUpgrades = instance.upgrades as Record<string, unknown>;

        return Object.keys(suppUpgrades).reduce((upgrades : UpgradeInst[], name) =>
        {
            const upgrade = suppUpgrades[name] as (EoteForcePowerUpgrade | { description : string }[]);
            const upgradeInst = instUpgrades[name] as number | number[];

            if(Array.isArray(upgrade) && Array.isArray(upgradeInst))
            {
                // If it's an array (i.e. `control`) we just add them as individual upgrades, all with the same
                // name. This is fine, because we don't assume the name is unique. Also, we add the `index`
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

    function sentenceCase(text : string) : string
    {
        return startCase(text);
    }

    function getUpgradeMax(supplement : EoteForcePower, upgradeName : string) : number
    {
        const upgrades = supplement.upgrades as Record<string, { available ?: number } | undefined>;
        return upgrades[upgradeName]?.available || 1;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
