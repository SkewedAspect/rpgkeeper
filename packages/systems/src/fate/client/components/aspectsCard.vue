<!----------------------------------------------------------------------------------------------------------------------
  -- Aspects
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="fate-aspects" :class="{ readonly: readonly }" no-body shrink>
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="fist-raised" />
                    <span class="d-none d-md-inline">Aspects</span>
                </h5>
                <div v-if="!readonly" class="ms-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <Fa icon="edit" fixed-width />
                        <span class="d-none d-md-inline">Edit</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Content -->
        <table class="table table-bordered mb-0 font-sm">
            <tbody>
                <!-- High Concept -->
                <tr>
                    <td class="text-nowrap">
                        <b>High Concept:</b>
                    </td>
                    <td class="w-100">
                        {{ highConcept.detail }}
                    </td>
                </tr>

                <!-- Trouble Concept -->
                <tr>
                    <td class="text-nowrap">
                        <b>Trouble:</b>
                    </td>
                    <td class="w-100">
                        {{ trouble.detail }}
                    </td>
                </tr>

                <!-- Extra Concepts -->
                <tr v-for="(aspect, index) in extraAspects" :key="index">
                    <td colspan="2">
                        {{ aspect.detail }}
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modals -->
        <EditAspectsModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #fate-aspects {
        table {
            //border-left: none !important;
            //border-right: none !important;
            //
            //td:first-child {
            //    border-left: none !important;
            //}
            //td:last-child {
            //    border-right: none !important;
            //}

            //tbody tr:last-child {
            //
            //    td {
            //        border-bottom-width: 1px;
            //    }
            //}
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Interfaces
    import type { FateAspect } from '../../models.ts';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import EditAspectsModal from './editAspectsModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        aspects : FateAspect[];
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

    const editModal = ref<InstanceType<typeof EditAspectsModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const aspects = computed<FateAspect[]>({
        get() { return props.aspects; },
        set(val) { emit('update:aspects', val); },
    });

    const highConcept = computed<FateAspect>(() =>
    {
        return aspects.value.find((item) => item.type === 'high concept') ?? { type: 'high concept', detail: '' };
    });

    const trouble = computed<FateAspect>(() =>
    {
        return aspects.value.find((item) => item.type === 'trouble') ?? { type: 'trouble', detail: '' };
    });

    const extraAspects = computed<FateAspect[]>(() =>
    {
        return aspects.value.filter((item) => item.type === 'aspect');
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value?.show(aspects.value);
    }

    function onEditSave(newAspects : FateAspect[]) : void
    {
        aspects.value = newAspects;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
