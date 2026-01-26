<!----------------------------------------------------------------------------------------------------------------------
  -- Admin Posts Page
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="admin-posts-page" class="container p-3">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <RouterLink to="/admin" class="text-decoration-none">
                    <Fa icon="arrow-left" />
                    Admin
                </RouterLink>
                <h1 class="mt-2">
                    <Fa icon="newspaper" />
                    Manage Posts
                </h1>
            </div>
            <BButton variant="success" @click="showPostModal = true">
                <Fa icon="plus" />
                New Post
            </BButton>
        </div>

        <!-- Not authorized -->
        <div v-if="!isAdmin" class="text-center py-5">
            <Fa icon="lock" class="text-warning" size="3x" />
            <h3 class="mt-3">
                Access Denied
            </h3>
            <p class="text-muted">
                You do not have permission to view this page.
            </p>
        </div>

        <!-- Posts List -->
        <div v-else>
            <div v-if="newsStore.postsStatus === 'loading'" class="text-center py-5">
                <BSpinner label="Loading..." />
            </div>

            <div v-else-if="newsStore.posts.length === 0" class="text-center py-5 text-muted">
                <Fa icon="newspaper" size="3x" class="mb-3" />
                <p>No posts yet. Create your first post!</p>
            </div>

            <BListGroup v-else>
                <BListGroupItem
                    v-for="post in newsStore.posts"
                    :key="post.id"
                    class="d-flex justify-content-between align-items-center"
                >
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center gap-2">
                            <span class="fw-medium">{{ post.title }}</span>
                            <BBadge :variant="getStatusVariant(post.status)" class="text-uppercase" style="font-size: 0.7em;">
                                {{ post.status }}
                            </BBadge>
                        </div>
                        <small class="text-muted">
                            {{ formatDate(post.publishedAt ?? post.created) }}
                        </small>
                    </div>
                    <div class="d-flex gap-2">
                        <BButton
                            v-if="post.status === 'draft'"
                            size="sm"
                            variant="success"
                            title="Publish"
                            @click="publishPost(post)"
                        >
                            <Fa icon="check" />
                            Publish
                        </BButton>
                        <BButton
                            v-if="post.status === 'published'"
                            size="sm"
                            variant="outline-secondary"
                            title="Archive"
                            @click="archivePost(post)"
                        >
                            <Fa icon="archive" />
                        </BButton>
                        <BButton
                            v-if="post.status === 'archived'"
                            size="sm"
                            variant="outline-success"
                            title="Restore to Draft"
                            @click="restorePost(post)"
                        >
                            <Fa icon="undo" />
                        </BButton>
                        <BButton size="sm" variant="outline-primary" title="Edit" @click="editPost(post)">
                            <Fa icon="edit" />
                        </BButton>
                        <BButton size="sm" variant="outline-danger" title="Delete" @click="confirmDeletePost(post)">
                            <Fa icon="trash" />
                        </BButton>
                    </div>
                </BListGroupItem>
            </BListGroup>
        </div>

        <!-- Post Edit Modal -->
        <PostEditModal
            v-model:show="showPostModal"
            :post="editingPost"
            @saved="onPostSaved"
            @hidden="editingPost = null"
        />

        <!-- Delete Confirmation Modal -->
        <BModal
            v-model="showDeleteModal"
            title="Delete Post"
            ok-variant="danger"
            ok-title="Delete"
            @ok="deletePost"
        >
            <p>Are you sure you want to delete "{{ deletingPost?.title }}"?</p>
            <p class="text-muted">
                This action cannot be undone.
            </p>
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, onMounted, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { Post, PostStatus } from '@rpgk/core';

    // Stores
    import { useAccountStore } from '../lib/resource-access/stores/account.ts';
    import { useNewsStore } from '../lib/resource-access/stores/news.ts';

    // Components
    import PostEditModal from '../components/news/postEditModal.vue';

    // Utils
    import { hasGroup } from '../lib/utils/permissions.ts';

    //------------------------------------------------------------------------------------------------------------------

    const accountStore = useAccountStore();
    const newsStore = useNewsStore();

    const { account } = storeToRefs(accountStore);

    const showPostModal = ref(false);
    const showDeleteModal = ref(false);
    const editingPost = ref<Post | null>(null);
    const deletingPost = ref<Post | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isAdmin = computed(() => hasGroup(account.value, 'Admins'));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    type StatusVariant = 'success' | 'warning' | 'secondary';

    function getStatusVariant(status : PostStatus) : StatusVariant
    {
        switch (status)
        {
            case 'published':
                return 'success';
            case 'draft':
                return 'warning';
            case 'archived':
            default:
                return 'secondary';
        }
    }

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

    function editPost(post : Post) : void
    {
        editingPost.value = post;
        showPostModal.value = true;
    }

    async function publishPost(post : Post) : Promise<void>
    {
        await newsStore.updatePost(post.id, { status: 'published' });
    }

    async function archivePost(post : Post) : Promise<void>
    {
        await newsStore.updatePost(post.id, { status: 'archived' });
    }

    async function restorePost(post : Post) : Promise<void>
    {
        await newsStore.updatePost(post.id, { status: 'draft' });
    }

    function confirmDeletePost(post : Post) : void
    {
        deletingPost.value = post;
        showDeleteModal.value = true;
    }

    async function deletePost() : Promise<void>
    {
        if(deletingPost.value)
        {
            await newsStore.deletePost(deletingPost.value.id);
            deletingPost.value = null;
        }
    }

    function onPostSaved() : void
    {
        editingPost.value = null;
        showPostModal.value = false;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle
    //------------------------------------------------------------------------------------------------------------------

    onMounted(async () =>
    {
        if(isAdmin.value)
        {
            await newsStore.loadAllPosts();
        }
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
