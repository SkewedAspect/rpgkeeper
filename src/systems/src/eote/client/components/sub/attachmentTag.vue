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
                    <MarkdownBlock :text="attachment.baseModifier" inline />
                </div>
                <div v-if="hasModOptions" class="mb-2">
                    <span class="fw-bold">Mod Options:</span>
                    <ul class="mb-0 ps-3">
                        <li v-for="(mod, index) in attachment?.modOptions ?? []" :key="index">
                            <Fa v-if="isModActivated(index)" icon="check" class="text-success me-1" />
                            <span :class="{ 'text-muted': !isModActivated(index) }">{{ mod }}</span>
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
    import type { EoteAttachment } from '../../../models.ts';

    // Utils
    import { shortID } from '@client/lib/utils/misc';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import ReferenceBlock from '@client/components/character/referenceBlock.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';

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

    const attachments = computed(() => supplementStore.get<EoteAttachment>(mode.value, 'attachment'));

    const attachment = computed(() =>
    {
        return attachments.value?.filter((att) => att.id === props.id)[0];
    });

    const hasModOptions = computed(() =>
    {
        return attachment.value?.modOptions && attachment.value.modOptions.length > 0;
    });

    const attachmentName = computed(() =>
    {
        if(attachment.value)
        {
            return attachment.value.name;
        }

        return 'Unknown Attachment';
    });

    const attachmentReference = computed(() =>
    {
        if(attachment.value?.reference)
        {
            return attachment.value.reference;
        }

        return '';
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function isModActivated(index : number) : boolean
    {
        return props.activatedMods?.includes(index) ?? false;
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
