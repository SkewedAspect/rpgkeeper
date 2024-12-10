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
                    <td v-for="(stressBox, index) in [ 1, 2, 3, 4 ]" :key="stressBox">
                        <BFormCheckbox
                            v-model="physicalStress[index]"
                            class="me-1"
                            :value="true"
                            :disabled="stressBox > totalPhysicalBoxes"
                            @input="onSave"
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
                    <td v-for="(stressBox, index) in [ 1, 2, 3, 4 ]" :key="stressBox">
                        <BFormCheckbox
                            v-model="mentalStress[index]"
                            class="me-1"
                            :value="true"
                            :disabled="stressBox > totalMentalBoxes"
                            @input="onSave"
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

        //.stress-table {
        //    border: none;
        //
        //    tr {
        //        border-top: none;
        //        border-bottom: none;
        //
        //        td:first-child {
        //            border-left: none;
        //        }
        //
        //        td:last-child {
        //            border-right: none;
        //        }
        //
        //        td {
        //            border-bottom: none;
        //        }
        //    }
        //}
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

    const emit = defineEmits<{
        'update:physical' : (val : FateStress) => void;
        'update:mental' : (val : FateStress) => void;
        'save' : () => void;
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const physicalStress = computed<FateStress>({
        get() { return props.physical; },
        set(val) { emit('update:physical', val); },
    });

    const mentalStress = computed<FateStress>({
        get() { return props.mental; },
        set(val) { emit('update:physical', val); },
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
