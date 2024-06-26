<!----------------------------------------------------------------------------------------------------------------------
  -- A Resource Pool
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="pool">
        <div v-if="max > 0" class="d-inline-block">
            <span
                v-for="index in poolRange"
                :key="index"
                class="ms-1"
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
        <BButton
            v-if="showEdit"
            class="ms-2 d-inline-block align-top"
            variant="outline-secondary"
            size="sm"
            @click="openEditMax"
        >
            <fa icon="edit"></fa>
            Edit
        </BButton>

        <!-- Edit Modal -->
        <BModal
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
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <fa icon="file-edit"></fa>
                    Edit "{{ name }}" Pool
                    <CloseButton class="float-end" @click="cancel"></CloseButton>
                </h5>
            </template>

            <!-- Modal Content -->
            <BFormGroup
                id="name-input-group"
                label="Pool Maximum"
                label-for="max-input"
            >
                <BFormInput
                    id="max-input"
                    v-model="editMax"
                    type="number"
                    min="0"
                    max="9999999"
                    step="1"
                    number
                ></BFormInput>
            </BFormGroup>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <fa icon="save"></fa>
                    Save
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <fa icon="times"></fa>
                    Cancel
                </BButton>
            </template>
        </BModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #pool {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { range } from 'lodash';
    import { computed, ref } from 'vue';

    // Components
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '../ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        current : number;
        max : number;
        name ?: string;
        checkedIcon ?: string | string[];
        uncheckedIcon ?: string | string[];
        noEdit ?: boolean;
        size ?: string;
        disabled ?: boolean;
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
