<template>
    <div class="card statblock">
        <div class="card-header">
            <button type="button" class="close" aria-label="Close" style="margin-left: 10px" @click="$refs.deleteModal.show()">
                <span aria-hidden="true">
                    <i class="fa fa-trash-o" />
                </span>
                <span class="sr-only">Delete</span>
            </button>
            <button type="button" class="close" aria-label="Close" @click="$refs.editModal.show()">
                <span aria-hidden="true">
                    <i class="fa fa-edit" />
                </span>
                <span class="sr-only">Edit</span>
            </button>
            <button type="button" class="close" aria-label="Close" @click="moveUp('stats', statblock)">
                <span aria-hidden="true">
                    <i class="fa fa-caret-up" />
                </span>
                <span class="sr-only">Move Up</span>
            </button>
            <button type="button" class="close" aria-label="Close" @click="moveDown('stats', statblock)">
                <span aria-hidden="true">
                    <i class="fa fa-caret-down" />
                </span>
                <span class="sr-only">Move Down</span>
            </button>
            {{ statblock.name }}
        </div>
        <table v-if="statblock.type === 'table'" class="table table-sm text-center">
            <tr>
                <th v-for="column in statblock.columns" class="text-center">
                    {{ column.name }}
                </th>
            </tr>
            <tr v-for="row in statblock.rows">
                <td v-for="cell in row">
                    {{ renderCell(cell, $index) }}
                </td>
            </tr>
        </table>
        <table v-else class="table table-sm">
            <tr v-for="item in statblock.items">
                <td><b>{{ item.key }}</b></td>

                <!-- Value -->
                <td>{{ renderValue(item) }}</td>
            </tr>
        </table>
    </div>

    <!-- Edit Modal -->
    <AddEditModal v-model:stats="statblock" v-ref:edit-modal :save="save" />

    <!-- Delete Modal -->
    <DeleteModal v-ref:delete-modal :title="deleteTitle" :text="'this statblock'" :on-delete="remove" />
</template>

<style lang="scss">
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

    import AddEditModal from '../modals/statAddEdit.vue';
    import DeleteModal from '../../../../client/components/ui/deleteModal.vue';

    export default {
        components: {
            addEditModal: AddEditModal,
            deleteModal: DeleteModal,
        },
        props: {
            statblock: {
                type: Object,
                twoWay: true,
                required: true,
            },
            context: {
                type: Object,
                required: true,
            },
            moveUp: {
                type: Function,
                required: true,
            },
            moveDown: {
                type: Function,
                required: true,
            },
            save: {
                type: Function,
                required: true,
                default: () => {},
            },
            onDelete: {
                type: Function,
                default: () => { console.warn('Failed to pass in `onDelete` function. Doing nothing.'); },
            },
        },
        data()
        {
            return {};
        },
        computed: {
            deleteTitle()
            {
                return `"${ this.statblock.name }" Statblock`;
            },
        },
        methods: {
            renderCell(cell, index)
            {
                var type = this.statblock.columns[index].type;

                switch (type)
                {
                    case 'boolean':
                        return cell ? '<i class="fa fa-check-square"></i>' : '<i class="fa fa-square-o"></i>';

                    case 'computed':
                        return this.evalComputed(cell);

                    default:
                        return cell;
                }
            },
            renderValue(item)
            {
                switch (item.type)
                {
                    case 'boolean':
                        return `${ item.value ? '<i class="fa fa-check-square"></i>' : '<i class="fa fa-square-o"></i>' } ${ item.description }`;

                    case 'computed':
                        return this.evalComputed(item.value);

                    default:
                        return item.value;
                }
            },
            evalComputed(evalStr)
            {
                return rpgdice.eval(evalStr, this.context).value;
            },
            remove()
            {
                this.onDelete(this.statblock);
            },
        },
    };
</script>
