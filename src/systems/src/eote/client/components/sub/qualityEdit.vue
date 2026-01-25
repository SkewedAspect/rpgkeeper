<!----------------------------------------------------------------------------------------------------------------------
  -- qualityEdit.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="quality-edit">
        <SupplementSelect
            ref="suppSelect"
            :label="label"
            label-class="fw-bold"
            :available="allQualities"
            :selected="selectedQualities"
            @add="onQualityAdd"
            @remove="onQualityRemove"
            @new="onQualityNew"
            @edit="onQualityEdit"
            @delete="onQualityDelete"
        >
            <template #remove-button="{ instance }">
                <BButton
                    v-if="!isAttachmentOnly(instance)"
                    class="ms-2 text-nowrap"
                    variant="danger"
                    title="Remove"
                    @click.prevent.stop="onQualityRemove(instance)"
                >
                    <Fa icon="times" />
                </BButton>
                <span v-else title="From Attachments" class="d-inline-block">
                    <BButton
                        class="ms-2 text-nowrap"
                        variant="outline-secondary"
                        disabled
                    >
                        <Fa icon="link" />
                    </BButton>
                </span>
            </template>
            <template #preview="{ instance, supplement }">
                <div>
                    <div v-if="supplement.ranked && instance && attachmentQualityRanks.get(instance.id)" class="mb-2 float-end fs-4 fw-bold">
                        +{{ attachmentQualityRanks.get(instance.id) }}
                    </div>
                    <div class="mb-2">
                        <i v-if="supplement.passive">Passive</i>
                        <i v-else>Active</i>
                    </div>
                    <div v-if="instance && attachmentSources.get(instance.id)" class="mb-2 small">
                        <span class="text-muted">From attachments:</span>
                        <span class="ms-1">{{ attachmentSources.get(instance.id)?.join(', ') }}</span>
                    </div>
                </div>
                <MarkdownBlock :text="supplement.description" inline />
                <div class="text-end mt-2">
                    <h5 class="mb-1">
                        <ScopeBadge :supplement="supplement" />
                    </h5>
                    <Reference
                        v-if="supplement.reference"
                        :reference="String(supplement.reference)"
                    />
                </div>
            </template>
        </SupplementSelect>

        <!-- Modals -->
        <AddEditQualityModal ref="addEditQualityModal" @add="onQualityAdd" />
        <DeleteModal
            ref="delQualityModal"
            :name="delQuality.name"
            type="quality"
            @hidden="onDelQualityHidden"
            @delete="onDelQualityDelete"
        />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, useTemplateRef } from 'vue';

    // Models
    import type { EoteAttachment, EoteAttachmentRef, EoteQuality, EoteQualityRef } from '../../../models.ts';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import SupplementSelect from '@client/components/character/supplementSelect.vue';
    import DeleteModal from '@client/components/ui/deleteModal.vue';
    import AddEditQualityModal from '../modals/addEditQualityModal.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import Reference from '@client/components/character/referenceBlock.vue';
    import ScopeBadge from '@client/components/character/scopeBadge.vue';

    // Utils
    import { uniqBy } from '@client/lib/utils/misc';
    import { computeAttachmentQualities, computeAttachmentSources } from '../../lib/qualityUtils';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        qualities : EoteQualityRef[];
        attachmentRefs ?: EoteAttachmentRef[];
        label ?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        attachmentRefs: () => [],
        label: 'Qualities',
    });

    type Events = (e : 'update:qualities', qualities : EoteQualityRef[]) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const delQuality = ref<{ id ?: string, name ?: string }>({
        id: undefined,
        name: undefined,
    });

    const addEditQualityModal = ref<InstanceType<typeof AddEditQualityModal> | null>(null);
    const delQualityModal = ref<InstanceType<typeof DeleteModal> | null>(null);
    const suppSelect = useTemplateRef('suppSelect');

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const allQualities = computed(() => supplementStore.get<EoteQuality>(mode.value, 'quality'));
    const allAttachments = computed(() => supplementStore.get<EoteAttachment>(mode.value, 'attachment'));

    // Helper to find a quality definition by ID
    function getQual(qualityId : string) : EoteQuality | undefined
    {
        return allQualities.value.find((qual) => qual.id === qualityId);
    }

    // Compute qualities from attachments (quality ID -> total ranks from attachments)
    const attachmentQualityRanks = computed(() =>
    {
        return computeAttachmentQualities(props.attachmentRefs, allAttachments.value);
    });

    // Compute which attachments contribute to each quality
    const attachmentSources = computed(() =>
    {
        return computeAttachmentSources(props.attachmentRefs, allAttachments.value);
    });

    // Build a lookup map for quality names (for efficient sorting)
    const qualityNameMap = computed(() =>
    {
        const map = new Map<string, string>();
        for(const qual of allQualities.value)
        {
            if(qual.id) { map.set(qual.id, qual.name); }
        }
        return map;
    });

    // Merge base qualities with attachment qualities
    const selectedQualities = computed({
        get()
        {
            // Start with base qualities
            const qualityMap = new Map<string, EoteQualityRef>();
            for(const qual of props.qualities)
            {
                qualityMap.set(qual.id, { ...qual });
            }

            // Add attachment-only qualities (those not in base)
            for(const [ qualityId ] of attachmentQualityRanks.value)
            {
                if(!qualityMap.has(qualityId))
                {
                    const qualDef = getQual(qualityId);
                    qualityMap.set(qualityId, {
                        id: qualityId,
                        ranks: qualDef?.ranked ? 0 : undefined,
                    });
                }
            }

            // Sort by quality name using pre-built lookup map
            return Array.from(qualityMap.values()).sort((qualA, qualB) =>
            {
                const nameA = qualityNameMap.value.get(qualA.id) ?? '';
                const nameB = qualityNameMap.value.get(qualB.id) ?? '';
                return nameA.localeCompare(nameB);
            });
        },
        set(val)
        {
            // Filter out qualities that only exist from attachments (baseRanks = 0)
            const filtered = val.filter((qual) =>
            {
                const qualDef = getQual(qual.id);
                const baseRanks = qual.ranks ?? (qualDef?.ranked ? 0 : 1);
                return baseRanks > 0;
            });
            emit('update:qualities', filtered);
        },
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function isAttachmentOnly(instance : { id ?: string; ranks ?: number }) : boolean
    {
        if(!instance.id) { return false; }

        // Check if this quality exists in base qualities
        const existsInBase = props.qualities.some((qual) => qual.id === instance.id);
        if(!existsInBase)
        {
            // Not in base, must be attachment-only
            return true;
        }

        // Exists in base - check if it has any base ranks
        const baseQual = props.qualities.find((qual) => qual.id === instance.id);
        const qualDef = getQual(instance.id);
        const baseRanks = baseQual?.ranks ?? (qualDef?.ranked ? 0 : 1);

        return baseRanks === 0;
    }

    function onQualityAdd(quality : { id ?: string }) : void
    {
        if(!quality.id) { return; }

        const newQual : EoteQualityRef = { id: quality.id };
        const qualDef = getQual(quality.id);

        if(qualDef?.ranked)
        {
            newQual.ranks = 1;
        }

        // Update to uniq'd version of the array
        selectedQualities.value = uniqBy([ ...selectedQualities.value, newQual ], 'id');
    }

    function onQualityRemove(quality : { id ?: string }) : void
    {
        if(!quality.id) { return; }

        // If quality only exists from attachments (no base ranks), set base ranks to 0 instead of removing
        const existing = props.qualities.find((qual) => qual.id === quality.id);
        if(!existing || (existing.ranks ?? 1) === 0)
        {
            // Quality only exists from attachments - just set ranks to 0 (will be filtered out in setter)
            const updated = selectedQualities.value.map((qual) =>
            {
                if(qual.id === quality.id)
                {
                    const qualDef = getQual(qual.id);
                    return { ...qual, ranks: qualDef?.ranked ? 0 : undefined };
                }
                return qual;
            });
            selectedQualities.value = updated;
        }
        else
        {
            // Has base ranks - remove normally
            selectedQualities.value = selectedQualities.value.filter((qual) => qual.id !== quality.id);
        }
    }

    function onQualityNew() : void
    {
        addEditQualityModal.value?.show();
    }

    function onQualityEdit(quality : EoteQuality) : void
    {
        addEditQualityModal.value?.show(quality);
    }

    function onQualityDelete(quality : EoteQuality) : void
    {
        delQuality.value.id = quality.id;
        delQuality.value.name = quality.name;

        delQualityModal.value?.show();
    }

    function onDelQualityHidden() : void
    {
        delQuality.value.id = undefined;
        delQuality.value.name = undefined;
    }

    async function onDelQualityDelete() : Promise<void>
    {
        suppSelect.value?.clearSelection();

        if(delQuality.value.id)
        {
            await supplementStore.remove(mode.value, 'quality', delQuality.value.id);
        }

        selectedQualities.value = selectedQualities.value.filter((item) => item.id !== delQuality.value.id);
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
