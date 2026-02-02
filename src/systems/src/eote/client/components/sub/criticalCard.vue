<!----------------------------------------------------------------------------------------------------------------------
  -- criticalCard
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BCard :id="id" class="eote-critical-card" no-body>
        <template #header>
            <CloseButton
                v-if="!readonly"
                class="float-end"
                style="margin-top: -3px;"
                @click.stop.prevent="remove"
            />
            <div>
                <small>
                    {{ critical.title }}
                    <span v-if="critical.severity">
                        <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
                        (<difficulty v-for="index in severityRange" :key="index" />)
                    </span>
                    <span v-if="!editing">
                        <span v-if="injury.detail" class="text-muted">
                            - {{ injury.detail }}
                        </span>
                        <BButton
                            v-if="!readonly && criticalNeedsDetail"
                            variant="link"
                            size="sm"
                            class="p-0 ms-1 text-muted"
                            style="font-size: 0.75rem;"
                            @click.stop.prevent="startEdit"
                        >
                            <Fa :icon="injury.detail ? 'edit' : 'plus'" />
                        </BButton>
                    </span>
                </small>
                <div v-if="editing" class="mt-1 d-flex">
                    <BFormSelect v-model="editDetail" size="sm" class="flex-grow-1">
                        <option value="">
                            None
                        </option>
                        <option v-for="option in detailOptions" :key="option" :value="option">
                            {{ option }}
                        </option>
                    </BFormSelect>
                    <BButton variant="success" size="sm" class="ms-2" style="min-width: 38px;" @click.stop.prevent="saveEdit">
                        <Fa icon="check" />
                    </BButton>
                    <BButton variant="secondary" size="sm" class="ms-1" style="min-width: 38px;" @click.stop.prevent="cancelEdit">
                        <Fa icon="times" />
                    </BButton>
                </div>
            </div>

            <BPopover :target="id" triggers="hover" placement="top" teleport-to="body">
                <template #title>
                    <div :class="`${ mode }-system`">
                        {{ critical.title }}
                        <span v-if="critical.severity">
                            <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
                            (<difficulty v-for="index in severityRange" :key="index" />)
                        </span>
                        <span v-if="injury.detail" class="text-muted">
                            - {{ injury.detail }}
                        </span>
                    </div>
                </template>
                <div :class="`${ mode }-system`">
                    <MarkdownBlock :text="critical.description" inline />
                    <ReferenceBlock class="float-end mt-2 mb-2" :reference="reference" />
                </div>
            </BPopover>
        </template>
    </BCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .eote-critical-card {
        .card-header {
            border-bottom: none;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import type { EoteCritical, EoteCriticalInjury } from '../../../models.ts';

    // Utils
    import { shortID } from '@client/lib/utils/misc';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';

    // Components
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import ReferenceBlock from '@client/components/character/referenceBlock.vue';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        critical : EoteCritical;
        injury : EoteCriticalInjury;
        readonly : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'remove', title : string) : void;
        (e : 'update', injury : EoteCriticalInjury) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const uuid = ref(shortID());
    const systemStore = useSystemStore();
    const editing = ref(false);
    const editDetail = ref<string>('');

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const critical = computed(() => props.critical);
    const readonly = computed(() => props.readonly);

    const id = computed(() => `critical-${ uuid.value }`);
    const reference = computed(() => { return mode.value ? 'E-CRB:217' : 'G-CRB:115'; });
    const severityRange = computed(() => Array(critical.value.severity));

    const criticalNeedsDetail = computed(() =>
    {
        return [ 'Crippled', 'Maimed', 'Gruesome Injury' ].includes(critical.value.title);
    });

    const detailOptions = computed(() =>
    {
        if(critical.value.title === 'Gruesome Injury')
        {
            return [ 'Brawn', 'Agility', 'Intellect', 'Cunning', 'Willpower', 'Presence' ];
        }
        else if([ 'Crippled', 'Maimed' ].includes(critical.value.title))
        {
            return [ 'Right Arm', 'Left Arm', 'Right Leg', 'Left Leg' ];
        }

        return [];
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function remove() : void
    {
        if(!readonly.value)
        {
            emit('remove', critical.value.title);
        }
    }

    function startEdit() : void
    {
        editDetail.value = props.injury.detail || '';
        editing.value = true;
    }

    function saveEdit() : void
    {
        const updatedInjury : EoteCriticalInjury = {
            ...props.injury,
            detail: editDetail.value || undefined,
        };
        emit('update', updatedInjury);
        editing.value = false;
    }

    function cancelEdit() : void
    {
        editing.value = false;
        editDetail.value = '';
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
