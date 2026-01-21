<!----------------------------------------------------------------------------------------------------------------------
  -- attachmentEdit.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="attachment-edit">
        <SupplementSelect
            ref="suppSelect"
            :label="label"
            label-class="fw-bold"
            :available="filteredAttachments"
            :selected="selectedAttachments"
            @add="onAttachmentAdd"
            @remove="onAttachmentRemove"
            @new="onAttachmentNew"
            @edit="onAttachmentEdit"
            @delete="onAttachmentDelete"
        >
            <template #selection-extra="{ supplement }">
                <BBadge v-if="supplement" variant="secondary" class="me-2">
                    {{ supplement.hpRequired }} HP
                </BBadge>
            </template>
            <template #preview="{ instance, supplement }">
                <div>
                    <div class="mb-2">
                        <span class="text-muted">HP Required: </span>
                        <span class="fw-bold">{{ supplement.hpRequired }}</span>
                        <span class="ms-3 text-muted">Rarity: </span>
                        <span class="fw-bold">{{ supplement.rarity }}</span>
                    </div>
                    <div v-if="supplement.baseModifier" class="mb-2">
                        <span class="fw-bold">Base Modifier: </span>
                        <MarkdownBlock :text="supplement.baseModifier" inline />
                    </div>
                    <div v-if="supplement.modOptions && supplement.modOptions.length > 0" class="mb-2">
                        <span class="fw-bold">Mod Options:</span>
                        <div v-if="instance" class="mt-1">
                            <BFormCheckbox
                                v-for="(mod, index) in supplement.modOptions"
                                :key="index"
                                :model-value="isModActivated(instance, index)"
                                @update:model-value="toggleMod(instance, index, !!$event)"
                            >
                                {{ mod }}
                            </BFormCheckbox>
                        </div>
                        <ul v-else class="mb-0 ps-3">
                            <li v-for="(mod, index) in supplement.modOptions" :key="index">
                                {{ mod }}
                            </li>
                        </ul>
                    </div>
                </div>
                <MarkdownBlock :text="supplement.description" inline />
                <Reference
                    class="float-end mt-2"
                    :reference="supplement.reference ?? ''"
                />
            </template>
            <template #browse-preview="{ supplement }">
                <div class="attachment-stats d-flex flex-wrap mb-2">
                    <span class="me-4"><strong>HP Required:</strong> {{ supplement.hpRequired }}</span>
                    <span class="me-4"><strong>Rarity:</strong> {{ supplement.rarity }}</span>
                    <span><strong>Use With:</strong> {{ supplement.useWith }}</span>
                </div>
                <div v-if="supplement.baseModifier" class="mb-2">
                    <strong>Base Modifier:</strong>
                    <MarkdownBlock :text="supplement.baseModifier" inline />
                </div>
                <div v-if="supplement.modOptions && supplement.modOptions.length > 0" class="mb-2">
                    <strong>Mod Options:</strong>
                    <ul class="mb-0 ps-3">
                        <li v-for="(mod, index) in supplement.modOptions" :key="index">
                            {{ mod }}
                        </li>
                    </ul>
                </div>
                <hr class="my-2">
                <div class="attachment-description flex-grow-1 overflow-auto">
                    <MarkdownBlock :text="supplement.description ?? 'No description.'" inline />
                </div>
                <div class="text-end mt-auto pt-2">
                    <h5 class="mb-1">
                        <ScopeBadge :supplement="supplement" />
                    </h5>
                    <Reference :reference="supplement.reference ?? ''" />
                </div>
            </template>
        </SupplementSelect>

        <div v-if="showHardpointsSummary" class="mt-1">
            <span class="text-muted">Hardpoints: </span>
            <span :class="hardpointsClass">
                {{ usedHardpoints }} / {{ totalHardpoints }} used
            </span>
            <span v-if="usedHardpoints > totalHardpoints" class="text-warning ms-2">
                <Fa icon="exclamation-triangle" />
                Exceeds available hardpoints
            </span>
        </div>

        <!-- Modals -->
        <AddEditAttachmentModal ref="addEditAttachmentModal" :use-with="useWith" @add="onAttachmentAdd" />
        <DeleteModal
            ref="delAttachmentModal"
            :name="delAttachment.name"
            type="attachment"
            @hidden="onDelAttachmentHidden"
            @delete="onDelAttachmentDelete"
        />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, useTemplateRef } from 'vue';

    // Models
    import type { EoteAttachment, EoteAttachmentRef } from '../../../models.ts';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import SupplementSelect from '@client/components/character/supplementSelect.vue';
    import DeleteModal from '@client/components/ui/deleteModal.vue';
    import AddEditAttachmentModal from '../modals/addEditAttachmentModal.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import Reference from '@client/components/character/referenceBlock.vue';
    import ScopeBadge from '@client/components/character/scopeBadge.vue';

    // Utils
    import { uniqBy } from '@client/lib/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        attachments : EoteAttachmentRef[];
        totalHardpoints : number;
        useWith : 'weapon' | 'armor';
        label ?: string;
        showHardpointsSummary ?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        label: 'Attachments',
        showHardpointsSummary: true,
    });

    type Events = (e : 'update:attachments', attachments : EoteAttachmentRef[]) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const delAttachment = ref<{ id ?: string, name ?: string }>({
        id: undefined,
        name: undefined,
    });

    const addEditAttachmentModal = ref<InstanceType<typeof AddEditAttachmentModal> | null>(null);
    const delAttachmentModal = ref<InstanceType<typeof DeleteModal> | null>(null);
    const suppSelect = useTemplateRef('suppSelect');

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const allAttachments = computed(() => supplementStore.get<EoteAttachment>(mode.value, 'attachment'));

    const filteredAttachments = computed(() =>
    {
        return allAttachments.value.filter((att) =>
        {
            const useWithLower = att.useWith?.toLowerCase() ?? '';
            return useWithLower === props.useWith
                || useWithLower === 'any'
                || useWithLower.includes(props.useWith);
        });
    });

    const selectedAttachments = computed({
        get()
        {
            return [ ...props.attachments ];
        },
        set(val)
        {
            emit('update:attachments', val);
        },
    });

    const usedHardpoints = computed(() =>
    {
        return props.attachments.reduce((total, attRef) =>
        {
            const attachment = allAttachments.value.find((att) => att.id === attRef.id);
            return total + (attachment?.hpRequired ?? 0);
        }, 0);
    });

    const hardpointsClass = computed(() =>
    {
        if(usedHardpoints.value > props.totalHardpoints)
        {
            return 'text-danger fw-bold';
        }
        else if(usedHardpoints.value === props.totalHardpoints)
        {
            return 'text-warning';
        }

        return 'text-success';
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function isModActivated(instance : EoteAttachmentRef, modIndex : number) : boolean
    {
        return instance.activatedMods?.includes(modIndex) ?? false;
    }

    function toggleMod(instance : EoteAttachmentRef, modIndex : number, activated : boolean) : void
    {
        const updatedAttachments = selectedAttachments.value.map((att) =>
        {
            if(att.id === instance.id)
            {
                const currentMods = att.activatedMods ?? [];
                let newMods : number[];

                if(activated)
                {
                    // Add the mod index if not already present
                    newMods = currentMods.includes(modIndex)
                        ? currentMods
                        : [ ...currentMods, modIndex ].sort((valA, valB) => valA - valB);
                }
                else
                {
                    // Remove the mod index
                    newMods = currentMods.filter((idx) => idx !== modIndex);
                }

                return {
                    ...att,
                    activatedMods: newMods.length > 0 ? newMods : undefined,
                };
            }

            return att;
        });

        selectedAttachments.value = updatedAttachments;
    }

    function onAttachmentAdd(attachment : { id ?: string }) : void
    {
        if(!attachment.id) { return; }

        const newAtt : EoteAttachmentRef = { id: attachment.id };

        // Update to uniq'd version of the array
        selectedAttachments.value = uniqBy([ ...selectedAttachments.value, newAtt ], 'id');
    }

    function onAttachmentRemove(attachment : { id ?: string }) : void
    {
        if(!attachment.id) { return; }
        selectedAttachments.value = selectedAttachments.value.filter((att) => att.id !== attachment.id);
    }

    function onAttachmentNew() : void
    {
        addEditAttachmentModal.value?.show();
    }

    function onAttachmentEdit(attachment : EoteAttachment) : void
    {
        addEditAttachmentModal.value?.show(attachment);
    }

    function onAttachmentDelete(attachment : EoteAttachment) : void
    {
        delAttachment.value.id = attachment.id;
        delAttachment.value.name = attachment.name;

        delAttachmentModal.value?.show();
    }

    function onDelAttachmentHidden() : void
    {
        delAttachment.value.id = undefined;
        delAttachment.value.name = undefined;
    }

    async function onDelAttachmentDelete() : Promise<void>
    {
        suppSelect.value?.clearSelection();

        if(delAttachment.value.id)
        {
            await supplementStore.remove(mode.value, 'attachment', delAttachment.value.id);
        }

        selectedAttachments.value = selectedAttachments.value.filter((item) => item.id !== delAttachment.value.id);
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
