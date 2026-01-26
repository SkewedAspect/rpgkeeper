<!----------------------------------------------------------------------------------------------------------------------
  -- News Post Page (Single Post View)
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="news-post-page" class="container p-3">
        <!-- Back Link -->
        <RouterLink to="/news" class="text-decoration-none mb-3 d-inline-block">
            <Fa icon="arrow-left" />
            Back to News
        </RouterLink>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
            <BSpinner label="Loading..." />
            <p class="text-muted mt-2">
                Loading post...
            </p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-5">
            <Fa icon="exclamation-triangle" class="text-warning" size="2x" />
            <p class="text-muted mt-2">
                {{ error }}
            </p>
            <BButton variant="primary" to="/news">
                <Fa icon="arrow-left" />
                Back to News
            </BButton>
        </div>

        <!-- Post Content -->
        <article v-else-if="post" class="post-content">
            <header class="mb-4">
                <h1>{{ post.title }}</h1>
                <p class="text-muted">
                    <Fa icon="calendar" />
                    {{ formatDate(post.publishedAt ?? post.created) }}
                </p>
            </header>

            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="post-body" v-html="renderedContent" />
        </article>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .post-content {
        max-width: 800px;
        margin: 0 auto;

        .post-body {
            line-height: 1.7;

            :deep(h2) {
                margin-top: 2rem;
                margin-bottom: 1rem;
            }

            :deep(h3) {
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
            }

            :deep(p) {
                margin-bottom: 1rem;
            }

            :deep(ul), :deep(ol) {
                margin-bottom: 1rem;
            }

            :deep(code) {
                background-color: rgba(0, 0, 0, 0.05);
                padding: 0.2em 0.4em;
                border-radius: 3px;
            }

            :deep(pre) {
                background-color: rgba(0, 0, 0, 0.05);
                padding: 1rem;
                border-radius: 5px;
                overflow-x: auto;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, onMounted, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { marked } from 'marked';

    // Models
    import type { Post } from '@rpgk/core';

    // Resource Access
    import newsRA from '../lib/resource-access/news.ts';

    //------------------------------------------------------------------------------------------------------------------

    const route = useRoute();

    const post = ref<Post | null>(null);
    const loading = ref(true);
    const error = ref<string | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const slug = computed(() => route.params.slug as string);

    const renderedContent = computed(() =>
    {
        if(!post.value)
        {
            return '';
        }
        return marked(post.value.content);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function formatDate(timestamp : number | null) : string
    {
        if(!timestamp)
        {
            return 'Unknown date';
        }
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    async function loadPost() : Promise<void>
    {
        loading.value = true;
        error.value = null;

        try
        {
            post.value = await newsRA.getPostBySlug(slug.value);
        }
        catch(err)
        {
            console.error('Failed to load post:', err);
            error.value = 'Post not found.';
            post.value = null;
        }
        finally
        {
            loading.value = false;
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Watchers
    //------------------------------------------------------------------------------------------------------------------

    watch(slug, () =>
    {
        loadPost();
    });

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle
    //------------------------------------------------------------------------------------------------------------------

    onMounted(() =>
    {
        loadPost();
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
