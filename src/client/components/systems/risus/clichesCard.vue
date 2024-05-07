<!----------------------------------------------------------------------------------------------------------------------
  -- Risus Cliches
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="risus-cliches-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="mr-1" icon="flame"></fa>
                    <span class="d-none d-md-inline">Cliches</span>
                </h5>
                <div v-if="!readonly" class="ml-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <fa icon="edit" fixed-width></fa>
                        <span class="d-none d-md-inline">Edit</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <b-list-group v-if="cliches && cliches.length > 0" flush>
            <b-list-group-item v-for="cliche in cliches" :key="cliche.description" class="d-flex">
                <b-form-spinbutton
                    v-model="cliche.current"
                    style="min-width: 40px; max-width: 40px"
                    class="mr-2"
                    min="0"
                    :max="cliche.value"
                    step="1"
                    :disabled="readonly"
                    vertical
                    size="sm"
                    @change="onChange()"
                >
                </b-form-spinbutton>
                <div class="d-inline-block flex-fill">
                    <h5 class="mb-0">
                        <b>{{ cliche.description }}</b> ({{ cliche.value }})
                    </h5>
                    <div class="text-muted">
                        {{ cliche.tools }}
                    </div>
                </div>
                <div v-if="!readonly" class="d-flex flex-column text-nowrap">
                    <BButton
                        title="Roll this cliche"
                        variant="primary"
                        block
                        @click="roll(cliche.current, cliche.description)"
                    >
                        <fa icon="dice"></fa>
                        Roll
                    </BButton>
                    <BButton
                        title="Reset to max"
                        block
                        @click="resetCliche(cliche)"
                    >
                        <fa icon="arrow-to-top"></fa>
                        Reset to Max
                    </BButton>
                </div>
            </b-list-group-item>
        </b-list-group>
        <div v-else class="card-body">
            <h4 class="text-center text-muted m-0">
                No Cliches.
            </h4>
        </div>

        <!-- Edit Modal -->
        <EditClichesModal ref="editModal" @save="onEditSave"></EditClichesModal>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #risus-cliches-block {
        &.card:not(.readonly) {
            .card-header {
                padding-top: 0.5rem !important;
                padding-bottom: 0.5rem !important;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Interfaces
    import { Character } from '../../../../common/interfaces/common';
    import { RisusCliche, RisusSystemDetails } from '../../../../common/interfaces/systems/risus';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Components
    import EditClichesModal from './editClichesModal.vue';
    import RpgkCard from '../../ui/rpgkCard.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        readonly : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'roll', dice : number, name ?: string) : void;
        (e : 'save') : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharactersStore());
    const editModal = ref<InstanceType<typeof EditClichesModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const char = computed<Character<RisusSystemDetails>>(() => current.value as any);

    const cliches = computed(() =>
    {
        return char.value.details.cliches;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onChange()
    {
        if(!props.readonly)
        {
            emit('save');
        }
    }

    function openEditModal() : void
    {
        editModal.value.show(cliches.value);
    }

    function onEditSave(newCliches : RisusCliche[]) : void
    {
        char.value.details.cliches = newCliches.map((cliche) =>
        {
            return {
                ...cliche,
                current: Math.min(cliche.value, cliche.current)
            };
        });

        emit('save');
    }

    function resetCliche(cliche : RisusCliche) : void
    {
        if(!this.readonly)
        {
            cliche.current = cliche.value;

            emit('save');
        }
    }

    function roll(dice : number, name ?: string) : void
    {
        emit('roll', dice, name);
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
