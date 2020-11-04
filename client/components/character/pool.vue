<!----------------------------------------------------------------------------------------------------------------------
  -- A Resource Pool
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="pool">
        <div v-if="max > 0" class="d-inline-block">
            <span
                v-for="index in poolRange"
                :key="index"
                class="ml-1"
                @click.prevent.stop="setIndex(index)"
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
        <div v-else class="d-inline-block">
            <h5 class="mt-1 text-muted">
                No pool
            </h5>
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
        <b-modal
            ref="editPool"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            @ok="onSave"
            @shown="onShown"
        >
            <!-- Modal Header -->
            <template slot="modal-title">
                <fa icon="file-edit"></fa>
                Edit "{{ name }}" Pool
            </template>

            <!-- Modal Content -->
            <b-form-group
                id="name-input-group"
                label="Pool Maximum"
                label-for="max-input"
            >
                <b-form-input
                    id="max-input"
                    v-model.number="editMax"
                    type="number"
                    min="0"
                    max="9999999"
                    step="1"
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
        model: {
            prop: 'pool',
            event: 'pool-changed'
        },
        props: {
            pool: {
                type: Object,
                required: true
            },
            name: {
                type: String,
                default: undefined
            },
            checkedIcon: {
                type: [ String, Array ],
                default() { return 'check-square'; }
            },
            uncheckedIcon: {
                type: [ String, Array ],
                default() { return [ 'far', 'square' ]; }
            },
            forceMax: {
                type: Number,
                default: undefined
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data()
        {
            return {
                poolMax: 0,
                poolCurrent: 0,
                hoveredIndex: undefined,
                editMax: null
            };
        },
        computed:
            {
                poolRange() { return _.range(this.max); },
                max: {
                    get()
                    {
                        return this.forceMax || this.poolMax;
                    },
                    set(val) { this.poolMax = val < 0 ? undefined : val; }
                },
                current: {
                    get() { return this.poolCurrent; },
                    set(val) { this.poolCurrent = val < 0 ? undefined : val; }
                },
                currentIndex()
                {
                    const index = this.current - 1;
                    return index < 0 ? undefined : index;
                },
                showEdit() { return !this.disabled && !this.forceMax && this.forceMax !== 0; }
            },
        mounted()
        {
            this.poolMax = this.pool.max;
            this.poolCurrent = this.pool.current;
        },
        updated()
        {
            this.poolMax = this.pool.max;
            this.poolCurrent = this.pool.current;
        },
        methods: {
            onShown()
            {
                this.editMax = this.pool.max || 0;
            },
            onSave()
            {
                this.poolMax = this.editMax;
                this.poolCurrent = Math.min(this.poolMax, this.poolCurrent);
                this.editMax = null;

                this.$emit('pool-changed', { max: this.poolMax, current: this.poolCurrent });
                charMan.save();
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

                    this.$emit('pool-changed', { max: this.poolMax, current: this.poolCurrent });
                    charMan.save();
                } // end if
            },
            checkHover(index)
            {
                if(index <= this.hoveredIndex)
                {
                    return 'text-primary';
                } // end if
            },
            isChecked(index)
            {
                return index <= this.currentIndex;
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
