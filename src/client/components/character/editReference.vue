<!----------------------------------------------------------------------------------------------------------------------
  -- editReference
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-reference d-flex">
        <BFormGroup
            class="flex-fill"
            label="Source"
            label-class="fw-bold"
            label-for="source-input"
        >
            <BFormSelect
                id="source-input"
                v-model="source"
                :options="references"
                text-field="name"
                value-field="abbr"
            />
        </BFormGroup>
        <BFormGroup
            class="flex-fill ms-2"
            label="Page"
            label-class="fw-bold"
            label-for="page-input"
        >
            <BFormInput
                id="page-input"
                v-model="page"
                number
                type="number"
                step="1"
                min="1"
                :disabled="source === 'HB'"
            />
        </BFormGroup>
    </div>
</template>

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
    }

    const props = defineProps<Props>();

    type Events = (e : 'update:reference', value : string) => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const source = computed({
        get() { return props.reference.split(':')[0]; },
        set(val : string)
        {
            const page = props.reference.split(':')[1];
            emit('update:reference', page ? `${ val }:${ page }` : `${ val }`);
        },
    });

    const page = computed({
        get() { return props.reference.split(':')[1]; },
        set(val : string)
        {
            emit('update:reference', val ? `${ source.value }:${ val }` : `${ source.value }`);
        },
    });

    const references = computed(() => eoteManager.references);
</script>

<!--------------------------------------------------------------------------------------------------------------------->
