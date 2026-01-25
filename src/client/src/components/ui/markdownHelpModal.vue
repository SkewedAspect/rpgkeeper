<!----------------------------------------------------------------------------------------------------------------------
  -- Markdown Help Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BModal
        ref="innerModal"
        size="lg"
        header-bg-variant="dark"
        header-text-variant="white"
        no-close-on-esc
        no-close-on-backdrop
    >
        <!-- Modal Header -->
        <template #header="{ cancel }">
            <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                <Fa icon="question-circle" />
                Markdown Guide
                <CloseButton class="float-end" @click="cancel" />
            </h5>
        </template>

        <!-- Modal Content -->
        <div class="markdown-help-content">
            <h5>
                Basic Markdown Syntax
            </h5>
            <table class="table table-sm">
                <tbody>
                    <tr>
                        <td><code>**bold**</code></td>
                        <td><strong>bold</strong></td>
                    </tr>
                    <tr>
                        <td><code>*italic*</code></td>
                        <td><em>italic</em></td>
                    </tr>
                    <tr>
                        <td><code>[link text](https://example.com)</code></td>
                        <td><a href="#">link text</a></td>
                    </tr>
                    <tr>
                        <td><code>- list item</code></td>
                        <td>• list item</td>
                    </tr>
                </tbody>
            </table>

            <p>
                For more details, see the
                <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer">
                    Markdown Guide <Fa icon="external-link-alt" size="xs" />
                </a>
            </p>

            <template v-if="system === 'eote' || system === 'genesys'">
                <h5 class="mt-3">
                    {{ system === 'eote' ? 'Edge of the Empire' : 'Genesys' }} Dice & Symbols
                </h5>

                <div class="row" :class="`${system}-system`">
                    <div class="col-md-6">
                        <h6>
                            Dice
                        </h6>
                        <table class="table table-sm dice-table">
                            <tbody>
                                <tr>
                                    <td>
                                        <MarkdownBlock text="<proficiency />" :inline="true" />
                                    </td>
                                    <td><code>&lt;proficiency /&gt;</code></td>
                                </tr>
                                <tr>
                                    <td>
                                        <MarkdownBlock text="<ability />" :inline="true" />
                                    </td>
                                    <td><code>&lt;ability /&gt;</code></td>
                                </tr>
                                <tr>
                                    <td>
                                        <MarkdownBlock text="<boost />" :inline="true" />
                                    </td>
                                    <td><code>&lt;boost /&gt;</code></td>
                                </tr>
                                <tr v-if="system === 'eote'">
                                    <td>
                                        <MarkdownBlock text="<force />" :inline="true" />
                                    </td>
                                    <td><code>&lt;force /&gt;</code></td>
                                </tr>
                                <tr>
                                    <td>
                                        <MarkdownBlock text="<challenge />" :inline="true" />
                                    </td>
                                    <td><code>&lt;challenge /&gt;</code></td>
                                </tr>
                                <tr>
                                    <td>
                                        <MarkdownBlock text="<difficulty />" :inline="true" />
                                    </td>
                                    <td><code>&lt;difficulty /&gt;</code></td>
                                </tr>
                                <tr>
                                    <td>
                                        <MarkdownBlock text="<setback />" :inline="true" />
                                    </td>
                                    <td><code>&lt;setback /&gt;</code></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="col-md-6">
                        <h6>
                            Symbols
                        </h6>
                        <table class="table table-sm dice-table">
                            <tbody>
                                <tr>
                                    <td>
                                        <MarkdownBlock text="<success />" :inline="true" />
                                    </td>
                                    <td><code>&lt;success /&gt;</code></td>
                                </tr>
                                <tr>
                                    <td>
                                        <MarkdownBlock text="<advantage />" :inline="true" />
                                    </td>
                                    <td><code>&lt;advantage /&gt;</code></td>
                                </tr>
                                <tr>
                                    <td>
                                        <MarkdownBlock text="<triumph />" :inline="true" />
                                    </td>
                                    <td><code>&lt;triumph /&gt;</code></td>
                                </tr>
                                <tr v-if="system === 'eote'">
                                    <td>
                                        <MarkdownBlock text="<lightside />" :inline="true" />
                                    </td>
                                    <td><code>&lt;lightside /&gt;</code></td>
                                </tr>
                                <tr v-if="system === 'eote'">
                                    <td>
                                        <MarkdownBlock text="<forcepoint />" :inline="true" />
                                    </td>
                                    <td><code>&lt;forcepoint /&gt;</code></td>
                                </tr>
                                <tr>
                                    <td>
                                        <MarkdownBlock text="<failure />" :inline="true" />
                                    </td>
                                    <td><code>&lt;failure /&gt;</code></td>
                                </tr>
                                <tr>
                                    <td>
                                        <MarkdownBlock text="<threat />" :inline="true" />
                                    </td>
                                    <td><code>&lt;threat /&gt;</code></td>
                                </tr>
                                <tr>
                                    <td>
                                        <MarkdownBlock text="<despair />" :inline="true" />
                                    </td>
                                    <td><code>&lt;despair /&gt;</code></td>
                                </tr>
                                <tr v-if="system === 'eote'">
                                    <td>
                                        <MarkdownBlock text="<darkside />" :inline="true" />
                                    </td>
                                    <td><code>&lt;darkside /&gt;</code></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>
        </div>

        <!-- Modal Buttons -->
        <template #footer="{ cancel }">
            <BButton variant="secondary" @click="cancel">
                Close
            </BButton>
        </template>
    </BModal>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .markdown-help-content {
        .dice-table {
            td {
                vertical-align: middle;
            }

            td:first-child {
                width: 40px;
                text-align: center;
                font-size: 1.5rem;
            }

            code {
                font-size: 0.85rem;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { useTemplateRef } from 'vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from './closeButton.vue';
    import MarkdownBlock from './markdownBlock.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        system ?: 'eote' | 'genesys';
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const innerModal = useTemplateRef('innerModal');

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show() : void
    {
        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
