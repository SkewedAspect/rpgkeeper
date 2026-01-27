<!----------------------------------------------------------------------------------------------------------------------
  -- Post Edit Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BModal
        v-model="visible"
        :title="isEdit ? 'Edit Post' : 'New Post'"
        header-bg-variant="dark"
        header-text-variant="white"
        size="xl"
        no-close-on-esc
        no-close-on-backdrop
        @ok="onSave"
        @hidden="onHidden"
    >
        <BFormGroup label="Title" label-class="fw-bold" label-for="title-input">
            <BFormInput id="title-input" v-model="title" autocomplete="off" />
        </BFormGroup>

        <BFormRow class="mt-3">
            <BCol cols="6">
                <BFormGroup label-class="fw-bold" label-for="slug-input">
                    <template #label>
                        <div class="d-flex justify-content-between align-items-center">
                            <span>
                                Slug (URL)
                                <BBadge v-if="isSlugCustom" variant="secondary" class="ms-1">
                                    custom
                                </BBadge>
                            </span>
                            <BButton
                                v-if="isSlugCustom"
                                size="sm"
                                variant="outline-secondary"
                                title="Reset to auto-generated"
                                @click="resetSlug"
                            >
                                <Fa icon="rotate" />
                                Auto
                            </BButton>
                        </div>
                    </template>
                    <BFormInput id="slug-input" v-model="slug" autocomplete="off" />
                </BFormGroup>
            </BCol>
            <BCol cols="3">
                <BFormGroup label="Date" label-class="fw-bold" label-for="date-input">
                    <BFormInput id="date-input" v-model="publishedDate" type="date" />
                </BFormGroup>
            </BCol>
            <BCol cols="3">
                <BFormGroup label="Status" label-class="fw-bold" label-for="status-select">
                    <BFormSelect id="status-select" v-model="status" :options="statusOptions" />
                </BFormGroup>
            </BCol>
        </BFormRow>

        <BFormGroup class="mt-3" label-class="fw-bold" label-for="stinger-input">
            <template #label>
                <div class="d-flex justify-content-between align-items-center">
                    <span>Stinger (Preview Text)</span>
                    <div class="d-flex align-items-center gap-2">
                        <BFormInput
                            v-model.number="stingerMaxLength"
                            type="number"
                            size="sm"
                            style="width: 80px;"
                            min="100"
                            max="1000"
                            step="50"
                            title="Max characters"
                        />
                        <BButton
                            size="sm"
                            variant="outline-secondary"
                            :disabled="!content.trim()"
                            title="Generate from content"
                            @click="generateStinger"
                        >
                            <Fa icon="wand-magic-sparkles" />
                            Generate
                        </BButton>
                    </div>
                </div>
            </template>
            <BFormTextarea
                id="stinger-input"
                v-model="stinger"
                rows="3"
                placeholder="A brief summary shown in the post list..."
            />
        </BFormGroup>

        <BFormGroup class="mt-3" label="Content" label-class="fw-bold" label-for="content-input">
            <BFormTextarea
                id="content-input"
                v-model="content"
                rows="12"
                placeholder="Full post content in Markdown..."
            />
            <BFormText>
                Markdown formatting is supported.
            </BFormText>
        </BFormGroup>

        <template #footer="{ ok, cancel }">
            <BButton variant="secondary" @click="cancel">
                <Fa icon="times" />
                Cancel
            </BButton>
            <BButton variant="primary" :disabled="!isValid" @click="ok">
                <Fa icon="save" />
                Save
            </BButton>
        </template>
    </BModal>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, watch } from 'vue';

    // Models
    import type { Post, PostStatus } from '@rpgk/core';

    // Stores
    import { useNewsStore } from '../../lib/resource-access/stores/news.ts';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        show : boolean;
        post ?: Post | null;
    }

    const props = withDefaults(defineProps<Props>(), {
        post: null,
    });

    const emit = defineEmits<{
        'update:show' : [value: boolean];
        'saved' : [];
        'hidden' : [];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const newsStore = useNewsStore();

    const title = ref('');
    const slug = ref('');
    const slugManuallyEdited = ref(false);
    const stinger = ref('');
    const stingerMaxLength = ref(300);
    const content = ref('');
    const status = ref<PostStatus>('draft');
    const publishedDate = ref('');

    const statusOptions = [
        { value: 'draft', text: 'Draft' },
        { value: 'published', text: 'Published' },
        { value: 'archived', text: 'Archived' },
    ];

    //------------------------------------------------------------------------------------------------------------------
    // Helpers
    //------------------------------------------------------------------------------------------------------------------

    function slugify(text : string) : string
    {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    }

    function formatDateForInput(date : Date) : string
    {
        return date.toISOString()
            .split('T')[0];
    }

    function timestampToDateString(timestamp : number) : string
    {
        return formatDateForInput(new Date(timestamp * 1000));
    }

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const visible = computed({
        get: () => props.show,
        set: (value) => emit('update:show', value),
    });

    const isEdit = computed(() => props.post !== null);
    const isValid = computed(() => title.value.trim() !== '' && stinger.value.trim() !== '');
    const isSlugCustom = computed(() => slug.value !== slugify(title.value));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function resetSlug() : void
    {
        slug.value = slugify(title.value);
        slugManuallyEdited.value = false;
    }

    function extractFootnoteDefinitions(text : string) : Map<string, string>
    {
        const definitions = new Map<string, string>();
        const regex = /^\[([^\]]+)\]:\s+(.+)$/gm;
        let match;
        while((match = regex.exec(text)) !== null)
        {
            definitions.set(match[1].toLowerCase(), match[0]);
        }
        return definitions;
    }

    function findFootnoteReferences(text : string) : string[]
    {
        const refs : string[] = [];
        // Match [text] that's not followed by ( or : (so not inline links or definitions)
        const regex = /\[([^\]]+)\](?!\(|:)/g;
        let match;
        while((match = regex.exec(text)) !== null)
        {
            refs.push(match[1].toLowerCase());
        }
        return [ ...new Set(refs) ]; // Unique
    }

    function cleanupTruncatedMarkdown(text : string) : string
    {
        let result = text;

        // Remove incomplete link at end: [text] or [text]( or [text](url
        const lastOpenBracket = result.lastIndexOf('[');
        if(lastOpenBracket !== -1)
        {
            const afterBracket = result.slice(lastOpenBracket);
            // Check if this is a complete markdown link or footnote ref
            if(!(/\[[^\]]+\](\([^)]+\))?$/.test(afterBracket)))
            {
                // Incomplete - remove it
                result = result.slice(0, lastOpenBracket).trim();
            }
        }

        // Remove incomplete bold/italic at end
        const trailingMarkers = result.match(/[*_]+$/);
        if(trailingMarkers)
        {
            result = result.slice(0, -trailingMarkers[0].length).trim();
        }

        return result;
    }

    function generateStinger() : void
    {
        if(!content.value.trim())
        {
            return;
        }

        // Extract all footnote definitions from the full content
        const footnoteDefinitions = extractFootnoteDefinitions(content.value);

        // Clean up the content but keep markdown formatting
        let text = content.value
            // Remove headers (keep the text)
            .replace(/^#{1,6}\s+/gm, '')
            // Remove images entirely
            .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
            // Remove code blocks
            .replace(/```[\s\S]*?```/g, '')
            // Remove blockquotes marker
            .replace(/^>\s+/gm, '')
            // Remove horizontal rules
            .replace(/^[-*_]{3,}$/gm, '')
            // Remove footnote definitions (we'll add back the ones we need)
            .replace(/^\[[^\]]+\]:\s+.+$/gm, '')
            // Collapse multiple newlines
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        // Try to get first paragraph
        const firstParagraph = text.split(/\n\n/)[0] ?? text;

        // Truncate if needed
        const maxLength = stingerMaxLength.value;
        let result : string;
        if(firstParagraph.length <= maxLength)
        {
            result = firstParagraph;
        }
        else
        {
            // Truncate at word boundary
            const truncated = firstParagraph.slice(0, maxLength);
            const lastSpace = truncated.lastIndexOf(' ');
            result = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;

            // Clean up any broken markdown from truncation
            result = cleanupTruncatedMarkdown(result);
            result = `${ result }...`;
        }

        // Find footnote references used in the result and append their definitions
        const usedRefs = findFootnoteReferences(result);
        const neededDefinitions = usedRefs
            .map((refName) => footnoteDefinitions.get(refName))
            .filter((def) : def is string => def !== undefined);

        if(neededDefinitions.length > 0)
        {
            result = `${ result }\n\n${ neededDefinitions.join('\n') }`;
        }

        stinger.value = result;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Watches
    //------------------------------------------------------------------------------------------------------------------

    watch(() => props.show, (newVal) =>
    {
        if(newVal)
        {
            if(props.post)
            {
                // Editing existing post
                title.value = props.post.title;
                slug.value = props.post.slug;
                slugManuallyEdited.value = true; // Don't auto-generate for existing posts
                stinger.value = props.post.stinger;
                content.value = props.post.content;
                status.value = props.post.status;
                // Convert unix timestamp to YYYY-MM-DD for the date input
                if(props.post.publishedAt)
                {
                    publishedDate.value = timestampToDateString(props.post.publishedAt);
                }
                else
                {
                    publishedDate.value = formatDateForInput(new Date());
                }
            }
            else
            {
                // New post
                title.value = '';
                slug.value = '';
                slugManuallyEdited.value = false;
                stinger.value = '';
                content.value = '';
                status.value = 'draft';
                publishedDate.value = formatDateForInput(new Date());
            }
        }
    });

    // Auto-generate slug from title (unless manually edited)
    watch(title, (newTitle) =>
    {
        if(!slugManuallyEdited.value)
        {
            slug.value = slugify(newTitle);
        }
    });

    // Track manual slug edits
    watch(slug, (newSlug, oldSlug) =>
    {
        // If the slug changed and it doesn't match what we'd auto-generate, mark as manually edited
        if(newSlug !== slugify(title.value) && oldSlug !== newSlug)
        {
            slugManuallyEdited.value = true;
        }
    });

    //------------------------------------------------------------------------------------------------------------------
    // Event Handlers
    //------------------------------------------------------------------------------------------------------------------

    async function onSave() : Promise<void>
    {
        // Convert date string to unix timestamp (set to noon UTC to avoid timezone issues)
        const publishedAt = publishedDate.value
            ? new Date(`${ publishedDate.value }T12:00:00Z`).getTime() / 1000
            : null;

        const postData = {
            title: title.value,
            stinger: stinger.value,
            content: content.value,
            status: status.value,
            publishedAt,
            ...(slug.value.trim() ? { slug: slug.value } : {}),
        };

        if(isEdit.value && props.post)
        {
            await newsStore.updatePost(props.post.id, postData);
        }
        else
        {
            await newsStore.createPost(postData);
        }

        emit('saved');
    }

    function onHidden() : void
    {
        // Reset form
        title.value = '';
        slug.value = '';
        slugManuallyEdited.value = false;
        stinger.value = '';
        stingerMaxLength.value = 300;
        content.value = '';
        status.value = 'draft';
        publishedDate.value = '';

        emit('hidden');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
