<!----------------------------------------------------------------------------------------------------------------------
  -- FateStress
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="fate-stress" :class="{ readonly: readonly }" no-body fill>
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="heart-circle" />
                    <span class="d-none d-md-inline">Physical Stress</span>
                </h5>
            </div>
        </template>

        <!-- Content -->
        <table class="table stress-table table-bordered mb-0">
            <tbody>
                <tr>
                    <td v-for="(stressBox, index) in stressSlots" :key="stressBox">
                        <BFormCheckbox
                            v-model="physicalStress[index]"
                            class="me-1"
                            :value="true"
                            :disabled="stressBox > totalPhysicalBoxes"
                            @update:model-value="onSave"
                        >
                            <b>{{ stressBox }}</b>
                        </BFormCheckbox>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="card-header bg-dark text-white">
            <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                <Fa class="me-1" icon="head-side-brain" />
                <span class="d-none d-md-inline">Mental Stress</span>
            </h5>
        </div>
        <table class="table stress-table table-bordered mb-0">
            <tbody>
                <tr>
                    <td v-for="(stressBox, index) in stressSlots" :key="stressBox">
                        <BFormCheckbox
                            v-model="mentalStress[index]"
                            class="me-1"
                            :value="true"
                            :disabled="stressBox > totalMentalBoxes"
                            @update:model-value="onSave"
                        >
                            <b>{{ stressBox }}</b>
                        </BFormCheckbox>
                    </td>
                </tr>
            </tbody>
        </table>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #fate-stress {
        min-width: 245px;
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';

    // Interfaces
    import { FateSkill, FateStress } from '../../../../common/models/systems';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';

    //------------------------------------------------------------------------------------------------------------------
    // State
    //------------------------------------------------------------------------------------------------------------------

    const stressSlots = [ 1, 2, 3, 4 ];

    const physicalStress = defineModel<FateStress>('physical');
    const mentalStress = defineModel<FateStress>('mental');

    interface Props
    {
        skills : FateSkill[];
        readonly : boolean;
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        save : [];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const totalPhysicalBoxes = computed(() =>
    {
        const physique = props.skills.find((skill) => skill.name === 'Physique');
        if(physique && physique.rank >= 1 && physique.rank < 3)
        {
            return 3;
        }
        else if(physique && physique.rank >= 3)
        {
            return 4;
        }
        else
        {
            return 2;
        }
    });

    const totalMentalBoxes = computed(() =>
    {
        const will = props.skills.find((skill) => skill.name === 'Will');
        if(will && will.rank >= 1 && will.rank < 3)
        {
            return 3;
        }
        else if(will && will.rank >= 3)
        {
            return 4;
        }
        else
        {
            return 2;
        }
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onSave() : void
    {
        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
