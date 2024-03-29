<!----------------------------------------------------------------------------------------------------------------------
  -- EditConsequenceModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-consequences-modal">
        <b-modal
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
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Consequence
            </template>

            <!-- Modal Content -->
            <b-form-group
                id="mild-consequence-1"
                label="Mild Consequence (2)"
                label-class="font-weight-bold"
                label-for="mc-input-1"
            >
                <div class="d-flex">
                    <b-input-group>
                        <b-form-input id="mc-input-1" v-model="mildDetail1"></b-form-input>
                        <b-input-group-append>
                            <b-button @click="mildDetail1 = ''">
                                <fa icon="times"></fa>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                    <b-button v-model:pressed="mildHealing1" class="ml-2 text-nowrap" :disabled="!mildDetail1">
                        <fa :icon="mildHealing1 ? 'check-square' : [ 'far', 'square' ]"></fa>
                        Healing
                    </b-button>
                </div>
            </b-form-group>
            <b-form-group
                v-if="hasExtraMild"
                id="mild-consequence-2"
                :label="`Mild Consequence (2, ${ extraMildType })`"
                label-class="font-weight-bold"
                label-for="mc-input-2"
            >
                <div class="d-flex">
                    <b-input-group>
                        <b-form-input id="mc-input-2" v-model="mildDetail2"></b-form-input>
                        <b-input-group-append>
                            <b-button @click="mildDetail2 = ''">
                                <fa icon="times"></fa>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                    <b-button v-model:pressed="mildHealing2" class="ml-2 text-nowrap" :disabled="!mildDetail2">
                        <fa :icon="mildHealing2 ? 'check-square' : [ 'far', 'square' ]"></fa>
                        Healing
                    </b-button>
                </div>
            </b-form-group>
            <b-form-group
                id="moderate-consequence"
                label="Moderate Consequence (4)"
                label-class="font-weight-bold"
                label-for="mc-input"
            >
                <div class="d-flex">
                    <b-input-group>
                        <b-form-input id="mc-input" v-model="moderateDetail"></b-form-input>
                        <b-input-group-append>
                            <b-button @click="moderateDetail = ''">
                                <fa icon="times"></fa>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                    <b-button v-model:pressed="moderateHealing" class="ml-2 text-nowrap" :disabled="!moderateDetail">
                        <fa :icon="moderateHealing ? 'check-square' : [ 'far', 'square' ]"></fa>
                        Healing
                    </b-button>
                </div>
            </b-form-group>
            <b-form-group
                id="severe-consequence"
                label="Severe Consequence (6)"
                label-class="font-weight-bold"
                label-for="sc-input"
            >
                <div class="d-flex">
                    <b-input-group>
                        <b-form-input id="sc-input" v-model="severeDetail"></b-form-input>
                        <b-input-group-append>
                            <b-button @click="severeDetail = ''">
                                <fa icon="times"></fa>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                    <b-button v-model:pressed="severeHealing" class="ml-2 text-nowrap" :disabled="!severeDetail">
                        <fa :icon="severeHealing ? 'check-square' : [ 'far', 'square' ]"></fa>
                        Healing
                    </b-button>
                </div>
            </b-form-group>

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

<script lang="ts" setup>
    //------------------------------------------------------------------------------------------------------------------

    import { computed, ref } from 'vue';

    // Interfaces
    import { FateAspect, FateSkill } from '../../../../common/interfaces/systems/fate';

    // Components
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        skills : FateSkill[];
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'save', aspects : FateAspect[]) : void;
    }

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
        mildHealing1.value = mildConsequence1.value.healing;
        mildHealing2.value = mildConsequence2.value.healing;
        moderateHealing.value = moderateConsequence.value.healing;
        severeHealing.value = severeConsequence.value.healing;

        // Show the modal
        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onSave() : void
    {
        // Build new consequences
        const newConsequences = [
            { ...mildConsequence1.value, detail: mildDetail1.value, healing: mildHealing1.value },
            { ...mildConsequence2.value, detail: mildDetail2.value, healing: mildHealing2.value },
            { ...moderateConsequence.value, detail: moderateDetail.value, healing: moderateHealing.value },
            { ...severeConsequence.value, detail: severeDetail.value, healing: severeHealing.value }
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
