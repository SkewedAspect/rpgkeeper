<!----------------------------------------------------------------------------------------------------------------------
  -- EditWeaponsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-weapons-modal">
        <b-modal
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
            <template #modal-title>
                <span v-if="isAdd">
                    <fa icon="plus"></fa>
                    Add
                </span>
                <span v-else>
                    <fa icon="file-edit"></fa>
                    Edit
                </span>
                Weapons
            </template>

            <!-- Modal Content -->
            <div :class="`${ mode }-system`">
                <b-form-row>
                    <b-form-group
                        class="flex-fill pr-1 w-50"
                        label="Name"
                        label-class="font-weight-bold"
                        label-for="name-input"
                    >
                        <b-form-input
                            id="name-input"
                            v-model="editWeapon.name"
                            type="text"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        class="flex-fill pl-1 pr-1 w-25"
                        label="Skill"
                        label-class="font-weight-bold"
                        label-for="skill-input"
                    >
                        <b-form-select
                            id="skill-input"
                            v-model="editWeapon.skill"
                            :options="skillNames"
                        ></b-form-select>
                    </b-form-group>
                    <b-form-group
                        class="flex-fill pl-1 w-25"
                        label="Range"
                        label-class="font-weight-bold"
                        label-for="range-input"
                    >
                        <b-form-select
                            id="range-input"
                            v-model="editWeapon.range"
                            :options="rangeOptions"
                        ></b-form-select>
                    </b-form-group>
                </b-form-row>

                <b-form-row>
                    <b-form-group
                        class="flex-fill pr-1 w-25"
                        label="Damage"
                        label-class="font-weight-bold"
                        label-for="skill-damage"
                    >
                        <b-form-input
                            id="skill-damage"
                            v-model="editWeapon.damage"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        class="flex-fill pl-1 pr-1 w-25"
                        label="Critical"
                        label-class="font-weight-bold"
                        label-for="skill-critical"
                    >
                        <b-form-input
                            id="skill-critical"
                            v-model="editWeapon.criticalRating"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        class="flex-fill pl-1 pr-1 w-25"
                        label="Encumb."
                        label-class="font-weight-bold"
                        label-for="skill-encumbrance"
                    >
                        <b-form-input
                            id="skill-encumbrance"
                            v-model="editWeapon.encumbrance"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        class="flex-fill pl-1 w-25"
                        label="Rarity"
                        label-class="font-weight-bold"
                        label-for="skill-rarity"
                    >
                        <b-form-input
                            id="skill-rarity"
                            v-model="editWeapon.rarity"
                            number
                            type="number"
                            min="0"
                            step="0"
                        ></b-form-input>
                    </b-form-group>
                </b-form-row>

                <QualityEdit v-model:qualities="editWeapon.qualities"></QualityEdit>
            </div>

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
    import { BModal } from 'bootstrap-vue';

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
