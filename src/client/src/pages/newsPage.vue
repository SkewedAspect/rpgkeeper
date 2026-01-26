<!----------------------------------------------------------------------------------------------------------------------
  -- News Page
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="news-page" class="container p-3">
        <h1 class="mb-4">
            <Fa icon="newspaper" />
            News
        </h1>

        <!-- Loading State -->
        <div v-if="newsStore.postsStatus === 'loading'" class="text-center py-5">
            <BSpinner label="Loading..." />
            <p class="text-muted mt-2">
                Loading posts...
            </p>
        </div>

        <!-- Error State -->
        <div v-else-if="newsStore.postsStatus === 'error'" class="text-center py-5">
            <Fa icon="exclamation-triangle" class="text-warning" size="2x" />
            <p class="text-muted mt-2">
                Failed to load posts.
            </p>
            <BButton variant="primary" @click="newsStore.loadPublished()">
                <Fa icon="refresh" />
                Retry
            </BButton>
        </div>

        <!-- Posts List -->
        <div v-else>
            <div v-if="newsStore.publishedPosts.length === 0" class="text-center py-5">
                <Fa icon="newspaper" class="text-muted" size="2x" />
                <p class="text-muted mt-2">
                    No posts yet.
                </p>
            </div>

            <div v-else class="posts-list">
                <BCard
                    v-for="post in newsStore.publishedPosts"
                    :key="post.id"
                    class="mb-3 post-card"
                >
                    <template #header>
                        <div>
                            <h4 class="mb-0">
                                <RouterLink :to="`/news/${ post.slug }`">
                                    {{ post.title }}
                                </RouterLink>
                            </h4>
                            <small class="text-muted">
                                {{ formatDate(post.publishedAt ?? post.created) }}
                            </small>
                        </div>
                    </template>

                    <MarkdownBlock :text="post.stinger" class="post-stinger mb-3" block />

                    <RouterLink :to="`/news/${ post.slug }`" class="btn btn-sm btn-outline-primary">
                        Read More
                        <Fa icon="arrow-right" />
                    </RouterLink>
                </BCard>
            </div>
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { onMounted } from 'vue';

    // Stores
    import { useNewsStore } from '../lib/resource-access/stores/news.ts';

    // Components
    import MarkdownBlock from '../components/ui/markdownBlock.vue';

    //------------------------------------------------------------------------------------------------------------------

    const newsStore = useNewsStore();

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

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle
    //------------------------------------------------------------------------------------------------------------------

    onMounted(async () =>
    {
        await newsStore.loadPublished();
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
