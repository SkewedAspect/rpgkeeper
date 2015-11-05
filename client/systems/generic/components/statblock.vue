<template>
    <div class="card statblock">
        <div class="card-header">
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
</template>

<!--style lang="sass" src=""></style-->

<script type="text/babel">
    import rpgdice from 'rpgdicejs';

    export default {
        props: {
            statblock: {
                type: Object,
                required: true
            },
            context: {
                type: Object,
                required: true
            }
        },
        data: function()
        {
            return {};
        },
        methods: {
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