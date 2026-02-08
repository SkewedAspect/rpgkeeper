<!----------------------------------------------------------------------------------------------------------------------
  -- Edit Skills Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BModal
        id="edit-skills-modal"
        ref="modal"
        size="xl"
        header-bg-variant="dark"
        header-text-variant="white"
        no-close-on-backdrop
        no-close-on-esc
        @ok="onSave"
        @cancel="onCancel"
    >
        <template #header>
            <h5 class="mb-0">
                <Fa icon="scroll" />
                Edit Skills
            </h5>
        </template>

        <div v-if="localSkills" class="skills-edit-grid">
            <div v-for="(skill, index) in localSkills" :key="index" class="skill-row">
                <label class="skill-name">{{ skill.name }}</label>
                <BFormInput
                    v-model.number="skill.value"
                    type="number"
                    min="0"
                    max="100"
                    size="sm"
                    :disabled="skill.characteristic !== undefined"
                    class="skill-value"
                />
                <span v-if="skill.characteristic" class="text-muted small">
                    (Auto: {{ getCharValue(skill.characteristic, skill.half) }})
                </span>
            </div>
        </div>
    </BModal>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .skills-edit-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.5rem;
        max-height: 500px;
        overflow-y: auto;
    }

    .skill-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 0.5rem;
        align-items: center;
    }

    .skill-name {
        margin: 0;
        font-weight: 500;
    }

    .skill-value {
        max-width: 100px;
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { ref } from 'vue';
    import type { BModal } from 'bootstrap-vue-next';

    // Models
    import type { Character } from '@rpgk/core';
    import type { CoCSkill, CoCSystemDetails, CoCCharacteristicName } from '../../../models.ts';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'save', skills : CoCSkill[]) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const modal = ref<InstanceType<typeof BModal> | null>(null);
    const localSkills = ref<CoCSkill[] | null>(null);
    const character = ref<Character<CoCSystemDetails> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(char : Character<CoCSystemDetails>) : void
    {
        character.value = char;
        // Deep copy to avoid mutating the original until save
        localSkills.value = JSON.parse(JSON.stringify(char.details.skills));
        modal.value?.show();
    }

    function onSave() : void
    {
        if(localSkills.value)
        {
            emit('save', localSkills.value);
        }
    }

    function onCancel() : void
    {
        localSkills.value = null;
        character.value = null;
    }

    function getCharValue(charName : CoCCharacteristicName, half ?: boolean) : number
    {
        if(!character.value)
        {
            return 0;
        }

        const value = character.value.details.characteristics[charName];
        return half ? Math.floor(value / 2) : value;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
