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
                        <fa icon="plus"></fa>
                        Add
                    </span>
                    <span v-else>
                        <fa icon="file-edit"></fa>
                        Edit
                    </span>
                    Weapons
                    <CloseButton class="float-end" @click="cancel"></CloseButton>
                </h5>
            </template>

            <!-- Modal Content -->
            <div :class="`${ mode }-system`">
                <BFormRow>
                    <BFormCheckbox
                        class="flex-fill pe-1 w-50"
                        label="Name"
                        label-class="fw-bold"
                        label-for="name-input"
                    >
                        <BFormInput
                            id="name-input"
                            v-model="editWeapon.name"
                            type="text"
                        ></BFormInput>
                    </BFormCheckbox>
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
                        ></BFormSelect>
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
                        ></BFormSelect>
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
                            v-model="editWeapon.damage"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></BFormInput>
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1 w-25"
                        label="Critical"
                        label-class="fw-bold"
                        label-for="skill-critical"
                    >
                        <BFormInput
                            id="skill-critical"
                            v-model="editWeapon.criticalRating"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></BFormInput>
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1 w-25"
                        label="Encumb."
                        label-class="fw-bold"
                        label-for="skill-encumbrance"
                    >
                        <BFormInput
                            id="skill-encumbrance"
                            v-model="editWeapon.encumbrance"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></BFormInput>
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 w-25"
                        label="Rarity"
                        label-class="fw-bold"
                        label-for="skill-rarity"
                    >
                        <BFormInput
                            id="skill-rarity"
                            v-model="editWeapon.rarity"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></BFormInput>
                    </BFormGroup>
                </BFormRow>

                <QualityEdit v-model:qualities="editWeapon.qualities"></QualityEdit>
            </div>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <fa icon="save"></fa>
                    Save
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <fa icon="times"></fa>
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
    import { useCharactersStore } from '../../../../lib/stores/characters';

    // Models
    import {
        EncounterRange,
        EoteCharacter,
        EoteQualityRef,
        EoteWeapon
    } from '../../../../../common/interfaces/systems/eote';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import QualityEdit from '../components/qualityEdit.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '../../../ui/closeButton.vue';

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
        (e : 'add', weapon : EoteWeapon) : void;
        (e : 'edit', weapon : EoteWeapon, index : number) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharactersStore());

    const weapIndex = ref(-1);
    const weapon = ref<EoteWeapon>(undefined);
    const editWeapon = ref<SimpleWeapon>({
        weaponID: undefined,
        name: undefined,
        skill: undefined,
        damage: 0,
        criticalRating: 0,
        range: 'm',
        encumbrance: 0,
        rarity: 0,
        qualities: []
    });

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<EoteCharacter>(() => current.value as any);
    const mode = computed(() => eoteMan.mode);
    const qualities = computed(() => eoteMan.qualities);

    const isAdd = computed(() => !weapon.value);
    const skillNames = computed(() => char.value.details.skills.map((skill) => skill.name).sort());
    const rangeOptions = computed(() =>
    {
        return Object.keys(eoteMan.rangeEnum).map((rng) =>
        {
            return {
                text: eoteMan.rangeEnum[rng],
                value: rng
            };
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(newWeapon ?: EoteWeapon, index ?: number) : void
    {
        index = index ?? -1;

        if(newWeapon)
        {
            weapIndex.value = index;
            weapon.value = newWeapon;

            editWeapon.value = {
                weaponID: newWeapon.id,
                name: newWeapon.name,
                skill: newWeapon.skill,
                damage: newWeapon.damage,
                criticalRating: newWeapon.criticalRating,
                range: newWeapon.range,
                encumbrance: newWeapon.encumbrance,
                rarity: newWeapon.rarity,
                qualities: newWeapon.qualities
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
                qualities: []
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
            qualities: []
        };

        innerModal.value.hide();
    }

    async function onSave()
    {
        if(isAdd.value)
        {
            const newWeap : EoteWeapon = {
                criticalRating: editWeapon.value.criticalRating,
                damage: editWeapon.value.damage,
                description: undefined,
                encumbrance: editWeapon.value.encumbrance,
                name: editWeapon.value.name,
                qualities: editWeapon.value.qualities,
                range: editWeapon.value.range,
                rarity: editWeapon.value.rarity,
                skill: editWeapon.value.skill,
                official: false,
                reference: 'HB',
                scope: 'user'
            };

            emit('add', newWeap);
        }
        else
        {
            const newWeapon = {
                ...weapon.value,
                ...editWeapon.value
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
            qualities: []
        };
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
