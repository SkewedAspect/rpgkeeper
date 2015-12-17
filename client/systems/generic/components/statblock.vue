<template>
    <div class="card statblock">
        <div class="card-header">
            <button type="button" class="close" aria-label="Close" @click="confirmDelete()" style="margin-left: 10px">
                <span aria-hidden="true">
                    <i class="fa fa-trash-o"></i>
                </span>
                <span class="sr-only">Delete</span>
            </button>
            <button type="button" class="close" aria-label="Close" @click="showEdit()">
                <span aria-hidden="true">
                    <i class="fa fa-edit"></i>
                </span>
                <span class="sr-only">Edit</span>
            </button>
            <button type="button" class="close" aria-label="Close" @click="moveUp('stats', statblock)">
                <span aria-hidden="true">
                    <i class="fa fa-caret-up"></i>
                </span>
                <span class="sr-only">Move Up</span>
            </button>
            <button type="button" class="close" aria-label="Close" @click="moveDown('stats', statblock)">
                <span aria-hidden="true">
                    <i class="fa fa-caret-down"></i>
                </span>
                <span class="sr-only">Move Down</span>
            </button>
            {{ statblock.name }}
        </div>
        <table v-if="statblock.type == 'table'" class="table table-sm text-center">
            <tr>
                <th v-for="column in statblock.columns" class="text-center">{{ column.name }}</th>
            </tr>
            <tr v-for="row in statblock.rows">
                <td v-for="cell in row">{{{ renderCell(cell, $index) }}}</td>
            </tr>
        </table>
        <table class="table table-sm" v-else>
            <tr v-for="item in statblock.items">
                <td><b>{{ item.key }}</b></td>

                <!-- Value -->
                <td>{{{ renderValue(item) }}}</td>
            </tr>
        </table>
    </div>

    <!-- Edit Modal -->
    <modal v-ref:edit-modal :backdrop="'static'" :keyboard="false" :width="'900px'">
        <div class="modal-header" slot="header">
            <h4 class="modal-title">
                <i class="fa fa-edit"></i>
                Edit "{{ statblock.name }}" Statblock
            </h4>
        </div>
        <div class="modal-body" slot="body">
            <form>
                <fieldset class="form-group">
                    <label for="name">Name</label>
                    <input id="name" type="text" class="form-control" v-model="statblockClone.name">
                </fieldset>
                <fieldset class="form-group">
                    <label for="type">Type</label>
                    <select id="type" class="form-control" v-model="statblockClone.type">
                        <option value="table">Table</option>
                        <option value="list">List</option>
                    </select>
                </fieldset>
                <hr>
                <div v-if="statblockClone.type == 'table'" class="form-group">
                    <h5>Columns</h5>
                    <table class="table" style="margin-bottom: 0">
                        <tr>
                            <th class="text-center">Name</th>
                            <th class="text-center">Type</th>
                            <th class="text-center">Primary Key</th>
                            <th></th>
                        </tr>
                        <tr v-for="column in statblockClone.columns">
                            <td>
                                <input type="text" class="form-control" v-model="column.name">
                            </td>
                            <td>
                                <select class="form-control" v-model="column.type">
                                    <option value="string">String</option>
                                    <option value="number">Number</option>
                                    <option value="boolean">Boolean</option>
                                    <option value="computed">Computed</option>
                                </select>
                            </td>
                            <td style="width: 1%">
                                <button class="btn btn-block" :class="{ 'btn-secondary': !column.pk, 'btn-primary': column.pk, 'no-click': column.pk }" title="Make Primary"
                                        @click.prevent.stop="makeColumnPrimary(column.name)">
                                    <span v-if="!column.pk">Make </span>Primary
                                </button>
                            </td>
                            <td style="width: 1%">
                                <button class="btn btn-danger btn-block" title="Remove row"
                                        @click.prevent.stop="statblockClone.columns.$remove(column)">
                                    <i class="fa fa-fw fa-trash-o"></i>
                                </button>
                            </td>
                        </tr>
                    </table>
                    <hr class="sm">
                    <div class="text-right">
                        <button class="btn btn-link" @click.prevent.stop="statblockClone.columns.push({ name: null, type: 'string', pk: undefined})">
                            <i class="fa fa-plus"></i>
                            Add Column
                        </button>
                    </div>
                    <h5>Data</h5>
                    <table class="table" style="margin-bottom: 0">
                        <tr>
                            <th class="text-center" v-for="column in statblockClone.columns">{{ column.name }}</th>
                            <th></th>
                        </tr>
                        <tr v-for="row in statblockClone.rows">
                            <td v-for="column in statblockClone.columns">
                                <input v-if="column.type == 'string'" type="text" class="form-control" v-model="row[$index]">
                                <input v-if="column.type == 'number'" type="number" class="form-control" v-model="row[$index]" number>
                                <div class="checkbox" v-if="column.type == 'boolean'">
                                    <label>
                                        <input type="checkbox" v-model="row[$index]">
                                    </label>
                                </div>
                                <textarea v-if="column.type == 'computed'" class="form-control monospace" style="font-size: .85rem;" rows="3" v-model="row[$index]"></textarea>
                            </td>
                            <td style="width: 1%">
                                <button class="btn btn-danger btn-block" title="Remove row"
                                        @click.prevent.stop="statblockClone.rows.$remove(row)">
                                    <i class="fa fa-fw fa-trash-o"></i>
                                </button>
                            </td>
                        </tr>
                    </table>
                    <hr class="sm">
                    <div class="text-right">
                        <button class="btn btn-link" @click.prevent.stop="statblockClone.rows.push([])">
                            <i class="fa fa-plus"></i>
                            Add Row
                        </button>
                    </div>
                </div>
                <div v-else class="form-group">
                    <h5>Data</h5>
                    <table class="table" style="margin-bottom: 0">
                        <tr>
                            <th class="text-center">Key</th>
                            <th class="text-center">Type</th>
                            <th class="text-center">Value</th>
                            <th></th>
                        </tr>
                        <tr v-for="item in statblockClone.items">
                            <td style="width: 20%">
                                <input type="text" class="form-control" v-model="item.key">
                            </td>
                            <td style="width: 20%">
                                <select class="form-control" v-model="item.type">
                                    <option value="string">String</option>
                                    <option value="number">Number</option>
                                    <option value="boolean">Boolean</option>
                                    <option value="computed">Computed</option>
                                </select>
                            </td>
                            <td style="width: 100%">
                                <input v-if="item.type == 'string'" type="text" class="form-control" v-model="item.value">
                                <input v-if="item.type == 'number'" type="number" class="form-control" v-model="item.value" number>
                                <div class="input-group" v-if="item.type == 'boolean'">
                                    <span class="input-group-addon">
                                        <input type="checkbox" v-model="item.value">
                                    </span>
                                    <input type="text" class="form-control" v-model="item.description">
                                </div>
                                <textarea v-if="item.type == 'computed'" class="form-control monospace" style="font-size: .85rem;" rows="3" v-model="item.value"></textarea>
                            </td>
                            <td style="width: 1%">
                                <button class="btn btn-danger btn-block" title="Remove row"
                                    @click.prevent.stop="statblockClone.items.$remove(item)">
                                    <i class="fa fa-fw fa-trash-o"></i>
                                </button>
                            </td>
                        </tr>
                    </table>
                    <hr class="sm">
                    <div class="text-right">
                        <button class="btn btn-link" @click.prevent.stop="statblockClone.items.push({ key: null, type: 'string', value: null})">
                            <i class="fa fa-plus"></i>
                            Add Row
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer" slot="footer">
            <button type="button"
                    class="btn btn-success"
                    @click="saveEdit()">
                <i class="fa fa-save"></i>
                Save Roll
            </button>
            <button type="button"
                    class="btn btn-secondary"
                    @click="$refs.editModal.hideModal()">
                <i class="fa fa-times"></i>
                Cancel
            </button>
        </div>
    </modal>
</template>

<style lang="sass">
    .card.statblock {

        .card-header {
            font-size: .85rem;
            font-weight: 500;

            button.close {
                line-height: .75;
                margin-left: 10px;

                & > span {
                    font-size: 1rem;
                }
            }
        }
    }
</style>

<script type="text/babel">
    import _ from 'lodash';
    import rpgdice from 'rpgdicejs';
    import { modal } from 'vueboot';

    export default {
        components: {
            modal
        },
        props: {
            statblock: {
                type: Object,
                required: true
            },
            context: {
                type: Object,
                required: true
            },
            moveUp: {
                type: Function,
                required: true
            },
            moveDown: {
                type: Function,
                required: true
            },
            save: {
                type: Function,
                required: true
            }
        },
        data: function()
        {
            return {
                statblockClone: {
                    name: null,
                    type: null,
                    rows: [],
                    columns: [],
                    items: []
                }
            };
        },
        methods: {
            showEdit: function()
            {
                _.assign(this.statblockClone, _.cloneDeep(this.statblock));

                this.$refs.editModal.showModal();
            },
            makeColumnPrimary: function(columnName)
            {
                var columns = _.cloneDeep(this.statblockClone.columns);

                // Clear any existing PK setting
                _.map(columns, (cm) => { cm.pk = undefined; });

                // Set the current PK
                var column = _.find(columns, { name: columnName });
                column.pk = true;

                // Update Vue
                this.statblockClone.columns = columns;
            },
            saveEdit: function()
            {
                _.assign(this.statblock, this.statblockClone);
                this.$refs.editModal.hideModal();
                this.save();
            },
            renderCell: function(cell, index)
            {
                var type = this.statblock.columns[index].type;

                switch(type)
                {
                    case 'boolean':
                        return cell ? '<i class="fa fa-check-square"></i>' : '<i class="fa fa-square-o"></i>';

                    case 'computed':
                        return this.evalComputed(cell);

                    default:
                        return cell;
                } // end switch
            },
            renderValue: function(item)
            {
                switch(item.type)
                {
                    case 'boolean':
                        return (item.value ? '<i class="fa fa-check-square"></i>' : '<i class="fa fa-square-o"></i>') + ` ${ item.description }`;

                    case 'computed':
                        return this.evalComputed(item.value);

                    default:
                        return item.value;
                } // end switch
            },
            evalComputed: function(evalStr)
            {
                return rpgdice.eval(evalStr, this.context).value;
            }
        }
    }
</script>