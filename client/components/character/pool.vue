<!--------------------------------------------------------------------------------------------------------------------->
<!-- A Resource Pool                                                                                                 -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="pool">
        <div v-if="max > 0" class="d-inline-block">
            <span
                class="ml-1"
                @click.prevent.stop="setIndex(index)"
                v-for="index in poolRange"
            >
                <fa
                    :class="[checkHover(index), { 'read-only': disabled }]"
                    :icon="isChecked(index) ? checkedIcon : uncheckedIcon"
                    size="2x"
                    @mouseover="onMouseOver(index)"
                    @mouseout="onMouseOut(index)"
                ></fa>
            </span>
        </div>
        <div class="d-inline-block" v-else>
            <h5 class="mt-1 text-muted">No pool</h5>
        </div>
        <b-btn
            v-if="showEdit"
            class="ml-2 d-inline-block align-top"
            variant="outline-secondary"
            size="sm"
            @click="openEditMax"
        >
            <fa icon="edit"></fa>
            Edit
        </b-btn>

        <!-- Edit Modal -->
        <b-modal ref="editPool"
                 header-bg-variant="dark"
                 header-text-variant="white"
                 no-close-on-esc
                 no-close-on-backdrop
                 @ok="onSave"
                 @shown="onShown">

            <!-- Modal Header -->
            <template slot="modal-title">
                <fa icon="file-edit"></fa>
                Edit "{{ name }}" Pool
            </template>

            <!-- Modal Content -->
            <b-form-group
                id="name-input-group"
                label="Pool Maximum"
                label-for="max-input">
                <b-form-input
                    id="max-input"
                    type="number"
                    min="0"
                    max="9999999"
                    step="1"
                    v-model.number="editMax"
                ></b-form-input>
            </b-form-group>

            <!-- Modal Buttons -->
            <template slot="modal-ok">
                <fa icon="save"></fa>
                Save
            </template>
            <template slot="modal-cancel">
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #pool {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Managers
    import charMan from '../../api/managers/character';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        props: {
            pool: {
                type: Object,
                required: true
            },
            name: { type: String },
            checkedIcon: {
                type: [ String, Array ],
                default(){ return 'check-square'; }
            },
            uncheckedIcon: {
                type: [ String, Array ],
                default(){ return [ 'far', 'square' ]; }
            },
            forceMax: {
                type: Number
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data()
        {
            return {
                hoveredIndex: undefined,
                editMax: null
            };
        },
        computed:
        {
            poolRange(){ return _.range(this.max); },
            max: {
                get()
                {
                    return this.forceMax || this.pool.max;
                },
                set(val){ this.pool.max = val < 0 ? undefined : val; },
            },
            current: {
                get(){ return this.pool.current; },
                set(val){ this.pool.current = val < 0 ? undefined : val; },
            },
            currentIndex()
            {
                const index = this.current - 1;
                return index < 0 ? undefined : index;
            },
            showEdit(){ return !this.disabled && !this.forceMax && this.forceMax !== 0; }
        },
        methods: {
            onShown()
            {
                this.editMax = this.pool.max || 0;
            },
            onSave()
            {
                this.pool.max = this.editMax;
                this.pool.current = Math.min(this.pool.max, this.pool.current);
                this.editMax = null;
                charMan.save(charMan.selected);
            },
            openEditMax()
            {
                if(!this.disabled)
                {
                    this.editMax = this.pool.max || 0;
                    this.$refs.editPool.show();
                } // end if
            },
            onMouseOver(index)
            {
                if(!this.disabled)
                {
                    this.hoveredIndex = index;
                } // end if
            },
            onMouseOut()
            {
                if(!this.disabled)
                {
                    this.hoveredIndex = undefined;
                } // end if
            },
            setIndex(index)
            {
                if(!this.disabled)
                {
                    if(index === this.currentIndex)
                    {
                        this.current -= 1;
                    }
                    else
                    {
                        this.current = (index + 1);
                    } // end if

                    charMan.save(charMan.selected);
                } // end if
            },
            checkHover(index)
            {
                if(index <= this.hoveredIndex)
                {
                    return "text-primary";
                } // end if
            },
            isChecked(index)
            {
                return index <= this.currentIndex;
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
