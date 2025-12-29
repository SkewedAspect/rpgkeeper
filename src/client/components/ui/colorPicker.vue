<!----------------------------------------------------------------------------------------------------------------------
  -- Color Picker
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BButton v-bind="$attrs" ref="colorBtn">
        <span class="color-block" :style="{ 'background-color': htmlColor }">&nbsp;</span>
        <BPopover :target="colorBtn" triggers="click blur">
            <SketchPicker
                v-model="internalColor"
                :preset-colors="presetColors"
                :disable-alpha="disableAlpha"
                :disable-fields="disableFields"
            />
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
    import { computed, ref } from 'vue';

    // Types
    import type { ColorInput } from '@ctrl/tinycolor';

    // Components
    import { Sketch as SketchPicker } from '@ckpack/vue-color';
    import { BButton } from 'bootstrap-vue-next';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        color ?: string;
        presetColors ?: string[];
        enableAlpha ?: boolean;
        disableFields ?: boolean;
    }

    const props = withDefaults(
        defineProps<Props>(),
        {
            color: '#000',
            presetColors: undefined,
            enableAlpha: false,
            disableFields: false,
        }
    );

    type Events = (e : 'update:color', color : string) => void;

    const emit = defineEmits<Events>();

    const colorBtn = ref<InstanceType<typeof BButton> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const internalColor = computed<ColorInput>({
        get() { return props.color; },
        set(val : ColorInput)
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
        },
    });

    const htmlColor = computed(() =>
    {
        if(typeof internalColor.value === 'string')
        {
            return internalColor.value;
        }
        else if(internalColor.value['hex'])
        {
            return internalColor.value['hex'];
        }
        else if(internalColor.value['hex8'])
        {
            return internalColor.value['hex8'];
        }

        return '#000';
    });

    const disableAlpha = computed(() => !props.enableAlpha);
</script>

<!--------------------------------------------------------------------------------------------------------------------->
