//----------------------------------------------------------------------------------------------------------------------
/// GenericCharacter
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import Promise from 'bluebird';
import rpgdice from 'rpgdicejs';
import $http from 'axios';

import systemsSvc from '../../../components/systems/systemsService';

//----------------------------------------------------------------------------------------------------------------------

class GenericCharacter {
    constructor(base, system)
    {
        this._base = base;
        this._system = system;

        this._ensureValidity();
    } // end constructor

    get id(){ return this._base.id; }
    get baseURL(){ return '/characters' + (this.id ? '/' + this.id : ''); }
    get systemURL(){ return '/systems/' + this._base.system + '/character/' + this.id }
    get fullSystem(){ return systemsSvc.get(this._base.system); }

    // Base Character
    get name(){ return this._base.name; }
    set name(val){ this._base.name = val; }
    get system(){ return this._base.system; }
    set system(val){ this._base.system = val; }
    get user(){ return this._base.user; }
    set user(val){ this._base.user = val; }
    get portrait(){ return this._base.portrait; }
    set portrait(val){ this._base.portrait = val; }
    get thumbnail(){ return this._base.thumbnail; }
    set thumbnail(val){ this._base.thumbnail = val; }
    get biography(){ return this._base.biography; }
    set biography(val){ this._base.biography = val; }
    get description(){ return this._base.description; }
    set description(val){ this._base.description = val; }

    // System Character
    get counters(){ return this._system.counters; }
    get rolls(){ return this._system.rolls; }
    get stats(){ return this._system.stats; }
    get notes(){ return this._system.notes; }

    get rollContext()
    {
        var context = {};

        _.each(this._system.stats, (block) =>
        {
            context[block.name] = {};
            if(block.type == 'table')
            {
                var pkIdx = _.findIndex(block.columns, { pk: true }) || 0;

                _.each(block.rows, (row) =>
                {
                    var pk = row[pkIdx];
                    var subObj = {};
                    _.each(block.columns, (col, index) =>
                    {
                        if(!col.pk)
                        {
                            // Handle computed properties
                            if(col.type === 'computed')
                            {
                                Object.defineProperty(subObj, col.name, {
                                    get: function(){ return rpgdice.eval(row[index], context).value; }
                                });
                            }
                            else
                            {
                                subObj[col.name] = row[index];
                            } // end if
                        } // end if
                    });

                    context[block.name][pk] = subObj;
                });
            } // end if

            if(block.type == 'list')
            {
                _.each(block.items, (item) =>
                {
                    // Handle computed properties
                    if(item.type === 'computed')
                    {
                        Object.defineProperty(context[block.name], item.key, {
                            get: function(){ return rpgdice.eval(item.value, context).value; }
                        });
                    }
                    else
                    {
                        context[block.name][item.key] = item.value;
                    } // end if
                });
            } // end if
        });

        return context;
    } // end rollContext

    _ensureValidity()
    {
        if(!_.isArray(this._system.counters))
        {
            this._system.counters = [];
        } // end if

        if(!_.isArray(this._system.rolls))
        {
            this._system.rolls = [];
        } // end if

        if(!_.isArray(this._system.notes))
        {
            this._system.notes = [];
        } // end if
    } // end _ensureValidity

    _move(array, from, to)
    {
        array.splice(to, 0, array.splice(from, 1)[0]);
    } // end _move

    moveUp(listName, item)
    {
        var list = this._system[listName];

        if(_.isArray(list))
        {
            var from = list.indexOf(item);
            var to = Math.max(from - 1, 0);

            this._move(list, from, to);
            this.save();
        } // end if
    } // end moveUp

    moveDown(listName, item)
    {
        var list = this._system[listName];

        if(_.isArray(list))
        {
            var from = list.indexOf(item);
            var to = Math.min(from + 1, (list.length - 1));

            this._move(list, from, to);
            this.save();
        } // end if
    } // end moveDown

    refresh()
    {
        this.loading = Promise.join(
            this._base.refresh(),
            $http.get(this.systemURL)
                .then((response) =>
                {
                    this._system = response.data || {};
                    this._ensureValidity();
                })
        );

        return this.loading;
    } // end refresh

    save()
    {
        var promises = [$http.put(this.systemURL, this._system)];

        if(this._base.$dirty)
        {
            promises.push(this._base.save());
        } // end if

        return Promise.all(promises).then(() => this);
    } // end save

    delete()
    {
        return this._base.delete();
    } // end delete

    toJSON()
    {
        return _.assign({}, this._base.toJSON(), this._system);
    } // end toJSON
} // end GenericCharacter

//----------------------------------------------------------------------------------------------------------------------

export default GenericCharacter;

//----------------------------------------------------------------------------------------------------------------------