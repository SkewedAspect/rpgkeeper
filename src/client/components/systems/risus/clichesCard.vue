<!----------------------------------------------------------------------------------------------------------------------
  -- Risus Cliches
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="risus-cliches-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="flame" />
                    <span class="d-none d-md-inline">Cliches</span>
                </h5>
                <div v-if="!readonly" class="ms-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <Fa icon="edit" fixed-width />
                        <span class="d-none d-md-inline">Edit</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <BListGroup v-if="cliches && cliches.length > 0" flush>
            <BListGroupItem v-for="cliche in cliches" :key="cliche.description" class="d-flex">
                <BFormSpinbutton
                    v-model="cliche.current"
                    class="me-2"
                    min="0"
                    :max="cliche.value"
                    step="1"
                    :disabled="readonly"
                    vertical
                    size="sm"
                    @change="onChange()"
                />
                <div class="d-inline-block flex-fill">
                    <h5 class="mb-0">
                        <b>{{ cliche.description }}</b> ({{ cliche.value }})
                    </h5>
                    <div class="text-muted">
                        {{ cliche.tools }}
                    </div>
                </div>
                <div v-if="!readonly" class="d-flex flex-column justify-content-between text-nowrap">
                    <BButton
                        title="Roll this cliche"
                        variant="primary"
                        block
                        @click="roll(cliche.current, cliche.description)"
                    >
                        <Fa icon="dice" />
                        Roll
                    </BButton>
                    <BButton
                        title="Reset to max"
                        block
                        @click="resetCliche(cliche)"
                    >
                        <Fa icon="arrow-to-top" />
                        Reset to Max
                    </BButton>
                </div>
            </BListGroupItem>
        </BListGroup>
        <div v-else class="card-body">
            <h4 class="text-center text-muted m-0">
                No Cliches.
            </h4>
        </div>

        <!-- Edit Modal -->
        <EditClichesModal ref="editModal" @save="onEditSave" />
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
    import { Character } from '../../../../common/models';
    import { RisusCliche, RisusSystemDetails } from '../../../../common/models/systems';

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

    function onChange() : void
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
                current: Math.min(cliche.value, cliche.current),
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
