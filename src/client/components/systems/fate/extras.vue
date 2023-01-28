<!----------------------------------------------------------------------------------------------------------------------
  -- FATE Extras
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <rpgk-card id="fate-extras" :class="{ readonly: readonly }" fill>
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 mr-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="mr-1" icon="magic"></fa>
                    <span class="d-none d-md-inline">Extras</span>
                </h5>
                <div v-if="!readonly" class="ml-auto">
                    <b-btn size="sm" style="margin-bottom: 1px;" @click="openEdit()">
                        <fa icon="edit" fixed-width></fa>
                        <span class="d-none d-md-inline">Edit</span>
                    </b-btn>
                </div>
            </div>
        </template>

        <!-- Content -->
        <MarkdownBlock v-if="value" :text="value"></MarkdownBlock>
        <div v-else>
            <h6 class="text-center">
                No Extras
            </h6>
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

<script lang="ts">
    //------------------------------------------------------------------------------------------------------------------

    import { defineComponent } from 'vue';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';
    import MarkdownBlock from '../../ui/markdownBlock.vue';
    import EditExtrasModal from './editExtrasModal.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default defineComponent({
        name: 'FateExtrasCard',
        components: {
            RpgkCard,
            MarkdownBlock,
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
        methods: {
            openEdit()
            {
                this.$refs.editModal.show();
            }
        }

    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
