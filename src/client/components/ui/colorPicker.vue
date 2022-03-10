<!----------------------------------------------------------------------------------------------------------------------
  -- Color Picker
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-btn ref="colorBtn" v-bind="$attrs" v-on="$listeners">
        <span class="color-block" :style="{ 'background-color': internalColor }">&nbsp;</span>
        <b-popover :target="() => $refs.colorBtn" triggers="click blur">
            <sketch-color-picker
                v-model="internalColor"
                :preset-colors="presetColors"
                :disable-alpha="disableAlpha"
                :disable-fields="disableFields"
            ></sketch-color-picker>
        </b-popover>
    </b-btn>
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
<script lang="ts">
//------------------------------------------------------------------------------------------------------------------

    import Vue from 'vue';

    // Components
    import { Sketch } from 'vue-color';

    //------------------------------------------------------------------------------------------------------------------

    export default Vue.extend({
        name: 'ColorInput',
        components: {
            sketchColorPicker: Sketch
        },
        model: {
            prop: 'color',
            event: 'change'
        },
        props: {
            color: {
                type: String,
                default: '#000'
            },
            presetColors: {
                type: Array,
                default: undefined
            },
            disableAlpha: {
                type: Boolean,
                default: true
            },
            disableFields: {
                type: Boolean,
                default: false
            }
        },
        data()
        {
            return {
                // This is the private, internal representation of the color.
                privateColor: undefined
            };
        },
        computed: {
            internalColor: {
                get() { return this.privateColor; },
                set(val)
                {
                    const colorProp = this.disableAlpha ? 'hex' : 'hex8';
                    if(val?.[colorProp])
                    {
                        this.privateColor = val[colorProp];
                    }
                    else
                    {
                        this.privateColor = val;
                    }
                }
            }
        },
        watch: {
            internalColor()
            {
                if(this.color && this.internalColor && (this.internalColor !== this.color))
                {
                    this.$emit('change', this.internalColor);
                }
            },
            color: {
                handler()
                {
                    if(this.internalColor !== this.color)
                    {
                        this.internalColor = this.color;
                    }
                },
                immediate: true
            }
        }
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
