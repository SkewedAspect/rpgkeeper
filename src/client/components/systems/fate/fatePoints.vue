<!----------------------------------------------------------------------------------------------------------------------
  -- fatePoints.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="d-flex flex-nowrap">
        <BInputGroup class="fate-points mr-2">
            <BFormInput
                v-model="current"
                number
                type="number"
                min="0"
                step="1"
                :readonly="readonly"
            ></BFormInput>
            <template #append>
                <BInputGroupText>
                    / &nbsp;
                    <b>{{ refresh }}</b>
                </BInputGroupText>
            </template>
        </BInputGroup>
        <BButton variant="primary" class="text-nowrap" :disabled="readonly" @click="refreshFatePoints()">
            <fa icon="redo"></fa>
            Refresh
        </BButton>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed } from 'vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        current : number;
        refresh : number;
        readonly : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'update:current', current : number) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const current = computed({
        get() { return props.current; },
        set(val) { emit('update:current', val); }
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function refreshFatePoints() : void
    {
        current.value = props.refresh;
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
