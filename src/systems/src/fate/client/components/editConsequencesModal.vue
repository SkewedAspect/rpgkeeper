<!----------------------------------------------------------------------------------------------------------------------
  -- EditConsequenceModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-consequences-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <Fa icon="file-edit" />
                    Edit Consequence
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormGroup
                id="mild-consequence-1"
                label="Mild Consequence (2)"
                label-class="fw-bold"
                label-for="mc-input-1"
            >
                <div class="d-flex">
                    <BInputGroup>
                        <BFormInput id="mc-input-1" v-model="mildDetail1" />
                        <template #append>
                            <BButton @click="mildDetail1 = ''">
                                <Fa icon="times" />
                            </BButton>
                        </template>
                    </BInputGroup>
                    <BButton v-model:pressed="mildHealing1" class="ms-2 text-nowrap" :disabled="!mildDetail1">
                        <Fa :icon="mildHealing1 ? 'check-square' : [ 'far', 'square' ]" />
                        Healing
                    </BButton>
                </div>
            </BFormGroup>
            <BFormGroup
                v-if="hasExtraMild"
                id="mild-consequence-2"
                :label="`Mild Consequence (2, ${ extraMildType })`"
                label-class="fw-bold"
                label-for="mc-input-2"
            >
                <div class="d-flex">
                    <BInputGroup>
                        <BFormInput id="mc-input-2" v-model="mildDetail2" />
                        <template #append>
                            <BButton @click="mildDetail2 = ''">
                                <Fa icon="times" />
                            </BButton>
                        </template>
                    </BInputGroup>
                    <BButton v-model:pressed="mildHealing2" class="ms-2 text-nowrap" :disabled="!mildDetail2">
                        <Fa :icon="mildHealing2 ? 'check-square' : [ 'far', 'square' ]" />
                        Healing
                    </BButton>
                </div>
            </BFormGroup>
            <BFormGroup
                id="moderate-consequence"
                label="Moderate Consequence (4)"
                label-class="fw-bold"
                label-for="mc-input"
            >
                <div class="d-flex">
                    <BInputGroup>
                        <BFormInput id="mc-input" v-model="moderateDetail" />
                        <template #append>
                            <BButton @click="moderateDetail = ''">
                                <Fa icon="times" />
                            </BButton>
                        </template>
                    </BInputGroup>
                    <BButton v-model:pressed="moderateHealing" class="ms-2 text-nowrap" :disabled="!moderateDetail">
                        <Fa :icon="moderateHealing ? 'check-square' : [ 'far', 'square' ]" />
                        Healing
                    </BButton>
                </div>
            </BFormGroup>
            <BFormGroup
                id="severe-consequence"
                label="Severe Consequence (6)"
                label-class="fw-bold"
                label-for="sc-input"
            >
                <div class="d-flex">
                    <BInputGroup>
                        <BFormInput id="sc-input" v-model="severeDetail" />
                        <template #append>
                            <BButton @click="severeDetail = ''">
                                <Fa icon="times" />
                            </BButton>
                        </template>
                    </BInputGroup>
                    <BButton v-model:pressed="severeHealing" class="ms-2 text-nowrap" :disabled="!severeDetail">
                        <Fa :icon="severeHealing ? 'check-square' : [ 'far', 'square' ]" />
                        Healing
                    </BButton>
                </div>
            </BFormGroup>

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
    //------------------------------------------------------------------------------------------------------------------

    import { computed, ref } from 'vue';

    // Interfaces
    import type { FateAspect, FateSkill } from '../../models.ts';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        skills : FateSkill[];
    }

    const props = defineProps<Props>();

    type Events = (e : 'save', aspects : FateAspect[]) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const aspects = ref<FateAspect[]>([]);

    const mildDetail1 = ref('');
    const mildDetail2 = ref('');
    const moderateDetail = ref('');
    const severeDetail = ref('');

    const mildHealing1 = ref(false);
    const mildHealing2 = ref(false);
    const moderateHealing = ref(false);
    const severeHealing = ref(false);

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const consequences = computed<FateAspect[]>(() => aspects.value.filter((aspect) => aspect.type === 'consequence'));

    const mildConsequence1 = computed<FateAspect>(() =>
    {
        return consequences.value.filter((con) => con.value === 2)[0]
            ?? { type: 'consequence', detail: '', healing: false, value: 2 };
    });

    const mildConsequence2 = computed<FateAspect>(() =>
    {
        return consequences.value.filter((con) => con.value === 2)[1]
            ?? { type: 'consequence', detail: '', healing: false, value: 2 };
    });

    const moderateConsequence = computed<FateAspect>(() =>
    {
        return consequences.value.filter((con) => con.value === 4)[0]
            ?? { type: 'consequence', detail: '', healing: false, value: 4 };
    });

    const severeConsequence = computed<FateAspect>(() =>
    {
        return consequences.value.filter((con) => con.value === 6)[0]
            ?? { type: 'consequence', detail: '', healing: false, value: 6 };
    });

    const extraMildType = computed(() =>
    {
        const will = props.skills.find((skill) => skill.name === 'Will');
        const physique = props.skills.find((skill) => skill.name === 'Physique');

        if((physique && physique.rank >= 5) && (will && will.rank >= 5))
        {
            return 'Mental and Physical';
        }
        else if(physique && physique.rank >= 5)
        {
            return 'Physical';
        }
        else if(will && will.rank >= 5)
        {
            return 'Mental';
        }
        else
        {
            return 'none';
        }
    });

    const hasExtraMild = computed(() => extraMildType.value !== 'none');

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(charAspects : FateAspect[]) : void
    {
        // Clone the array of aspects
        aspects.value = charAspects.map((aspect) => ({ ...aspect }));

        // Update the details
        mildDetail1.value = mildConsequence1.value.detail;
        mildDetail2.value = mildConsequence2.value.detail;
        moderateDetail.value = moderateConsequence.value.detail;
        severeDetail.value = severeConsequence.value.detail;
        mildHealing1.value = mildConsequence1.value.healing ?? false;
        mildHealing2.value = mildConsequence2.value.healing ?? false;
        moderateHealing.value = moderateConsequence.value.healing ?? false;
        severeHealing.value = severeConsequence.value.healing ?? false;

        // Show the modal
        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function onSave() : void
    {
        // Build new consequences
        const newConsequences = [
            { ...mildConsequence1.value, detail: mildDetail1.value, healing: mildHealing1.value },
            { ...mildConsequence2.value, detail: mildDetail2.value, healing: mildHealing2.value },
            { ...moderateConsequence.value, detail: moderateDetail.value, healing: moderateHealing.value },
            { ...severeConsequence.value, detail: severeDetail.value, healing: severeHealing.value },
        ].filter((consequence) => !!consequence.detail);

        // Pull out aspects, remove all consequences, and then re-add them.
        const restAspects = aspects.value.filter((aspect) => aspect.type !== 'consequence');

        emit('save', [ ...restAspects, ...newConsequences ]);
        aspects.value = [];

        // Update the details
        mildDetail1.value = '';
        mildDetail2.value = '';
        moderateDetail.value = '';
        severeDetail.value = '';
        mildHealing1.value = false;
        mildHealing2.value = false;
        moderateHealing.value = false;
        severeHealing.value = false;
    }

    function onCancel() : void
    {
        aspects.value = [];

        // Update the details
        mildDetail1.value = '';
        mildDetail2.value = '';
        moderateDetail.value = '';
        severeDetail.value = '';
        mildHealing1.value = false;
        mildHealing2.value = false;
        moderateHealing.value = false;
        severeHealing.value = false;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
