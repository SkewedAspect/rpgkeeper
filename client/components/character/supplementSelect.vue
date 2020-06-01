<!----------------------------------------------------------------------------------------------------------------------
  -- Supplement Select
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-form-group
        class="supplement-select"
        :label="label"
        :label-class="labelClass"
    >
        <b-form-row>
            <b-col>
                <b-card class="h-100 overflow-hidden" no-body :style="{ maxHeight, minHeight: maxHeight }">
                    <template v-slot:header>
                        <div class="d-flex">
                            <vue-typeahead-bootstrap
                                v-model="search"
                                class="w-100"
                                :data="availableFiltered"
                                placeholder="Search..."
                                autocomplete="off"
                                :max-matches="1000"
                                :serializer="(s) => s.name"
                                show-on-focus
                                @hit="suppToAdd = $event"
                            >
                                <template v-slot:prepend>
                                    <b-input-group-text>
                                        <fa icon="search"></fa>
                                    </b-input-group-text>
                                </template>
                                <template v-slot:append>
                                    <b-button class="text-nowrap" variant="primary" title="Add..." @click="addSupp()">
                                        <fa icon="plus"></fa>
                                        Add
                                    </b-button>
                                </template>
                                <template v-slot:suggestion="{ data, htmlText }">
                                    <b-badge class="float-right" :variant="data.scope === 'user' ? 'success' : ''">
                                        <span v-if="data.scope === 'user'">User</span>
                                        <span v-else-if="data.scope === 'public'">Public</span>
                                    </b-badge>

                                    <!-- Note: the v-html binding is used, as htmlText contains
                                         the suggestion text highlighted with <strong> tags -->
                                    <!-- eslint-disable-next-line vue/no-v-html -->
                                    <span v-html="htmlText"></span>
                                </template>
                            </vue-typeahead-bootstrap>
                            <b-button class="ml-2 text-nowrap" variant="success" title="Add New..." @click="addNew()">
                                <fa icon="plus"></fa>
                                New
                            </b-button>
                        </div>
                    </template>

                    <!-- Supplement Selection -->
                    <b-list-group v-if="selectedSupplements.length > 0" flush class="overflow-auto">
                        <b-list-group-item v-for="supp in selectedSupplements" :key="supp.id" :variant=" supp.id === currentSelection ? 'primary' : ''" @click="selectSupp(supp)">
                            <span>
                                {{ getSupp(supp.id).name }}
                            </span>
                            <div class="float-right">
                                <b-badge :variant="getSupp(supp.id).scope === 'user' ? 'success' : ''">
                                    <span v-if="getSupp(supp.id).scope === 'user'">User</span>
                                    <span v-else-if="getSupp(supp.id).scope === 'public'">Public</span>
                                </b-badge>
                                <b-button class="ml-2 text-nowrap" variant="danger" title="Remove" @click.prevent.stop="removeSupp(supp)">
                                    <fa icon="trash-alt"></fa>
                                </b-button>
                            </div>
                        </b-list-group-item>
                    </b-list-group>
                    <div v-else class="card-body">
                        <h5 class="m-0 text-center">
                            Nothing added to character.
                        </h5>
                    </div>
                </b-card>
            </b-col>
            <b-col>
                <b-card>
                    <template v-if="currentSelection" v-slot:header>
                        <slot name="header">
                            <b>{{ currentSupplement.name }}</b>
                        </slot>
                    </template>
                    <slot v-if="!currentSelection" name="noSelection">
                        <div class="text-center">
                            <i>Please select an option to view/edit it.</i>
                        </div>
                    </slot>
                    <slot v-else :data="supplementInstance" :supplement="currentSupplement" name="preview">
                        <markdown-block class="font-italic" :text="currentSupplement.description" inline></markdown-block>
                        <reference
                            class="float-right mt-2"
                            :reference="currentSupplement.reference"
                        ></reference>
                    </slot>
                </b-card>
            </b-col>
        </b-form-row>
    </b-form-group>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .supplement-select {
        .vbt-autcomplete-list {
            max-height: calc(100% - 60px);
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    // Components
    import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';
    import MarkdownBlock from '../ui/markdown.vue';
    import Reference from './reference.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'SupplementSelect',
        components: {
            MarkdownBlock,
            Reference,
            VueTypeaheadBootstrap
        },
        props: {
            label: {
                type: String,
                default: undefined
            },
            labelClass: {
                type: String,
                default: undefined
            },
            available: {
                type: Array,
                default: () => []
            },
            selected: {
                type: Array,
                default: () => []
            },
            maxHeight: {
                type: String,
                default: '300px'
            }
        },
        data()
        {
            return {
                search: '',
                suppToAdd: undefined,
                currentSelection: undefined
            };
        },
        computed: {
            availableFiltered()
            {
                // Filter out an already selected supplements, and ones that match the search filter
                return this.available.filter((supp) => supp.name.toLowerCase().includes(this.search.toLowerCase())
                    && !this.selected.includes(supp.id));
            },
            selectedSupplements()
            {
                // Normalize the selected supplements to an array of objects with `id`.
                return this.selected.map((supp) =>
                {
                    // If we have `id`, assume we're in the right format
                    if(supp.id)
                    {
                        return supp;
                    }
                    else
                    {
                        // Otherwise assume we're just the id, and wrap ourselves in an object. This is Good Enough™.
                        return { id: supp };
                    } // end if
                });
            },
            currentSupplement()
            {
                return this.getSupp(this.currentSelection);
            },
            supplementInstance()
            {
                return this.getSelected(this.currentSelection);
            }
        },
        methods: {
            getSupp(id)
            {
                if(id)
                {
                    return this.available.filter((supp) => supp.id === id)[0];
                } // end if

                return undefined;
            },
            getSelected(id)
            {
                if(id)
                {
                    return this.selectedSupplements.filter((supp) => supp.id === id)[0];
                } // end if

                return undefined;
            },
            selectSupp(supp)
            {
                if(supp && this.currentSelection !== supp.id)
                {
                    this.currentSelection = supp.id;
                }
                else
                {
                    this.currentSelection = undefined;
                } // end if
            },
            addNew()
            {
                this.$emit('new');
            },
            addSupp()
            {
                this.$emit('add', { id: this.suppToAdd.id });
            },
            removeSupp(supp)
            {
                this.suppToAdd = undefined;
                this.currentSelection = undefined;
                this.$emit('remove', { id: supp.id });
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
