<!----------------------------------------------------------------------------------------------------------------------
  -- Mod Option Editor
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BCard no-body class="mod-option-edit">
        <BCardHeader class="d-flex align-items-center p-2">
            <BButton
                variant="link"
                class="text-decoration-none p-0 flex-grow-1 text-start"
                @click="expanded = !expanded"
            >
                <Fa :icon="expanded ? 'chevron-down' : 'chevron-right'" fixed-width />
                <span class="fw-bold">{{ headerText }}</span>
            </BButton>
            <BButton v-if="removable" variant="link" size="sm" class="text-danger p-1" @click="onRemove">
                <Fa icon="trash-alt" />
            </BButton>
        </BCardHeader>
        <BCollapse v-model="expanded">
            <BCardBody class="p-3">
                <!-- Qualities -->
                <BFormGroup label="Qualities" label-class="fw-bold">
                    <div class="d-flex flex-wrap gap-2 mb-2">
                        <BBadge
                            v-for="(qual, idx) in editedValue.qualities"
                            :key="idx"
                            variant="secondary"
                            class="d-flex align-items-center gap-1"
                        >
                            <span>{{ getQualityName(qual.id) }}</span>
                            <span v-if="isQualityRanked(qual.id)">{{ qual.ranks ?? 1 }}</span>
                            <BButton
                                variant="link"
                                size="sm"
                                class="text-white p-0"
                                @click="removeQuality(idx)"
                            >
                                <Fa icon="times" />
                            </BButton>
                        </BBadge>
                    </div>
                    <div class="d-flex gap-2 align-items-center">
                        <BFormSelect
                            v-model="selectedQualityId"
                            :options="qualityOptions"
                            size="sm"
                            class="flex-grow-1"
                        >
                            <template #first>
                                <option :value="null">
                                    Select quality...
                                </option>
                            </template>
                        </BFormSelect>
                        <BFormSpinbutton
                            v-model="selectedQualityRanks"
                            :disabled="!selectedQualityId || !isQualityRanked(selectedQualityId)"
                            min="1"
                            step="1"
                            size="sm"
                            inline
                            style="width: 150px;"
                        />
                        <BButton
                            :disabled="!selectedQualityId"
                            variant="primary"
                            size="sm"
                            class="text-nowrap"
                            @click="addQuality"
                        >
                            <Fa icon="plus" />
                            Add
                        </BButton>
                    </div>
                </BFormGroup>

                <!-- Numeric Modifiers -->
                <BFormRow class="mt-2">
                    <BCol cols="6" md="4">
                        <BFormGroup label="Damage" label-class="fw-bold" label-for="damage-input">
                            <BFormInput
                                id="damage-input"
                                v-model.number="editedValue.damageModifier"
                                type="number"
                                size="sm"
                                placeholder="±"
                            />
                        </BFormGroup>
                    </BCol>
                    <BCol cols="6" md="4">
                        <BFormGroup label="Critical" label-class="fw-bold" label-for="critical-input">
                            <BFormInput
                                id="critical-input"
                                v-model.number="editedValue.criticalModifier"
                                type="number"
                                size="sm"
                                placeholder="±"
                            />
                        </BFormGroup>
                    </BCol>
                    <BCol cols="6" md="4">
                        <BFormGroup label="Encumbrance" label-class="fw-bold" label-for="encumbrance-input">
                            <BFormInput
                                id="encumbrance-input"
                                v-model.number="editedValue.encumbranceModifier"
                                type="number"
                                size="sm"
                                placeholder="±"
                            />
                        </BFormGroup>
                    </BCol>
                    <BCol v-if="useWith === 'armor'" cols="6" md="4" class="mt-2">
                        <BFormGroup label="Defense" label-class="fw-bold" label-for="defense-input">
                            <BFormInput
                                id="defense-input"
                                v-model.number="editedValue.defenseModifier"
                                type="number"
                                size="sm"
                                placeholder="±"
                            />
                        </BFormGroup>
                    </BCol>
                    <BCol v-if="useWith === 'armor'" cols="6" md="4" class="mt-2">
                        <BFormGroup label="Soak" label-class="fw-bold" label-for="soak-input">
                            <BFormInput
                                id="soak-input"
                                v-model.number="editedValue.soakModifier"
                                type="number"
                                size="sm"
                                placeholder="±"
                            />
                        </BFormGroup>
                    </BCol>
                </BFormRow>

                <!-- Description -->
                <BFormGroup
                    class="mt-2"
                    label="Additional Description"
                    label-class="fw-bold"
                    label-for="description-input"
                >
                    <BFormTextarea
                        id="description-input"
                        v-model="editedValue.description"
                        rows="2"
                        placeholder="Any additional effects not covered by the fields above..."
                    />
                </BFormGroup>
            </BCardBody>
        </BCollapse>
    </BCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, watch } from 'vue';

    // Models
    import type { BaseQuality, BaseQualityRef, EoteModOption } from '../../../models.ts';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        modelValue : EoteModOption;
        useWith ?: 'weapon' | 'armor' | 'any';
        label ?: string;
        removable ?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        useWith: 'weapon',
        label: 'Mod Option',
        removable: true,
    });

    const emit = defineEmits<{
        'update:modelValue' : [value : EoteModOption]
        'remove' : []
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const expanded = ref(true);
    const selectedQualityId = ref<string | null>(null);
    const selectedQualityRanks = ref(1);

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const allQualities = computed(() => supplementStore.get<BaseQuality>(mode.value, 'quality'));

    const editedValue = computed({
        get: () => props.modelValue,
        set: (val) => emit('update:modelValue', val),
    });

    const qualityOptions = computed(() =>
    {
        return allQualities.value.map((qual) => ({
            value: qual.id,
            text: qual.name,
        }));
    });

    const headerText = computed(() =>
    {
        if(props.label !== 'Mod Option')
        {
            return props.label;
        }

        // Build summary from structured fields
        const parts : string[] = [];

        if(editedValue.value.qualities?.length)
        {
            parts.push(`${ editedValue.value.qualities.length } quality/qualities`);
        }

        const modCount = [
            editedValue.value.damageModifier,
            editedValue.value.criticalModifier,
            editedValue.value.encumbranceModifier,
            editedValue.value.defenseModifier,
            editedValue.value.soakModifier,
        ].filter((val) => val !== undefined).length;

        if(modCount > 0)
        {
            parts.push(`${ modCount } modifier(s)`);
        }

        if(editedValue.value.description)
        {
            parts.push('custom description');
        }

        return parts.length > 0 ? parts.join(', ') : 'Empty mod option';
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function getQualityName(qualityId : string) : string
    {
        return allQualities.value.find((qual) => qual.id === qualityId)?.name ?? 'Unknown';
    }

    function isQualityRanked(qualityId : string) : boolean
    {
        return allQualities.value.find((qual) => qual.id === qualityId)?.ranked ?? false;
    }

    function addQuality() : void
    {
        if(!selectedQualityId.value) { return; }

        const newQuality : BaseQualityRef = {
            id: selectedQualityId.value,
        };

        if(isQualityRanked(selectedQualityId.value))
        {
            newQuality.ranks = selectedQualityRanks.value;
        }

        const currentQualities = editedValue.value.qualities ?? [];
        editedValue.value = {
            ...editedValue.value,
            qualities: [ ...currentQualities, newQuality ],
        };

        // Reset selection
        selectedQualityId.value = null;
        selectedQualityRanks.value = 1;
    }

    function removeQuality(index : number) : void
    {
        const currentQualities = editedValue.value.qualities ?? [];
        currentQualities.splice(index, 1);
        editedValue.value = {
            ...editedValue.value,
            qualities: currentQualities.length > 0 ? currentQualities : undefined,
        };
    }

    function onRemove() : void
    {
        emit('remove');
    }

    //------------------------------------------------------------------------------------------------------------------
    // Watchers
    //------------------------------------------------------------------------------------------------------------------

    // Reset ranks when quality selection changes
    watch(selectedQualityId, () =>
    {
        selectedQualityRanks.value = 1;
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
