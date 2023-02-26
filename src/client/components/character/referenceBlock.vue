<!----------------------------------------------------------------------------------------------------------------------
  -- Reference Block
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="eote-reference" :class="{ inline: isInline }">
        <span class="name">{{ name }}</span>
        <span v-if="page">, p{{ page }}</span>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .eote-reference {
        font-size: 0.8rem;
        font-style: italic;

        &.inline {
            display: inline-block;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';

    // Managers
    import eoteManager from '../../lib/managers/systems/eote';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        reference : string;
        inline : boolean;
    }

    const props = withDefaults(defineProps<Props>(), { inline: false });

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isInline = computed(() => props.inline);

    const abbr = computed(() => props.reference.split(':')[0]);
    const page = computed(() => props.reference.split(':')[1]);
    const refObj = computed(() => eoteManager.references.find((ref) => ref.abbr === abbr.value));
    const name = computed(() => refObj.value?.name);
</script>

<!--------------------------------------------------------------------------------------------------------------------->
