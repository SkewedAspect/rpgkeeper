<!----------------------------------------------------------------------------------------------------------------------
  -- A List Card Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard no-body>
        <!-- Slot Pass through -->
        <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
        </template>

        <!-- Loading -->
        <LoadingWidget v-if="props.loading" />

        <!-- List Group -->
        <BListGroup v-else-if="hasItems" flush>
            <BListGroupItem v-for="(item, index) in items" :key="index" :to="item.to">
                <slot name="item" :item="item" :index="item">
                    {{ JSON.stringify(item) }}
                </slot>
            </BListGroupItem>
        </BListGroup>

        <!-- No Items -->
        <div v-else>
            <slot name="no-items">
                <div class="text-center text-muted">
                    No items to display.
                </div>
            </slot>
        </div>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script setup lang="ts" generic="T">
    import { computed } from 'vue';
    import RpgkCard from './rpgkCard.vue';
    import LoadingWidget from './loadingWidget.vue';

    //------------------------------------------------------------------------------------------------------------------

    type ListItem = T & { to ?: string };

    const props = withDefaults(
        defineProps<{
            items : ListItem[];
            loading ?: boolean;
        }>(),
        {
            loading: false,
        }
    );

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const items = computed(() => props.items);
    const hasItems = computed(() => items.value && items.value.length > 0);

</script>

<!--------------------------------------------------------------------------------------------------------------------->
