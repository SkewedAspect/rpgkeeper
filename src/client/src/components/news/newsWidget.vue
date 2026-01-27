<!----------------------------------------------------------------------------------------------------------------------
  -- News Widget (Recent Updates)
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BCard class="news-widget">
        <template #header>
            <h5 class="mb-0">
                <Fa icon="newspaper" />
                Recent Updates
            </h5>
        </template>

        <div v-if="newsStore.postsStatus === 'loading'" class="text-center py-3">
            <BSpinner label="Loading..." size="sm" />
        </div>

        <div v-else-if="newsStore.recentPosts.length === 0" class="text-center py-3 text-muted">
            No news yet.
        </div>

        <BListGroup v-else flush>
            <BListGroupItem
                v-for="post in newsStore.recentPosts"
                :key="post.id"
                :to="`/news/${ post.slug }`"
                class="news-item"
            >
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">
                            {{ post.title }}
                        </h6>
                        <small class="text-muted">{{ formatDate(post.publishedAt) }}</small>
                    </div>
                    <Fa icon="arrow-right" class="text-muted mt-1" />
                </div>
            </BListGroupItem>
        </BListGroup>

        <template #footer>
            <RouterLink to="/news" class="text-decoration-none">
                View all news
                <Fa icon="arrow-right" />
            </RouterLink>
        </template>
    </BCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .news-widget {
        .news-item {
            cursor: pointer;
            transition: background-color 0.15s ease;

            &:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { onMounted } from 'vue';

    // Stores
    import { useNewsStore } from '../../lib/resource-access/stores/news.ts';

    //------------------------------------------------------------------------------------------------------------------

    const newsStore = useNewsStore();

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function formatDate(timestamp : number | null) : string
    {
        if(!timestamp)
        {
            return '';
        }
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle
    //------------------------------------------------------------------------------------------------------------------

    onMounted(async () =>
    {
        if(newsStore.postsStatus === 'unloaded')
        {
            await newsStore.loadPublished();
        }
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
