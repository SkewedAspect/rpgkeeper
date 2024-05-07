<!----------------------------------------------------------------------------------------------------------------------
  -- FATE Consequences
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="fate-consequences" :class="{ readonly: readonly }" fill no-body>
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="me-1" icon="skull-crossbones"></fa>
                    <span class="d-none d-md-inline">Consequences</span>
                </h5>
                <div v-if="!readonly" class="ml-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <fa icon="edit" fixed-width></fa>
                        <span class="d-none d-md-inline">Edit</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Content -->
        <table class="table table-bordered mb-0 font-sm">
            <tr>
                <td class="text-end text-nowrap" style="width: 1%">
                    <b>2</b>
                </td>
                <td style="min-width: 80px" :colspan="hasExtraMild ? 1 : 2">
                    <span v-if="mildConsequence1.detail">
                        {{ mildConsequence1.detail }}
                        <small v-if="mildConsequence1.healing"><i>(Healing)</i></small>
                    </span>
                    <span v-else class="text-muted">Mild</span>
                </td>
                <td v-if="hasExtraMild" style="min-width: 80px">
                    <span v-if="mildConsequence2.detail">
                        {{ mildConsequence2.detail }}
                        <small v-if="mildConsequence2.healing"><i>(Healing)</i></small>
                    </span>
                    <span v-else class="text-muted">Mild ({{ extraMildType }})</span>
                </td>
            </tr>
            <tr>
                <td class="text-end text-nowrap" style="width: 1%">
                    <b>4</b>
                </td>
                <td style="min-width: 80px" colspan="2">
                    <span v-if="moderateConsequence.detail">
                        {{ moderateConsequence.detail }}
                        <small v-if="moderateConsequence.healing"><i>(Healing)</i></small>
                    </span>
                    <span v-else class="text-muted">Moderate</span>
                </td>
            </tr>
            <tr>
                <td class="text-end text-nowrap" style="width: 1%">
                    <b>6</b>
                </td>
                <td style="min-width: 80px" colspan="2">
                    <span v-if="severeConsequence.detail">
                        {{ severeConsequence.detail }}
                        <small v-if="severeConsequence.healing"><i>(Healing)</i></small>
                    </span>
                    <span v-else class="text-muted">Severe</span>
                </td>
            </tr>
        </table>

        <!-- Modals -->
        <EditConsequencesModal ref="editModal" :skills="props.skills" @save="onEditSave"></EditConsequencesModal>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Interfaces
    import { FateAspect, FateSkill } from '../../../../common/interfaces/systems/fate';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';
    import EditConsequencesModal from './editConsequencesModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        aspects : FateAspect[];
        skills : FateSkill[];
        readonly : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'update:aspects', aspects : FateAspect[]);
        (e : 'save') : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Ref
    //------------------------------------------------------------------------------------------------------------------

    const editModal = ref<InstanceType<typeof EditConsequencesModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const aspects = computed<FateAspect[]>({
        get() { return props.aspects; },
        set(val) { emit('update:aspects', val); }
    });

    const consequences = computed<FateAspect[]>(() => props.aspects.filter((aspect) => aspect.type === 'consequence'));

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

    function openEditModal() : void
    {
        editModal.value.show(aspects.value);
    }

    function onEditSave(newAspects : FateAspect[]) : void
    {
        aspects.value = newAspects;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
