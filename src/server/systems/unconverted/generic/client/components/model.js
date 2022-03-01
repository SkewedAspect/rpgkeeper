//----------------------------------------------------------------------------------------------------------------------
// GenericCharacter
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import rpgdice from 'rpgdicejs';

import BaseSystemCharacterModel from '../../../../client/components/character/BaseSystemCharacterModel';

//----------------------------------------------------------------------------------------------------------------------

class GenericCharacter extends BaseSystemCharacterModel
{
    constructor(base, system)
    {
        super(base, system);
    }

    // System Character
    get counters() { return this._system.counters; }
    get rolls() { return this._system.rolls; }
    get stats() { return this._system.stats; }
    get notes() { return this._system.notes; }

    get rollContext()
    {
        const context = {};

        _.each(this._system.stats, (block) =>
        {
            context[block.name] = {};
            if(block.type == 'table')
            {
                const pkIdx = _.findIndex(block.columns, { pk: true }) || 0;

                _.each(block.rows, (row) =>
                {
                    const pk = row[pkIdx];
                    const subObj = {};
                    _.each(block.columns, (col, index) =>
                    {
                        if(!col.pk)
                        {
                            // Handle computed properties
                            if(col.type === 'computed')
                            {
                                Object.defineProperty(subObj, col.name, {
                                    get() { return rpgdice.eval(row[index], context).value; }
                                });
                            }
                            else
                            {
                                subObj[col.name] = row[index];
                            }
                        }
                    });

                    context[block.name][pk] = subObj;
                });
            }

            if(block.type == 'list')
            {
                _.each(block.items, (item) =>
                {
                    // Handle computed properties
                    if(item.type === 'computed')
                    {
                        Object.defineProperty(context[block.name], item.key, {
                            get() { return rpgdice.eval(item.value, context).value; }
                        });
                    }
                    else
                    {
                        context[block.name][item.key] = item.value;
                    }
                });
            }
        });

        return context;
    }

    _ensureValidity()
    {
        super._ensureValidity();

        if(!_.isArray(this._system.counters))
        {
            this._system.counters = [];
        }

        if(!_.isArray(this._system.rolls))
        {
            this._system.rolls = [];
        }
    }

    _move(array, from, to)
    {
        array.splice(to, 0, array.splice(from, 1)[0]);
    }

    moveUp(listName, item)
    {
        const list = this._system[listName];

        if(_.isArray(list))
        {
            const from = list.indexOf(item);
            const to = Math.max(from - 1, 0);

            this._move(list, from, to);
            this.save();
        }
    }

    moveDown(listName, item)
    {
        const list = this._system[listName];

        if(_.isArray(list))
        {
            const from = list.indexOf(item);
            const to = Math.min(from + 1, (list.length - 1));

            this._move(list, from, to);
            this.save();
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------

export default GenericCharacter;

//----------------------------------------------------------------------------------------------------------------------
