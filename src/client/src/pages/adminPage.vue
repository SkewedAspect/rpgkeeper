<!----------------------------------------------------------------------------------------------------------------------
  -- Admin Dashboard
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="admin-page" class="container p-3">
        <h1>
            <Fa icon="user-gear" />
            Admin
        </h1>

        <!-- Not authorized -->
        <div v-if="!isAdmin" class="text-center py-5">
            <Fa icon="lock" class="text-warning" size="3x" />
            <h3 class="mt-3">
                Access Denied
            </h3>
            <p class="text-muted">
                You do not have permission to view this page.
            </p>
            <BButton variant="primary" to="/">
                <Fa icon="home" />
                Go Home
            </BButton>
        </div>

        <!-- Admin Content -->
        <div v-else class="mt-4">
            <!-- Stats Row -->
            <BRow class="mb-4">
                <BCol sm="6" md="3" class="mb-3">
                    <div class="stat-card">
                        <div class="stat-value">
                            {{ userCount }}
                        </div>
                        <div class="stat-label">
                            Users
                        </div>
                    </div>
                </BCol>
                <BCol sm="6" md="3" class="mb-3">
                    <div class="stat-card">
                        <div class="stat-value">
                            {{ characterCount }}
                        </div>
                        <div class="stat-label">
                            Characters
                        </div>
                    </div>
                </BCol>
                <BCol sm="6" md="3" class="mb-3">
                    <div class="stat-card">
                        <div class="stat-value">
                            {{ publishedCount }}
                        </div>
                        <div class="stat-label">
                            Published Posts
                        </div>
                    </div>
                </BCol>
                <BCol sm="6" md="3" class="mb-3">
                    <div class="stat-card">
                        <div class="stat-value">
                            {{ activeAlertCount }}
                        </div>
                        <div class="stat-label">
                            Active Alerts
                        </div>
                    </div>
                </BCol>
            </BRow>

            <!-- Management Links -->
            <h5 class="text-muted mb-3">
                Manage
            </h5>
            <BRow>
                <!-- Posts -->
                <BCol md="6" class="mb-4">
                    <RouterLink to="/admin/posts" class="text-decoration-none">
                        <BCard class="h-100 nav-card">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="nav-card-icon bg-primary">
                                        <Fa icon="newspaper" size="lg" />
                                    </div>
                                    <div>
                                        <h5 class="mb-1">
                                            Posts
                                        </h5>
                                        <div class="d-flex gap-1">
                                            <BBadge variant="success">
                                                {{ publishedCount }} published
                                            </BBadge>
                                            <BBadge variant="warning">
                                                {{ draftCount }} drafts
                                            </BBadge>
                                            <BBadge variant="secondary">
                                                {{ archivedCount }} archived
                                            </BBadge>
                                        </div>
                                    </div>
                                </div>
                                <Fa icon="chevron-right" class="text-muted" />
                            </div>
                        </BCard>
                    </RouterLink>
                </BCol>

                <!-- Alerts -->
                <BCol md="6" class="mb-4">
                    <RouterLink to="/admin/alerts" class="text-decoration-none">
                        <BCard class="h-100 nav-card">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="nav-card-icon bg-warning">
                                        <Fa icon="bell" size="lg" />
                                    </div>
                                    <div>
                                        <h5 class="mb-1">
                                            Alerts
                                        </h5>
                                        <div class="d-flex gap-1">
                                            <BBadge variant="success">
                                                {{ activeAlertCount }} active
                                            </BBadge>
                                            <BBadge variant="secondary">
                                                {{ inactiveAlertCount }} inactive
                                            </BBadge>
                                            <BBadge variant="dark">
                                                {{ expiredAlertCount }} expired
                                            </BBadge>
                                        </div>
                                    </div>
                                </div>
                                <Fa icon="chevron-right" class="text-muted" />
                            </div>
                        </BCard>
                    </RouterLink>
                </BCol>
            </BRow>

            <!-- Drafts needing attention -->
            <BCard v-if="draftPosts.length > 0" class="mt-2">
                <template #header>
                    <h5 class="mb-0">
                        <Fa icon="edit" class="text-warning" />
                        Drafts needing attention
                    </h5>
                </template>
                <BListGroup flush>
                    <BListGroupItem
                        v-for="post in draftPosts"
                        :key="post.id"
                        class="d-flex justify-content-between align-items-center"
                        action
                        @click="$router.push('/admin/posts')"
                    >
                        <span>{{ post.title }}</span>
                        <small class="text-muted">{{ formatDate(post.created) }}</small>
                    </BListGroupItem>
                </BListGroup>
            </BCard>
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .stat-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 1rem;
        text-align: center;

        .stat-value {
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.2;
        }

        .stat-label {
            font-size: 0.85rem;
            color: var(--bs-secondary-color);
        }
    }

    .nav-card {
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
    }

    .nav-card-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, onMounted, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useAccountStore } from '../lib/resource-access/stores/account.ts';
    import { useNewsStore } from '../lib/resource-access/stores/news.ts';

    // Utils
    import { hasGroup } from '../lib/utils/permissions.ts';

    // Resource Access
    import statsRA from '../lib/resource-access/stats.ts';

    //------------------------------------------------------------------------------------------------------------------

    const accountStore = useAccountStore();
    const newsStore = useNewsStore();

    const { account } = storeToRefs(accountStore);

    const userCount = ref(0);
    const characterCount = ref(0);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isAdmin = computed(() => hasGroup(account.value, 'Admins'));

    const draftPosts = computed(() => newsStore.posts.filter((post) => post.status === 'draft'));

    const publishedCount = computed(() => newsStore.posts.filter((post) => post.status === 'published').length);
    const draftCount = computed(() => draftPosts.value.length);
    const archivedCount = computed(() => newsStore.posts.filter((post) => post.status === 'archived').length);

    const activeAlertCount = computed(() =>
    {
        const now = Date.now() / 1000;
        return newsStore.alerts.filter((alert) =>
        {
            return alert.active && (!alert.expiresAt || alert.expiresAt > now);
        }).length;
    });

    const inactiveAlertCount = computed(() =>
    {
        const now = Date.now() / 1000;
        return newsStore.alerts.filter((alert) =>
        {
            return !alert.active && (!alert.expiresAt || alert.expiresAt > now);
        }).length;
    });

    const expiredAlertCount = computed(() =>
    {
        const now = Date.now() / 1000;
        return newsStore.alerts.filter((alert) =>
        {
            return alert.expiresAt && alert.expiresAt <= now;
        }).length;
    });

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
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle
    //------------------------------------------------------------------------------------------------------------------

    onMounted(async () =>
    {
        if(isAdmin.value)
        {
            await newsStore.loadAllPosts();
            await newsStore.loadAllAlerts();

            // Load stats
            const stats = await statsRA.getAdminStats();
            userCount.value = stats.users;
            characterCount.value = stats.characters;
        }
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
