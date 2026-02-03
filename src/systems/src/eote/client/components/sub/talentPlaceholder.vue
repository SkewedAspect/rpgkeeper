<!----------------------------------------------------------------------------------------------------------------------
  -- Talent Placeholder
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BCard
        :id="id"
        class="eote-talent-placeholder"
        :class="{ 'clickable': !readonly }"
        no-body
        @click="onClick"
    >
        <template #header>
            <div class="text-muted text-nowrap text-center">
                <Fa v-if="!readonly" icon="plus" class="me-1" />
                Open Talent Slot
            </div>
        </template>
    </BCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .eote-talent-placeholder {
        border-style: dashed;

        .card-header {
            border-bottom: none;
            padding: 0.25rem 0.5rem;
        }

        &.clickable {
            cursor: pointer;

            &:hover {
                background-color: rgba(0, 0, 0, 0.05);
                border-color: var(--bs-primary);
            }
        }
    }

    .dark-mode .eote-talent-placeholder.clickable:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Utils
    import { shortID } from '@client/lib/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        tier : number;
        readonly : boolean;
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        click : [tier : number];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const uuid = ref(shortID());

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const id = computed(() => `talent-${ uuid.value }`);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onClick() : void
    {
        if(!props.readonly)
        {
            emit('click', props.tier);
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
