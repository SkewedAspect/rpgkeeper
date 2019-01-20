<!----------------------------------------------------------------------------------------------------------------------
  -- fatePoints.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="d-flex flex-nowrap">
        <b-input-group class="fate-points mr-2">
            <b-form-input type="number" min="0" step="1" v-model.number="current" @change="onChange" :readonly="readonly"></b-form-input>
            <b-input-group-text slot="append">
                / &nbsp;
                <b>{{ refresh }}</b>
            </b-input-group-text>
        </b-input-group>
        <b-btn variant="primary" class="text-nowrap" @click="refreshFatePoints()" :disabled="readonly">
            <font-awesome-icon icon="redo"></font-awesome-icon>
            Refresh
        </b-btn>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .fate-points {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    // Managers
    import charMan from '../../../client/api/managers/character';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'FatePoints',
        props: {
            value: {
                type: [ Number, String ],
                default: 0
            },
            refresh: {
                type: Number,
                required: true
            },
            readonly: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            current: {
                get(){ return this.value || 0; },
                set(val){ this.$emit('input', val) }
            }
        },
        methods: {
            onChange()
            {
                // Save the character
                return charMan.save(charMan.selected);
            },
            refreshFatePoints()
            {
                this.current = Math.max(this.current, this.refresh);

                // Save the character
                return charMan.save(charMan.selected);
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
