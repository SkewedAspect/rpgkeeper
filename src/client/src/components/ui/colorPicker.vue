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

    // Type for vue-color output which includes hex/hex8 properties
    interface VueColorHex { hex ?: string, hex8 ?: string }
    type VueColorOutput = ColorInput & VueColorHex;

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

    const colorBtn = ref<HTMLElement | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const internalColor = computed<VueColorOutput>({
        get() { return props.color; },
        set(val : VueColorOutput)
        {
            const colorVal = val as { hex ?: string, hex8 ?: string };
            if(colorVal.hex)
            {
                emit('update:color', colorVal.hex);
            }
            else if(colorVal.hex8)
            {
                emit('update:color', colorVal.hex8);
            }
            else
            {
                emit('update:color', val as string);
            }
        },
    });

    const htmlColor = computed(() =>
    {
        if(typeof internalColor.value === 'string')
        {
            return internalColor.value;
        }

        const colorVal = internalColor.value as { hex ?: string, hex8 ?: string };
        if(colorVal.hex)
        {
            return colorVal.hex;
        }
        else if(colorVal.hex8)
        {
            return colorVal.hex8;
        }

        return '#000';
    });

    const disableAlpha = computed(() => !props.enableAlpha);
</script>

<!--------------------------------------------------------------------------------------------------------------------->
