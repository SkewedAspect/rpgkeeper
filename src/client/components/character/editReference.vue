<!----------------------------------------------------------------------------------------------------------------------
  -- editReference
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-reference d-flex">
        <b-form-group
            class="flex-fill"
            label="Source"
            label-class="font-weight-bold"
            label-for="source-input"
        >
            <b-form-select
                id="source-input"
                v-model="source"
                :options="references"
                text-field="name"
                value-field="abbr"
            ></b-form-select>
        </b-form-group>
        <b-form-group
            class="flex-fill ml-2"
            label="Page"
            label-class="font-weight-bold"
            label-for="page-input"
        >
            <b-form-input
                id="page-input"
                v-model="page"
                number
                type="number"
                step="1"
                min="1"
                :disabled="source === 'HB'"
            ></b-form-input>
        </b-form-group>
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

    interface Events
    {
        (e : 'update:reference', value : string) : void;
    }

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
        }
    });

    const page = computed({
        get() { return props.reference.split(':')[1]; },
        set(val : string)
        {
            emit('update:reference', val ? `${ source.value }:${ val }` : `${ source.value }`);
        }
    });

    const references = computed(() => eoteManager.references);
</script>

<!--------------------------------------------------------------------------------------------------------------------->
