<!----------------------------------------------------------------------------------------------------------------------
  -- Alert Banner
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div v-if="activeAlerts.length > 0" class="alert-banner-container">
        <BAlert
            v-for="alert in activeAlerts"
            :key="alert.id"
            :variant="getVariant(alert.level)"
            class="alert-banner mb-0 rounded-0"
            dismissible
            @dismissed="dismissAlert(alert.id)"
        >
            <div class="d-flex justify-content-center align-items-center gap-2">
                <Fa :icon="getIcon(alert.level)" />
                <span>{{ alert.message }}</span>
                <a v-if="alert.link" :href="alert.link" target="_blank" class="alert-link">
                    Learn more
                    <Fa icon="external-link" />
                </a>
            </div>
        </BAlert>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .alert-banner-container {
        position: sticky;
        top: 50px; // Below the fixed navbar
        z-index: 1020;
    }

    .alert-banner {
        text-align: center;
        border: none;
        border-radius: 0;
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, onMounted, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Models
    import type { AlertLevel } from '@rpgk/core';

    // Stores
    import { useNewsStore } from '../../lib/resource-access/stores/news.ts';

    //------------------------------------------------------------------------------------------------------------------

    const newsStore = useNewsStore();
    const { alerts } = storeToRefs(newsStore);

    const dismissedAlerts = ref<Set<string>>(new Set());

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const activeAlerts = computed(() =>
    {
        const now = Date.now() / 1000;
        return alerts.value.filter((alert) =>
        {
            // Skip dismissed alerts
            if(dismissedAlerts.value.has(alert.id))
            {
                return false;
            }

            // Skip inactive alerts
            if(!alert.active)
            {
                return false;
            }

            // Skip expired alerts
            if(alert.expiresAt && alert.expiresAt < now)
            {
                return false;
            }

            return true;
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    type AlertVariant = 'info' | 'warning' | 'danger';

    function getVariant(level : AlertLevel) : AlertVariant
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

    function getIcon(level : AlertLevel) : string
    {
        switch (level)
        {
            case 'warning':
                return 'exclamation-triangle';
            case 'danger':
                return 'exclamation-circle';
            case 'info':
            default:
                return 'info-circle';
        }
    }

    function dismissAlert(alertId : string) : void
    {
        dismissedAlerts.value.add(alertId);

        // Store dismissed alerts in sessionStorage so they stay dismissed for the session
        try
        {
            const stored = JSON.parse(sessionStorage.getItem('dismissedAlerts') ?? '[]');
            stored.push(alertId);
            sessionStorage.setItem('dismissedAlerts', JSON.stringify(stored));
        }
        catch
        {
            // Ignore storage errors
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle
    //------------------------------------------------------------------------------------------------------------------

    onMounted(async () =>
    {
        // Load dismissed alerts from sessionStorage
        try
        {
            const stored = JSON.parse(sessionStorage.getItem('dismissedAlerts') ?? '[]');
            dismissedAlerts.value = new Set(stored);
        }
        catch
        {
            // Ignore storage errors
        }

        // Load alerts
        await newsStore.loadActiveAlerts();
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
