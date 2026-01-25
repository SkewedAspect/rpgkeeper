<!----------------------------------------------------------------------------------------------------------------------
  -- Attachment Tag
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <span class="eote-attachment">
        <BBadge :id="uniqueID" variant="info">
            {{ attachmentName }}
        </BBadge>
        <BPopover :title="attachmentName" :target="uniqueID" triggers="hover" placement="top" teleport-to="body">
            <div :class="`${ mode }-system`">
                <div v-if="attachment" class="mb-2">
                    <span class="text-muted">HP Required:</span> {{ attachment.hpRequired }}
                    <span class="ms-3 text-muted">Rarity:</span> {{ attachment.rarity }}
                </div>
                <div v-if="attachment?.baseModifier" class="mb-2">
                    <span class="fw-bold">Base Modifier:</span>
                    <MarkdownBlock :text="formatModDescription(attachment.baseModifier)" inline />
                </div>
                <div v-if="hasModOptions" class="mb-2">
                    <span class="fw-bold">Mod Options:</span>
                    <ul class="mb-0 ps-3">
                        <li v-for="(mod, index) in attachment?.modOptions ?? []" :key="index">
                            <Fa v-if="isModActivated(index)" icon="check" class="text-success me-1" />
                            <MarkdownBlock
                                :text="formatModDescription(mod)"
                                :class="{ 'text-muted': !isModActivated(index) }"
                                inline
                            />
                        </li>
                    </ul>
                </div>
                <MarkdownBlock v-if="attachment?.description" :text="attachment.description" inline />
                <ReferenceBlock
                    v-if="attachmentReference"
                    class="float-end mt-2 mb-2"
                    :reference="attachmentReference"
                />
            </div>
        </BPopover>
    </span>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .eote-attachment {
        cursor: pointer;

        & + .eote-attachment {
            margin-left: 0.25rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import type { BaseQuality, EoteAttachment, EoteModOption } from '../../../models.ts';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import ReferenceBlock from '@client/components/character/referenceBlock.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';

    // Utils
    import { shortID } from '@client/lib/utils/misc';
    import { getModDescription } from '../../lib/qualityUtils';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        id : string;
        activatedMods ?: number[];
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const uniqueID = ref(shortID());

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');

    const allAttachments = computed(() => supplementStore.get<EoteAttachment>(mode.value, 'attachment'));
    const allQualities = computed(() => supplementStore.get<BaseQuality>(mode.value, 'quality'));

    const attachment = computed(() => allAttachments.value.find((att) => att.id === props.id));
    const hasModOptions = computed(() => (attachment.value?.modOptions?.length ?? 0) > 0);
    const attachmentName = computed(() => attachment.value?.name ?? 'Unknown Attachment');
    const attachmentReference = computed(() => attachment.value?.reference ?? '');

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function formatModDescription(mod : EoteModOption) : string
    {
        return getModDescription(mod, allQualities.value);
    }

    function isModActivated(index : number) : boolean
    {
        return props.activatedMods?.includes(index) ?? false;
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
