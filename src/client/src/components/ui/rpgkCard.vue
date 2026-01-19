<!----------------------------------------------------------------------------------------------------------------------
  -- RPGKeeper Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BCard
        class="rpgkeeper-card shadow-sm"
        :align="align"
        header-bg-variant="dark"
        header-text-variant="white"
        :class="classes"
        :no-body="noBody"
    >
        <template #header>
            <slot name="header">
                <div class="d-flex">
                    <h5 class="align-items-center d-flex text-nowrap m-0 flex-grow-0 flex-shrink-0 w-auto">
                        <Fa v-if="icon" class="me-1" :icon="icon" />
                        <span class="d-none d-md-inline">
                            {{ title }}
                        </span>
                    </h5>
                    <div class="ms-auto">
                        <slot name="header-right" />
                    </div>
                </div>
            </slot>
        </template>

        <slot />

        <template v-if="hasFooterSlot" #footer>
            <slot name="footer" />
        </template>
    </BCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .rpgkeeper-card {
        overflow: hidden;

        .card-header {
            min-height: 57px;
        }

        &.fill {
            flex: 1 1 auto;
        }

        &.fixed {
            flex: 0 0 auto;
        }

        &.grow {
            flex: 1 0 auto;
        }

        &.shrink {
            flex: 0 1 auto;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, useSlots } from 'vue';

    import type { AlignmentTextHorizontal } from 'bootstrap-vue-next';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        icon ?: string;
        title ?: string;
        noBody ?: boolean;
        align ?: AlignmentTextHorizontal;
        fill ?: boolean;
        fixed ?: boolean;
        grow ?: boolean;
        shrink ?: boolean;
    }

    const props = withDefaults(
        defineProps<Props>(),
        {
            icon: undefined,
            title: undefined,
            noBody: false,
            align: 'start',
            fill: false,
            fixed: false,
            grow: false,
            shrink: false,
        }
    );

    const slots = useSlots();

    defineSlots<{
        'default' : () => unknown;
        'header' : () => unknown;
        'header-right' : () => unknown;
        'footer' : () => unknown;
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const hasFooterSlot = computed(() => !!slots.footer);

    const classes = computed(() =>
    {
        // We default these to false so that we can test against it, instead of testing truthiness, because the
        // shortcut `<card fill>` makes the property into an empty string. This just means we only have to
        // test against false.
        if(props.fill !== false)
        {
            return 'fill';
        }
        else if(props.fixed !== false)
        {
            return 'fixed';
        }
        else if(props.grow !== false)
        {
            return 'grow';
        }
        else if(props.shrink !== false)
        {
            return 'shrink';
        }

        return '';
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
