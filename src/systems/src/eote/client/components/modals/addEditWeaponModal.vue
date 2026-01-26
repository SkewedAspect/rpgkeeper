<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditWeaponModal
  --
  -- Modal for creating or editing weapon supplements in the database.
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-weapon-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @hidden="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    <span v-if="isEdit">
                        Edit
                    </span>
                    <span v-else>
                        Add
                    </span>
                    Weapon
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormRow>
                <BCol cols="8">
                    <BFormGroup
                        label="Name"
                        label-class="fw-bold"
                        label-for="name-input"
                    >
                        <BFormInput id="name-input" v-model="name" autocomplete="off" />
                    </BFormGroup>
                </BCol>
                <BCol cols="4">
                    <BFormGroup
                        label="Skill"
                        label-class="fw-bold"
                        label-for="skill-input"
                    >
                        <BFormInput id="skill-input" v-model="skill" autocomplete="off" />
                    </BFormGroup>
                </BCol>
            </BFormRow>

            <BFormRow>
                <BCol cols="3">
                    <BFormGroup
                        label="Damage"
                        label-class="fw-bold"
                        label-for="damage-input"
                    >
                        <BFormInput
                            id="damage-input"
                            v-model.number="damage"
                            type="number"
                            min="0"
                            step="1"
                        />
                    </BFormGroup>
                </BCol>
                <BCol cols="3">
                    <BFormGroup
                        label="Critical"
                        label-class="fw-bold"
                        label-for="critical-input"
                    >
                        <BFormInput
                            id="critical-input"
                            v-model.number="criticalRating"
                            type="number"
                            min="0"
                            step="1"
                        />
                    </BFormGroup>
                </BCol>
                <BCol cols="3">
                    <BFormGroup
                        label="Range"
                        label-class="fw-bold"
                        label-for="range-input"
                    >
                        <BFormSelect
                            id="range-input"
                            v-model="range"
                            :options="rangeOptions"
                        />
                    </BFormGroup>
                </BCol>
                <BCol cols="3">
                    <BFormGroup
                        label="Encumb."
                        label-class="fw-bold"
                        label-for="encumbrance-input"
                    >
                        <BFormInput
                            id="encumbrance-input"
                            v-model.number="encumbrance"
                            type="number"
                            min="0"
                            step="1"
                        />
                    </BFormGroup>
                </BCol>
            </BFormRow>

            <BFormRow>
                <BCol cols="3">
                    <BFormGroup
                        label="Rarity"
                        label-class="fw-bold"
                        label-for="rarity-input"
                    >
                        <BFormInput
                            id="rarity-input"
                            v-model.number="rarity"
                            type="number"
                            min="0"
                            step="1"
                        />
                    </BFormGroup>
                </BCol>
            </BFormRow>

            <BFormGroup
                label="Description"
                label-class="fw-bold"
                label-for="description-input"
            >
                <MarkdownEditor v-model:text="description" height="150px" />
            </BFormGroup>

            <EditReference v-model:reference="reference" />

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
    import { computed, ref } from 'vue';

    // Models
    import type { EncounterRange, EoteWeapon } from '../../../models.ts';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Constants
    import { rangeEnum } from '../../constants';

    // Components
    import EditReference from '@client/components/character/editReference.vue';
    import MarkdownEditor from '@client/components/ui/markdownEditor.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    const emit = defineEmits<{
        add : [weapon : EoteWeapon]
        edit : [weapon : EoteWeapon]
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const id = ref<string | undefined>(undefined);
    const name = ref('');
    const skill = ref('');
    const damage = ref(0);
    const addSkill = ref(false);
    const criticalRating = ref(0);
    const range = ref<EncounterRange>('m');
    const encumbrance = ref(0);
    const hardpoints = ref(0);
    const rarity = ref(0);
    const restricted = ref(false);
    const description = ref('');
    const reference = ref('');

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const isEdit = computed(() => id.value !== undefined);

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

    function clearForm() : void
    {
        id.value = undefined;
        name.value = '';
        skill.value = '';
        damage.value = 0;
        addSkill.value = false;
        criticalRating.value = 0;
        range.value = 'm';
        encumbrance.value = 0;
        hardpoints.value = 0;
        rarity.value = 0;
        restricted.value = false;
        description.value = '';
        reference.value = '';
    }

    function show(weapon ?: EoteWeapon) : void
    {
        if(weapon)
        {
            id.value = weapon.id;
            name.value = weapon.name;
            skill.value = weapon.skill;
            damage.value = weapon.damage;
            addSkill.value = weapon.addSkill ?? false;
            criticalRating.value = weapon.criticalRating;
            range.value = weapon.range;
            encumbrance.value = weapon.encumbrance;
            hardpoints.value = weapon.hardpoints ?? 0;
            rarity.value = weapon.rarity;
            restricted.value = weapon.restricted ?? false;
            description.value = weapon.description;
            reference.value = Array.isArray(weapon.reference) ? weapon.reference[0] ?? '' : weapon.reference ?? '';
        }
        else
        {
            clearForm();
        }

        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    async function onSave() : Promise<void>
    {
        const weaponData = {
            name: name.value,
            skill: skill.value,
            damage: damage.value,
            addSkill: addSkill.value,
            criticalRating: criticalRating.value,
            range: range.value,
            encumbrance: encumbrance.value,
            hardpoints: hardpoints.value,
            rarity: rarity.value,
            restricted: restricted.value,
            description: description.value,
            reference: reference.value,
            qualities: [],
            official: false,
        };

        if(isEdit.value)
        {
            const weapon = await supplementStore.update<EoteWeapon>(mode.value, 'weapon', {
                id: id.value,
                ...weaponData,
            });

            emit('edit', weapon);
        }
        else
        {
            const weapon = await supplementStore.add<EoteWeapon>(mode.value, 'weapon', weaponData);
            emit('add', weapon);
        }
    }

    function onCancel() : void
    {
        clearForm();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
