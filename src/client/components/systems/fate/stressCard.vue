<!----------------------------------------------------------------------------------------------------------------------
  -- FateStress
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="fate-stress" :class="{ readonly: readonly }" no-body fill>
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="me-1" icon="heart-circle"></fa>
                    <span class="d-none d-md-inline">Physical Stress</span>
                </h5>
            </div>
        </template>

        <!-- Content -->
        <table class="table stress-table table-bordered mb-0">
            <tr>
                <td v-for="(stressBox, index) in [ 1, 2, 3, 4 ]" :key="stressBox">
                    <BFormGroup v-model="physicalStress[index]" class="me-1" :value="true" :disabled="stressBox > totalPhysicalBoxes" @input="onSave">
                        <b>{{ stressBox }}</b>
                    </BFormGroup>
                </td>
            </tr>
        </table>

        <div class="card-header bg-dark text-white">
            <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                <fa class="me-1" icon="head-side-brain"></fa>
                <span class="d-none d-md-inline">Mental Stress</span>
            </h5>
        </div>
        <table class="table stress-table table-bordered mb-0">
            <tr>
                <td v-for="(stressBox, index) in [ 1, 2, 3, 4 ]" :key="stressBox">
                    <BFormGroup v-model="mentalStress[index]" class="me-1" :value="true" :disabled="stressBox > totalMentalBoxes" @input="onSave">
                        <b>{{ stressBox }}</b>
                    </BFormGroup>
                </td>
            </tr>
        </table>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #fate-stress {
        min-width: 245px;

        .stress-table {
            border: none;

            tr {
                border-top: none;
                border-bottom: none;

                td:first-child {
                    border-start: none;
                }

                td:last-child {
                    border-right: none;
                }

                td {
                    border-bottom: none;
                }
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';

    // Interfaces
    import { FateStress, FateSkill } from '../../../../common/interfaces/systems/fate';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        physical : FateStress;
        mental : FateStress;
        skills : FateSkill[];
        readonly : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'update:physical', physical : FateStress);
        (e : 'update:mental', physical : FateStress);
        (e : 'save') : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const physicalStress = computed<FateStress>({
        get() { return props.physical; },
        set(val) { emit('update:physical', val); }
    });

    const mentalStress = computed<FateStress>({
        get() { return props.mental; },
        set(val) { emit('update:physical', val); }
    });

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
