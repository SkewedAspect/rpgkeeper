<!----------------------------------------------------------------------------------------------------------------------
  -- Color Picker
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BButton v-bind="$attrs" ref="colorBtn">
        <span class="color-block" :style="{ 'background-color': internalColor }">&nbsp;</span>
        <BPopover :target="() => $refs.colorBtn" triggers="click blur">
            <SketchPicker
                v-model="internalColor"
                :preset-colors="presetColors"
                :disable-alpha="disableAlpha"
                :disable-fields="disableFields"
            ></SketchPicker>
        </BPopover>
    </BButton>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .color-block {
        display: inline-block;
        min-width: 1.5rem;
        height: 100%;
        width: 100%;
    }

    .popover-body {
        .vc-sketch {
            box-shadow: none;
            padding: 0;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->
<script lang="ts" setup>
    import { computed } from 'vue';

    // Components
    import { Sketch as SketchPicker } from '@ckpack/vue-color';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        color : string;
        presetColors ?: string[];
        enableAlpha : boolean;
        disableFields : boolean;
    }

    const props = withDefaults(
        defineProps<Props>(),
        {
            color: '#000',
            presetColors: undefined,
            enableAlpha: false,
            disableFields: false
        }
    );

    interface Events
    {
        (e : 'update:color', color : string) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const internalColor = computed({
        get() { return props.color; },
        set(val : string | { hex : string } | { hex8 : string })
        {
            if(val['hex'])
            {
                val = val['hex'];
            }
            else if(val['hex8'])
            {
                val = val['hex8'];
            }

            emit('update:color', val as string);
        }
    });

    const disableAlpha = computed(() => !props.enableAlpha);
</script>

<!--------------------------------------------------------------------------------------------------------------------->
