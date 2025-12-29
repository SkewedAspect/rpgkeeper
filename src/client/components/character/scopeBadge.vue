<!----------------------------------------------------------------------------------------------------------------------
  -- scopeBadge
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BBadge class="supp-scope-badge" :variant="badgeVariant">
        {{ badgeText }}
    </BBadge>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';

    // Models
    import { Supplement } from '@rpgk/core';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        supplement : Pick<Supplement, 'scope' | 'official'>
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const badgeText = computed(() =>
    {
        if(props.supplement.scope === 'user')
        {
            return 'User';
        }
        else if(props.supplement.scope === 'public')
        {
            if(props.supplement.official)
            {
                return 'Official';
            }
            else
            {
                return 'Public';
            }
        }

        return 'Unknown';
    });

    const badgeVariant = computed(() =>
    {
        if(props.supplement.scope === 'user')
        {
            return 'success';
        }
        else if(props.supplement.scope === 'public')
        {
            if(props.supplement.official)
            {
                return 'info';
            }
        }

        return 'secondary';
    });

</script>

<!--------------------------------------------------------------------------------------------------------------------->
