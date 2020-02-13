<!----------------------------------------------------------------------------------------------------------------------
  -- criticalCard
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-card class="eote-critical-card" :class="visible ? '' : 'collapsed'" no-body>
        <template v-slot:header>
            <div class="crit-header" @click="toggle">
                <b-btn-close v-if="!readonly" style="margin-top: -2px;" @click.stop.prevent="remove"></b-btn-close>
                <small>
                    {{ critical.title }}
                    <span v-if="critical.severity">
                        (<difficulty v-for="index in severityRange" :key="index"></difficulty>)
                    </span>
                </small>
            </div>
        </template>
        <b-collapse v-model="visible">
            <div class="p-2">
                <small>{{ critical.description }}</small>
            </div>
        </b-collapse>
    </b-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .eote-critical-card {
        &.collapsed {
            .card-header {
                border-bottom: none;
            }
        }
        .card-header {
            padding: 0;

            .crit-header {
                cursor: pointer;
                padding: 0.25rem 0.5rem;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EotECriticalCard',
        props: {
            critical: {
                type: Object,
                required: true
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
        data()
        {
            return {
                visible: false
            };
        },
        computed: {
            severityRange() { return Array(this.critical.severity); }
        },
        methods: {
            toggle()
            {
                this.visible = !this.visible;
            },
            remove()
            {
                if(!this.readonly)
                {
                    this.$emit('remove', this.critical.title);
                } // end if
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
