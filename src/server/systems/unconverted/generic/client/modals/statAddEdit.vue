<template>
    <Modal v-ref:modal :backdrop="'static'" :keyboard="false" :width="'900px'">
        <template #header>
            <div class="modal-header">
                <h4 class="modal-title">
                    <span v-if="mode == 'add'">
                        <i class="fa fa-plus" /> Add
                    </span>
                    <span v-else>
                        <i class="fa fa-edit" /> Edit
                    </span>
                    "{{ statblock.name }}" Statblock
                </h4>
            </div>
        </template>
        <template #body>
            <div class="modal-body">
                <form>
                    <fieldset class="form-group">
                        <label for="name">Name</label>
                        <input id="name" v-model="statblock.name" type="text" class="form-control">
                    </fieldset>
                    <fieldset class="form-group">
                        <label for="type">Type</label>
                        <select id="type" v-model="statblock.type" class="form-control">
                            <option value="table">
                                Table
                            </option>
                            <option value="list">
                                List
                            </option>
                        </select>
                    </fieldset>
                    <hr>
                    <div v-if="statblock.type == 'table'" class="form-group">
                        <h5>Columns</h5>
                        <table class="table" style="margin-bottom: 0">
                            <tr>
                                <th class="text-center">
                                    Name
                                </th>
                                <th class="text-center">
                                    Type
                                </th>
                                <th class="text-center">
                                    Primary Key
                                </th>
                                <th />
                            </tr>
                            <tr v-for="column in statblock.columns">
                                <td>
                                    <input v-model="column.name" type="text" class="form-control">
                                </td>
                                <td>
                                    <select v-model="column.type" class="form-control">
                                        <option value="string">
                                            String
                                        </option>
                                        <option value="number">
                                            Number
                                        </option>
                                        <option value="boolean">
                                            Boolean
                                        </option>
                                        <option value="computed">
                                            Computed
                                        </option>
                                    </select>
                                </td>
                                <td style="width: 1%">
                                    <button
                                        class="btn btn-block"
                                        :class="{ 'btn-secondary': !column.pk, 'btn-primary': column.pk, 'no-click': column.pk }"
                                        title="Make Primary"
                                        @click.prevent.stop="makeColumnPrimary(column.name)"
                                    >
                                        <span v-if="!column.pk">Make </span>Primary
                                    </button>
                                </td>
                                <td style="width: 1%">
                                    <button
                                        class="btn btn-danger btn-block"
                                        title="Remove row"
                                        @click.prevent.stop="statblock.columns.$remove(column)"
                                    >
                                        <i class="fa fa-fw fa-trash-o" />
                                    </button>
                                </td>
                            </tr>
                        </table>
                        <hr class="sm">
                        <div class="text-right">
                            <button class="btn btn-link" @click.prevent.stop="statblock.columns.push({ name: null, type: 'string', pk: undefined})">
                                <i class="fa fa-plus" />
                                Add Column
                            </button>
                        </div>
                        <h5>Data</h5>
                        <table class="table" style="margin-bottom: 0">
                            <tr>
                                <th v-for="column in statblock.columns" class="text-center">
                                    {{ column.name }}
                                </th>
                                <th />
                            </tr>
                            <tr v-for="row in statblock.rows">
                                <td v-for="column in statblock.columns">
                                    <input v-if="column.type == 'string'" v-model="row[$index]" type="text" class="form-control">
                                    <input v-if="column.type == 'number'" v-model="row[$index]" type="number" class="form-control" number>
                                    <div v-if="column.type == 'boolean'" class="checkbox">
                                        <label>
                                            <input v-model="row[$index]" type="checkbox">
                                        </label>
                                    </div>
                                    <textarea v-if="column.type == 'computed'" v-model="row[$index]" class="form-control monospace" style="font-size: .85rem;" rows="3" />
                                </td>
                                <td style="width: 1%">
                                    <button
                                        class="btn btn-danger btn-block"
                                        title="Remove row"
                                        @click.prevent.stop="statblock.rows.$remove(row)"
                                    >
                                        <i class="fa fa-fw fa-trash-o" />
                                    </button>
                                </td>
                            </tr>
                        </table>
                        <hr class="sm">
                        <div class="text-right">
                            <button class="btn btn-link" @click.prevent.stop="statblock.rows.push([])">
                                <i class="fa fa-plus" />
                                Add Row
                            </button>
                        </div>
                    </div>
                    <div v-else class="form-group">
                        <h5>Data</h5>
                        <table class="table" style="margin-bottom: 0">
                            <tr>
                                <th class="text-center">
                                    Key
                                </th>
                                <th class="text-center">
                                    Type
                                </th>
                                <th class="text-center">
                                    Value
                                </th>
                                <th />
                            </tr>
                            <tr v-for="item in statblock.items">
                                <td style="width: 20%">
                                    <input v-model="item.key" type="text" class="form-control">
                                </td>
                                <td style="width: 20%">
                                    <select v-model="item.type" class="form-control">
                                        <option value="string">
                                            String
                                        </option>
                                        <option value="number">
                                            Number
                                        </option>
                                        <option value="boolean">
                                            Boolean
                                        </option>
                                        <option value="computed">
                                            Computed
                                        </option>
                                    </select>
                                </td>
                                <td style="width: 100%">
                                    <input v-if="item.type == 'string'" v-model="item.value" type="text" class="form-control">
                                    <input v-if="item.type == 'number'" v-model="item.value" type="number" class="form-control" number>
                                    <div v-if="item.type == 'boolean'" class="input-group">
                                        <span class="input-group-addon">
                                            <input v-model="item.value" type="checkbox">
                                        </span>
                                        <input v-model="item.description" type="text" class="form-control">
                                    </div>
                                    <textarea v-if="item.type == 'computed'" v-model="item.value" class="form-control monospace" style="font-size: .85rem;" rows="3" />
                                </td>
                                <td style="width: 1%">
                                    <button
                                        class="btn btn-danger btn-block"
                                        title="Remove row"
                                        type="button"
                                        @click.prevent.stop="statblock.items.$remove(item)"
                                    >
                                        <i class="fa fa-fw fa-trash-o" />
                                    </button>
                                </td>
                            </tr>
                        </table>
                        <hr class="sm">
                        <div class="text-right">
                            <button class="btn btn-link" @click.prevent.stop="statblock.items.push({ key: null, type: 'string', value: null})">
                                <i class="fa fa-plus" />
                                Add Row
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </template>
        <template #footer>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-success"
                    @click="saveModal()"
                >
                    <i class="fa fa-save" />
                    Save
                </button>
                <button
                    type="button"
                    class="btn btn-secondary"
                    @click="$refs.modal.hideModal()"
                >
                    <i class="fa fa-times" />
                    Cancel
                </button>
            </div>
        </template>
    </Modal>
</template>

<script type="text/babel">
    import _ from 'lodash';
    import { modal } from 'vueboot';

    export default {
        components: {
            modal,
        },
        props: {
            stats: {
                type: Object,
                twoWay: true,
                default: {
                    name: null,
                    type: 'list',
                    rows: [],
                    columns: [],
                    items: [],
                },
            },
            mode: {
                type: String,
                default: 'edit',
            },
            save: {
                type: Function,
                required: true,
            },
        },
        data()
        {
            return {
                defaultStats: {
                    name: null,
                    type: 'list',
                    rows: [],
                    columns: [],
                    items: [],
                },
                statblock: {
                    name: null,
                    type: 'list',
                    rows: [],
                    columns: [],
                    items: [],
                },
            };
        },
        methods: {
            show()
            {
                // Default to any properties not listed
                this.stats = _.defaults({}, this.stats, this.defaultStats);

                // Now we copy stats to our statblock
                _.assign(this.statblock, _.cloneDeep(this.stats));
                this.$refs.modal.showModal();
            },
            showModal()
            {
                // This is compatibility for the modal lib.
                this.show();
            },
            hide()
            {
                this.statblock = _.cloneDeep(this.defaultStats);
                this.$refs.modal.hideModal();
            },
            hideModal()
            {
                // This is compatibility for the modal lib.
                this.hide();
            },
            makeColumnPrimary(columnName)
            {
                var columns = _.cloneDeep(this.statblock.columns);

                // Clear any existing PK setting
                _.map(columns, (cm) => { cm.pk = undefined; });

                // Set the current PK
                var column = _.find(columns, { name: columnName });
                column.pk = true;

                // Update Vue
                this.statblock.columns = columns;
            },
            saveModal()
            {
                _.assign(this.stats, this.statblock);
                this.$refs.modal.hideModal();
                this.save();
            },
        },
    };
</script>
