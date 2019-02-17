<!----------------------------------------------------------------------------------------------------------------------
  -- FATE Extras
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <rpgk-card id="fate-extras" :class="{ readonly: readonly }" fill>
        <div slot="header" class="d-flex">
            <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                <font-awesome-icon class="mr-1" icon="magic"></font-awesome-icon>
                <span class="d-none d-md-inline">Extras</span>
            </h5>
            <div class="ml-auto" v-if="!readonly">
                <b-btn @click="openEdit()" size="sm" style="margin-bottom: 1px;">
                    <font-awesome-icon icon="edit" fixed-width></font-awesome-icon>
                    <span class="d-none d-md-inline">Edit</span>
                </b-btn>
            </div>
        </div>

        <!-- Content -->
        <div v-if="value" v-html="renderedContent"></div>
        <div v-else>
            <h6 class="text-center">No Extras</h6>
        </div>

        <!-- Modals -->
        <edit-extras-modal ref="editModal"></edit-extras-modal>
    </rpgk-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #fate-extras {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import marked from 'marked';

    // Components
    import RpgkCard from '../../../client/components/ui/card.vue';
    import EditExtrasModal from './editExtrasModal.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'FateExtrasCard',
        components: {
            RpgkCard,
            EditExtrasModal
        },
        props: {
            value: {
                type: String,
                required: true
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            renderedContent()
            {
                return marked(this.value);
            }
        },
        methods: {
            openEdit()
            {
                this.$refs.editModal.show();
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
