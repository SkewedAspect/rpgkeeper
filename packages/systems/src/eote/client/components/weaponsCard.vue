<!----------------------------------------------------------------------------------------------------------------------
  -- Weapons Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-weapons-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" :icon="mode === 'eote' ? 'sword-laser-alt' : 'sword'" />
                    <span class="d-none d-md-inline">Weapons</span>
                </h5>
                <div v-if="!readonly" class="ms-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openAddEditModal()">
                        <Fa icon="plus" fixed-width />
                        <span class="d-none d-md-inline">Add</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <BTable
            v-if="weapons.length > 0"
            class="font-sm mb-0"
            :items="weapons"
            :fields="fields"
            small
            hover
            @row-clicked="onRowClicked"
        >
            <!-- Qualities Slot -->
            <template #cell(qualities)="data">
                <QualityTag
                    v-for="quality in (data.value as EoteQualityRef[])"
                    :id="quality.id"
                    :key="quality.id"
                    :ranks="quality.ranks"
                />
            </template>

            <!-- Buttons Slot -->
            <template #cell(buttons)="data">
                <BButton size="sm" @click="openAddEditModal(data.item)">
                    <Fa icon="edit" />
                </BButton>
                <BButton class="ms-1" variant="danger" size="sm" @click="openDeleteModal(data.item)">
                    <Fa icon="trash-alt" />
                </BButton>
            </template>
        </BTable>

        <!-- Empty -->
        <h5 v-else class="mt-2 text-center">
            No weapons
        </h5>

        <!-- Edit Modal -->
        <EditWeaponsModal ref="editWeaponsModal" @add="onAdd" @edit="onEdit" />

        <!-- Delete Modal -->
        <DeleteModal
            ref="delModal"
            :name="delWeapon?.name"
            type="weapon"
            @hidden="onDelModalHidden"
            @delete="onDelWeaponDelete"
        />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #eote-weapons-block {
        .table tr td {
            cursor: pointer;
        }

        .table tr td {
            vertical-align: middle !important;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { EoteCharacter, EoteQualityRef, EoteWeaponRef } from '../../models.ts';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';

    // Constants
    import { rangeEnum } from '../constants';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import QualityTag from './sub/qualityTag.vue';
    import DeleteModal from '@client/components/ui/deleteModal.vue';
    import EditWeaponsModal from './modals/editWeaponsModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        readonly : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'roll', dice : { ability : number, proficiency : number }, name : string) : void
        (e : 'save') : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharacterStore());
    const systemStore = useSystemStore();

    interface FieldDef
    {
        key : string;
        headerTitle ?: string;
        label ?: string;
        tdClass ?: string;
        thStyle ?: string;
        formatter ?: (value : unknown) => string;
    }

    const delWeapon = ref<EoteWeaponRef | undefined>(undefined);
    const fields = ref<FieldDef[]>([
        { key: 'name', headerTitle: 'Weapon name' },
        { key: 'skill', headerTitle: 'Required Skill', tdClass: 'text-nowrap' },
        { key: 'damage', label: 'Dmg.', headerTitle: 'Weapon Damage', tdClass: 'text-center' },
        { key: 'criticalRating', label: 'Crit.', headerTitle: 'Weapon Critical rating', tdClass: 'text-center' },
        {
            key: 'range',
            formatter(range : unknown)
            {
                return rangeEnum[range as string];
            },
            tdClass: 'text-center',
        },
        { key: 'encumbrance', label: 'Enc.', headerTitle: 'Weapon Encumbrance', tdClass: 'text-center' },
        { key: 'rarity', label: 'Rar.', headerTitle: 'Weapon Rarity', tdClass: 'text-center' },
        { key: 'qualities', label: 'Special', headerTitle: 'Weapon Qualities' },
        { key: 'buttons', label: '', thStyle: 'min-width: 80px' },

        /* TODO: Add in weapon modification support. */
    ]);

    const editWeaponsModal = ref<InstanceType<typeof EditWeaponsModal> | null>(null);
    const delModal = ref<InstanceType<typeof DeleteModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<EoteCharacter>(() => current.value as any);
    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const readonly = computed(() => props.readonly);

    const weapons = computed(() => char.value.details.weapons);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    async function removeWeapon(weapon : EoteWeaponRef) : Promise<void>
    {
        const index = char.value.details.weapons.indexOf(weapon);
        if(index !== -1)
        {
            // Remove the weapon
            char.value.details.weapons.splice(index, 1);

            emit('save');
        }
    }

    function onRowClicked(item : EoteWeaponRef) : void
    {
        const skill = char.value.details.skills.find((skillItem) => skillItem.name === item.skill);
        if(skill)
        {
            const dice = { ability: 0, proficiency: 0 };
            const charCount = char.value.details.characteristics[skill.characteristic];
            const rankCount = skill.ranks;

            if(charCount > rankCount)
            {
                dice.ability = charCount - rankCount;
                dice.proficiency = rankCount;
            }
            else
            {
                dice.ability = rankCount - charCount;
                dice.proficiency = charCount;
            }

            emit('roll', dice, item.name);
        }
        else
        {
            console.warn('Failed to find weapon skill:', item.skill);
        }
    }

    function onDelModalHidden() : void
    {
        delWeapon.value = undefined;
    }

    function onDelWeaponDelete() : void
    {
        removeWeapon(delWeapon.value);
    }

    function onAdd(weapon : EoteWeaponRef) : void
    {
        char.value.details.weapons.push(weapon);

        emit('save');
    }

    function onEdit(weapon : EoteWeaponRef, index : number) : void
    {
        if(index !== -1)
        {
            // Remove the weapon
            char.value.details.weapons.splice(index, 1, weapon);

            emit('save');
        }
    }

    function openAddEditModal(weapon ?: EoteWeaponRef) : void
    {
        if(weapon)
        {
            const index = char.value.details.weapons.indexOf(weapon);
            editWeaponsModal.value?.show(weapon, index);
        }
        else
        {
            editWeaponsModal.value?.show();
        }
    }

    function openDeleteModal(weapon : EoteWeaponRef) : void
    {
        delWeapon.value = weapon;
        delModal.value?.show();
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
