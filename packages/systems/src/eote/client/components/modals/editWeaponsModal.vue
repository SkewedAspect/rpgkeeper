<!----------------------------------------------------------------------------------------------------------------------
  -- EditWeaponsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-weapons-modal">
        <BModal
            id="weapModal"
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            body-class="position-static"
            size="xl"
            @ok="onSave"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <span v-if="isAdd">
                        <Fa icon="plus" />
                        Add
                    </span>
                    <span v-else>
                        <Fa icon="file-edit" />
                        Edit
                    </span>
                    Weapons
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div :class="`${ mode }-system`">
                <BFormRow>
                    <BFormGroup
                        class="flex-fill pe-1 w-50"
                        label="Name"
                        label-class="fw-bold"
                        label-for="name-input"
                    >
                        <BFormInput
                            id="name-input"
                            v-model="editWeapon.name"
                            type="text"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1 w-25"
                        label="Skill"
                        label-class="fw-bold"
                        label-for="skill-input"
                    >
                        <BFormSelect
                            id="skill-input"
                            v-model="editWeapon.skill"
                            :options="skillNames"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 w-25"
                        label="Range"
                        label-class="fw-bold"
                        label-for="range-input"
                    >
                        <BFormSelect
                            id="range-input"
                            v-model="editWeapon.range"
                            :options="rangeOptions"
                        />
                    </BFormGroup>
                </BFormRow>

                <BFormRow>
                    <BFormGroup
                        class="flex-fill pe-1 w-25"
                        label="Damage"
                        label-class="fw-bold"
                        label-for="skill-damage"
                    >
                        <BFormInput
                            id="skill-damage"
                            v-model.number="editWeapon.damage"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1 w-25"
                        label="Critical"
                        label-class="fw-bold"
                        label-for="skill-critical"
                    >
                        <BFormInput
                            id="skill-critical"
                            v-model.number="editWeapon.criticalRating"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1 w-25"
                        label="Encumb."
                        label-class="fw-bold"
                        label-for="skill-encumbrance"
                    >
                        <BFormInput
                            id="skill-encumbrance"
                            v-model.number="editWeapon.encumbrance"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 w-25"
                        label="Rarity"
                        label-class="fw-bold"
                        label-for="skill-rarity"
                    >
                        <BFormInput
                            id="skill-rarity"
                            v-model.number="editWeapon.rarity"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                </BFormRow>

                <QualityEdit v-model:qualities="editWeapon.qualities" />
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
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #weapModal {
        .modal-content {
            overflow: initial !important;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Models
    import type {
        EncounterRange,
        EoteCharacter,
        EoteQuality,
        EoteQualityRef,
        EoteWeaponRef,
    } from '../../../models.ts';

    // Constants
    import { rangeEnum } from '../../constants';

    // Components
    import QualityEdit from '../sub/qualityEdit.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface SimpleWeapon
    {
        weaponID ?: number;
        name ?: string;
        skill ?: string;
        damage : number
        criticalRating : number;
        range : EncounterRange;
        encumbrance : number;
        rarity : number;
        qualities : EoteQualityRef[];
    }

    interface Events
    {
        (e : 'add', weapon : EoteWeaponRef) : void;
        (e : 'edit', weapon : EoteWeaponRef, index : number) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharacterStore());
    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    const weapIndex = ref(-1);
    const weapon = ref<EoteWeaponRef | undefined>(undefined);
    const editWeapon = ref<SimpleWeapon>({
        weaponID: undefined,
        name: undefined,
        skill: undefined,
        damage: 0,
        criticalRating: 0,
        range: 'm',
        encumbrance: 0,
        rarity: 0,
        qualities: [],
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<EoteCharacter>(() => current.value as any);
    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const qualities = computed(() => supplementStore.get<EoteQuality>(mode.value, 'quality'));

    const isAdd = computed(() => !weapon.value);
    const skillNames = computed(() => char.value.details.skills.map((skill) => skill.name).sort());
    const rangeOptions = computed(() =>
    {
        return Object.keys(rangeEnum).map((rng) =>
        {
            return {
                text: rangeEnum[rng],
                value: rng,
            };
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(newWeapon ?: EoteWeaponRef, index ?: number) : void
    {
        index = index ?? -1;

        if(newWeapon)
        {
            weapIndex.value = index;
            weapon.value = newWeapon;

            editWeapon.value = {
                weaponID: undefined,
                name: newWeapon.name,
                skill: newWeapon.skill,
                damage: newWeapon.damage,
                criticalRating: newWeapon.criticalRating,
                range: newWeapon.range,
                encumbrance: newWeapon.encumbrance,
                rarity: newWeapon.rarity,
                qualities: newWeapon.qualities,
            };
        }
        else
        {
            weapIndex.value = -1;
            weapon.value = undefined;
            editWeapon.value = {
                weaponID: undefined,
                name: undefined,
                skill: undefined,
                damage: 0,
                criticalRating: 0,
                range: 'm',
                encumbrance: 0,
                rarity: 0,
                qualities: [],
            };
        }

        innerModal.value.show();
    }

    function hide() : void
    {
        weapIndex.value = -1;
        weapon.value = undefined;
        editWeapon.value = {
            weaponID: undefined,
            name: undefined,
            skill: undefined,
            damage: 0,
            criticalRating: 0,
            range: 'm',
            encumbrance: 0,
            rarity: 0,
            qualities: [],
        };

        innerModal.value.hide();
    }

    async function onSave() : Promise<void>
    {
        if(isAdd.value)
        {
            const newWeap : EoteWeaponRef = {
                name: editWeapon.value.name ?? '',
                skill: editWeapon.value.skill ?? '',
                damage: editWeapon.value.damage,
                criticalRating: editWeapon.value.criticalRating,
                range: editWeapon.value.range,
                encumbrance: editWeapon.value.encumbrance,
                rarity: editWeapon.value.rarity,
                attachments: [],
                qualities: editWeapon.value.qualities,
            };

            emit('add', newWeap);
        }
        else if(weapon.value)
        {
            const newWeapon : EoteWeaponRef = {
                ...weapon.value,
                name: editWeapon.value.name ?? weapon.value.name,
                skill: editWeapon.value.skill ?? weapon.value.skill,
                damage: editWeapon.value.damage,
                criticalRating: editWeapon.value.criticalRating,
                range: editWeapon.value.range,
                encumbrance: editWeapon.value.encumbrance,
                rarity: editWeapon.value.rarity,
                qualities: editWeapon.value.qualities,
            };

            emit('edit', newWeapon, weapIndex.value);
        }
    }

    function onCancel() : void
    {
        weapIndex.value = -1;
        weapon.value = undefined;
        editWeapon.value = {
            weaponID: undefined,
            name: undefined,
            skill: undefined,
            damage: 0,
            criticalRating: 0,
            range: 'm',
            encumbrance: 0,
            rarity: 0,
            qualities: [],
        };
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
