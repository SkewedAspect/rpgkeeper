<!----------------------------------------------------------------------------------------------------------------------
  -- editWeaponsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-weapons-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xl"
            @ok="onSave"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    Edit Weapons
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div
                v-for="(weapon, index) in weapons"
                :key="index"
                class="d-flex align-items-center mb-2"
            >
                <BFormInput
                    v-model="weapon.name"
                    placeholder="Name"
                    class="me-2"
                />
                <BFormInput
                    v-model="weapon.damage"
                    placeholder="Damage"
                    class="me-2"
                    style="max-width: 120px;"
                />
                <BFormInput
                    v-model="weapon.range"
                    placeholder="Range"
                    class="me-2"
                    style="max-width: 120px;"
                />
                <BFormInput
                    v-model="weapon.attacks"
                    placeholder="Attacks"
                    class="me-2"
                    style="max-width: 80px;"
                />
                <BFormInput
                    v-model="weapon.skill"
                    placeholder="Skill"
                    class="me-2"
                />
                <BButton variant="danger" class="ms-2" @click="removeWeapon(weapon)">
                    <Fa icon="trash-alt" />
                </BButton>
            </div>

            <hr>

            <BCard
                header="New Weapon"
                header-bg-variant="dark"
                header-text-variant="white"
            >
                <div class="d-flex">
                    <BFormInput
                        v-model="newWeaponName"
                        placeholder="Name"
                        class="me-2"
                    />
                    <BFormInput
                        v-model="newWeaponDamage"
                        placeholder="Damage"
                        class="me-2"
                        style="max-width: 120px;"
                    />
                    <BFormInput
                        v-model="newWeaponRange"
                        placeholder="Range"
                        class="me-2"
                        style="max-width: 120px;"
                    />
                    <BFormInput
                        v-model="newWeaponSkill"
                        placeholder="Skill"
                        class="me-2"
                    />
                    <BFormInput
                        v-model="newWeaponAttacks"
                        placeholder="Attacks"
                        class="me-2"
                        style="max-width: 80px;"
                    />
                    <BButton variant="primary" class="text-nowrap" @click="addWeapon">
                        <Fa icon="plus" />
                        Add
                    </BButton>
                </div>
            </BCard>

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

<script lang="ts" setup>
    import { ref } from 'vue';

    // Models
    import type { Character } from '@rpgk/core';
    import type { CoCSystemDetails, CoCWeapon } from '../../../models.ts';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    type Events = (e : 'save', weapons : CoCWeapon[]) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const weapons = ref<CoCWeapon[]>([]);
    const newWeaponName = ref<string>('');
    const newWeaponDamage = ref<string>('1d3');
    const newWeaponRange = ref<string>('Touch');
    const newWeaponSkill = ref<string>('Fighting (Brawl)');
    const newWeaponAttacks = ref<string>('1');

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : Character<CoCSystemDetails>) : void
    {
        // Clone the array of weapons
        weapons.value = char.details.weapons.map((weapon) => ({ ...weapon }));

        // Show the modal
        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function onSave() : void
    {
        emit('save', weapons.value);
        weapons.value = [];
    }

    function onCancel() : void
    {
        weapons.value = [];
    }

    function addWeapon() : void
    {
        if(!newWeaponName.value.trim())
        {
            return;
        }

        weapons.value.push({
            name: newWeaponName.value.trim(),
            damage: newWeaponDamage.value,
            range: newWeaponRange.value,
            attacks: newWeaponAttacks.value,
            ammo: null,
            malfunction: null,
            skill: newWeaponSkill.value,
            notes: '',
            reference: '',
            official: false,
            owner: undefined,
            scope: 'user',
        } as CoCWeapon);

        newWeaponName.value = '';
        newWeaponDamage.value = '1d3';
        newWeaponRange.value = 'Touch';
        newWeaponSkill.value = 'Fighting (Brawl)';
        newWeaponAttacks.value = '1';
    }

    function removeWeapon(weapon : CoCWeapon) : void
    {
        const idx = weapons.value.findIndex((item) => item === weapon);
        if(idx > -1)
        {
            weapons.value.splice(idx, 1);
        }
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });

    //------------------------------------------------------------------------------------------------------------------
</script>

<!--------------------------------------------------------------------------------------------------------------------->
