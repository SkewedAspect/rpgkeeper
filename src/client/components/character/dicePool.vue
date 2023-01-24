<!----------------------------------------------------------------------------------------------------------------------
  -- A Resource Pool
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="pool">
        <div v-if="max > 0" class="d-inline-block">
            <span
                v-for="index in poolRange"
                :key="index"
                class="ml-1"
                @click.stop.prevent="setPoolCurrent(index)"
                @mouseover="hoveredIndex = index"
                @mouseout="hoveredIndex = null"
            >
                <fa
                    :class="[checkHover(index), { 'read-only': disabled }]"
                    :icon="isChecked(index) ? checkedIcon : uncheckedIcon"
                    :size="size"
                ></fa>
            </span>
        </div>
        <div v-else class="d-inline-block">
            <h5 class="mt-1 text-muted">
                No pool
            </h5>
        </div>
        <b-btn
            v-if="showEdit"
            class="ml-2 d-inline-block align-top"
            variant="outline-secondary"
            size="sm"
            @click="openEditMax"
        >
            <fa icon="edit"></fa>
            Edit
        </b-btn>

        <!-- Edit Modal -->
        <b-modal
            ref="editPool"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            @ok="onEditSave"
            @cancel="onEditCancel"
            @shown="onEditShown"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit "{{ name }}" Pool
            </template>

            <!-- Modal Content -->
            <b-form-group
                id="name-input-group"
                label="Pool Maximum"
                label-for="max-input"
            >
                <b-form-input
                    id="max-input"
                    v-model="editMax"
                    type="number"
                    min="0"
                    max="9999999"
                    step="1"
                    number
                ></b-form-input>
            </b-form-group>

            <!-- Modal Buttons -->
            <template #modal-ok>
                <fa icon="save"></fa>
                Save
            </template>
            <template #modal-cancel>
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #pool {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    //------------------------------------------------------------------------------------------------------------------

    import { range } from 'lodash';
    import { computed, ref } from 'vue';

    // Components
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        current : number;
        max : number;
        name ?: string;
        checkedIcon : string | string[];
        uncheckedIcon : string | string[];
        noEdit : boolean;
        size : string;
        disabled : boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        max: 0,
        name: undefined,
        checkedIcon: 'check-square',
        uncheckedIcon: () => [ 'far', 'square' ],
        noEdit: false,
        size: '2x',
        disabled: false
    });

    interface Events
    {
        (e : 'save') : void;
        (e : 'update:max', value : number) : void;
        (e : 'update:current', value : number) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const hoveredIndex = ref<number | null>(null);
    const editMax = ref<number | null>(null);

    // Component Refs
    const editPool = ref<InstanceType<BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const poolMax = computed({
        get() { return props.max; },
        set(val : number) { emit('update:max', val); }
    });

    const poolCurrent = computed({
        get() { return props.current; },
        set(val : number) { emit('update:current', val); }
    });

    const poolRange = computed(() => range(poolMax.value));
    const showEdit = computed(() => !props.disabled && !props.noEdit);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function setPoolCurrent(index : number) : void
    {
        if(!props.disabled)
        {
            if(index === (poolCurrent.value - 1))
            {
                poolCurrent.value -= 1;
            }
            else
            {
                poolCurrent.value = (index + 1);
            }

            // Tell the parent component that it should probably save.
            emit('save');
        }
    }

    function checkHover(index : number) : string
    {
        if(!props.disabled)
        {
            if(hoveredIndex.value !== null && index <= hoveredIndex.value)
            {
                return 'text-primary';
            }
        }
    }

    function isChecked(index : number) : boolean
    {
        return index <= (poolCurrent.value - 1);
    }

    //------------------------------------------------------------------------------------------------------------------

    function openEditMax() : void
    {
        if(!props.disabled)
        {
            editMax.value = poolMax.value ?? 0;
            editPool.value.show();
        }
    }

    function onEditShown() : void
    {
        editMax.value = poolMax.value ?? 0;
    }

    function onEditSave() : void
    {
        poolMax.value = editMax.value;
        poolCurrent.value = Math.min(poolMax.value, poolCurrent.value);
        editMax.value = null;

        // Tell the parent component that it should probably save.
        emit('save');
    }

    function onEditCancel() : void
    {
        // Clear editMax
        editMax.value = null;
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
