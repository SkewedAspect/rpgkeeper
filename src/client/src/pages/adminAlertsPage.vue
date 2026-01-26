<!----------------------------------------------------------------------------------------------------------------------
  -- Admin Alerts Page
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="admin-alerts-page" class="container p-3">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <RouterLink to="/admin" class="text-decoration-none">
                    <Fa icon="arrow-left" />
                    Admin
                </RouterLink>
                <h1 class="mt-2">
                    <Fa icon="bell" />
                    Manage Alerts
                </h1>
            </div>
            <BButton variant="success" @click="showAlertModal = true">
                <Fa icon="plus" />
                New Alert
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

        <!-- Alerts List -->
        <div v-else>
            <div v-if="newsStore.alertsStatus === 'loading'" class="text-center py-5">
                <BSpinner label="Loading..." />
            </div>

            <div v-else-if="newsStore.alerts.length === 0" class="text-center py-5 text-muted">
                <Fa icon="bell" size="3x" class="mb-3" />
                <p>No alerts yet. Alerts are used for important site-wide announcements.</p>
            </div>

            <BListGroup v-else>
                <BListGroupItem
                    v-for="alert in newsStore.alerts"
                    :key="alert.id"
                    class="d-flex justify-content-between align-items-center"
                >
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center gap-2">
                            <BBadge :variant="getLevelVariant(alert.level)">
                                {{ alert.level }}
                            </BBadge>
                            <span :class="{ 'text-muted': !alert.active }">
                                {{ alert.message }}
                            </span>
                            <BBadge v-if="!alert.active" variant="secondary">
                                Inactive
                            </BBadge>
                            <BBadge v-if="isExpired(alert)" variant="dark">
                                Expired
                            </BBadge>
                        </div>
                        <small v-if="alert.expiresAt" class="text-muted">
                            Expires: {{ formatDate(alert.expiresAt) }}
                        </small>
                    </div>
                    <div class="d-flex gap-2">
                        <BButton
                            size="sm"
                            :variant="alert.active ? 'outline-secondary' : 'success'"
                            :title="alert.active ? 'Deactivate' : 'Activate'"
                            @click="toggleAlertActive(alert)"
                        >
                            <Fa :icon="alert.active ? 'eye-slash' : 'eye'" />
                            {{ alert.active ? 'Deactivate' : 'Activate' }}
                        </BButton>
                        <BButton size="sm" variant="outline-primary" title="Edit" @click="editAlert(alert)">
                            <Fa icon="edit" />
                        </BButton>
                        <BButton size="sm" variant="outline-danger" title="Delete" @click="confirmDeleteAlert(alert)">
                            <Fa icon="trash" />
                        </BButton>
                    </div>
                </BListGroupItem>
            </BListGroup>
        </div>

        <!-- Alert Edit Modal -->
        <AlertEditModal
            v-model:show="showAlertModal"
            :alert="editingAlert"
            @saved="onAlertSaved"
        />

        <!-- Delete Confirmation Modal -->
        <BModal
            v-model="showDeleteModal"
            title="Delete Alert"
            ok-variant="danger"
            ok-title="Delete"
            @ok="deleteAlert"
        >
            <p>Are you sure you want to delete this alert?</p>
            <p class="text-muted">
                "{{ deletingAlert?.message }}"
            </p>
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, onMounted, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { Alert, AlertLevel } from '@rpgk/core';

    // Stores
    import { useAccountStore } from '../lib/resource-access/stores/account.ts';
    import { useNewsStore } from '../lib/resource-access/stores/news.ts';

    // Components
    import AlertEditModal from '../components/news/alertEditModal.vue';

    // Utils
    import { hasGroup } from '../lib/utils/permissions.ts';

    //------------------------------------------------------------------------------------------------------------------

    const accountStore = useAccountStore();
    const newsStore = useNewsStore();

    const { account } = storeToRefs(accountStore);

    const showAlertModal = ref(false);
    const showDeleteModal = ref(false);
    const editingAlert = ref<Alert | null>(null);
    const deletingAlert = ref<Alert | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isAdmin = computed(() => hasGroup(account.value, 'Admins'));

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    type AlertVariant = 'info' | 'warning' | 'danger';

    function getLevelVariant(level : AlertLevel) : AlertVariant
    {
        switch (level)
        {
            case 'warning':
                return 'warning';
            case 'danger':
                return 'danger';
            case 'info':
            default:
                return 'info';
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

    function isExpired(alert : Alert) : boolean
    {
        if(!alert.expiresAt)
        {
            return false;
        }
        return alert.expiresAt < Date.now() / 1000;
    }

    async function toggleAlertActive(alert : Alert) : Promise<void>
    {
        await newsStore.updateAlert(alert.id, { active: !alert.active });
    }

    function editAlert(alert : Alert) : void
    {
        editingAlert.value = alert;
        showAlertModal.value = true;
    }

    function confirmDeleteAlert(alert : Alert) : void
    {
        deletingAlert.value = alert;
        showDeleteModal.value = true;
    }

    async function deleteAlert() : Promise<void>
    {
        if(deletingAlert.value)
        {
            await newsStore.deleteAlert(deletingAlert.value.id);
            deletingAlert.value = null;
        }
    }

    function onAlertSaved() : void
    {
        editingAlert.value = null;
        showAlertModal.value = false;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle
    //------------------------------------------------------------------------------------------------------------------

    onMounted(async () =>
    {
        if(isAdmin.value)
        {
            await newsStore.loadAllAlerts();
        }
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
