<!----------------------------------------------------------------------------------------------------------------------
  -- forcePowerCard
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BCard v-if="power && powerBase" class="eote-force-power-card" no-body>
        <template #header>
            <div :class="{ closed: !visible, open: visible }" @click="visible = !visible">
                <b>{{ powerBase?.name ?? 'Unknown' }}</b>
                <Fa class="text-muted mt-1 fa-pull-right collapse-icon" icon="chevron-right" />
            </div>
        </template>
        <BCollapse id="`force-power-${ forcePower.id }`" v-model="visible" :class="`${ mode }-system m-2`">
            <MarkdownBlock class="font-xs" :text="powerBase?.description" inline />
            <BTableLite
                class="font-xs mt-3 mb-0"
                :items="upgrades"
                :fields="upgradeFields"
                thead-class="d-none"
                small
            >
                <template #cell(name)="data">
                    <b>
                        {{ sentenceCase(data.value) }}
                        <span v-if="data.item.purchased > 1">({{ data.item.purchased }})</span>
                    </b>
                </template>
                <template #cell(description)="data">
                    <MarkdownBlock :text="data.value" inline />
                </template>
            </BTableLite>
            <div class="clearfix">
                <ReferenceBlock class="float-end mt-2" :reference="powerBase?.reference" />
            </div>
        </BCollapse>
    </BCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .eote-force-power-card {
        .card-header {
            border-bottom: none;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
        }

        .collapse-icon {
            transition: transform 0.25s ease-in-out;
        }

        .open > .collapse-icon {
            transform: rotate(90deg);
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import { EoteForcePower, EoteForcePowerInst } from '../../../../../common/interfaces/systems/eote';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import MarkdownBlock from '../../../ui/markdownBlock.vue';
    import ReferenceBlock from '../../../character/referenceBlock.vue';

    // Utils
    import { startCase } from '../../../../lib/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        power : EoteForcePowerInst;
        readonly : boolean;
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const visible = ref(false);
    const upgradeFields = ref([
        { key: 'name', class: 'text-nowrap' },
        { key: 'description' },
    ]);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => eoteMan.mode);
    const readonly = computed(() => props.readonly);

    const powerBase = computed<EoteForcePower | undefined>(() =>
    {
        if(props.power && props.power.id)
        {
            return eoteMan.forcePowers.find((forcePower) => forcePower.id === props.power.id);
        }

        return undefined;
    });

    const upgrades = computed(() =>
    {
        const populatedUpgrades = Object.keys(powerBase.value.upgrades).reduce((upgradeList, name) =>
        {
            const upgrade = powerBase.value.upgrades[name];
            const upgradeInst = props.power.upgrades[name];

            if(Array.isArray(upgrade))
            {
                // If it's an array (i.e. `control`) we just add them as individual upgrades, all with the same
                // name. This is find, because we don't assume the name is unique. Also, we add the `index`
                // property, because that tells us which control item we've purchased.
                upgradeList = upgradeList.concat(upgrade.map((up, index) =>
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
                upgradeList.push({ ...upgrade, name, purchased: upgradeInst });
            }

            return upgradeList;
        }, []);

        return populatedUpgrades.filter((upgrade) => upgrade.purchased > 0);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function sentenceCase(text) : string
    {
        return startCase(text);
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
