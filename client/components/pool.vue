<!--------------------------------------------------------------------------------------------------------------------->
<!-- A Resource Pool                                                                                                 -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="pool">
        <div class="clearfix">
            <md-button class="md-icon-button md-dense edit-btn" @click="openEditMax()" v-if="!editDisabled">
                <md-icon>edit</md-icon>
            </md-button>
            <div v-if="name" class="pool-label md-subheading">{{ name }}</div>
        </div>
        <div v-if="max > 0" class="pool-icons">
            <span v-for="index in poolRange">
                <md-icon v-if="isChecked(index)"
                         :class="[checkHover(index), { 'read-only': editDisabled }]"
                         @mouseover.native="onMouseOver(index)"
                         @mouseout.native="onMouseOut(index)"
                         @click.prevent.stop="setIndex(index)">
                    {{ checkedIcon }}
                </md-icon>
                <md-icon v-else
                         :class="[checkHover(index), { 'read-only': editDisabled }]"
                         @mouseover.native="onMouseOver(index)"
                         @mouseout.native="onMouseOut(index)"
                         @click.prevent.stop="setIndex(index)">
                    {{ uncheckedIcon }}
                </md-icon>
            </span>
        </div>
        <h2 class="md-caption" v-else>No Pool.</h2>

        <!-- Edit Dialog -->

        <md-dialog ref="editPool">
            <md-dialog-title>Edit Pool</md-dialog-title>

            <md-dialog-content>
                <md-input-container>
                    <label>Maximum</label>
                    <md-input type="number" v-model="editMax"></md-input>
                </md-input-container>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="cancelEdit()">Cancel</md-button>
                <md-button class="md-primary" @click="saveEdit()">Ok</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    #pool {
        .pool-label {
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);
            margin-bottom: 5px;
        }

        .pool-icons {
            .md-icon {
                cursor: pointer;

                &.read-only {
                    cursor: inherit;
                }
            }
        }

        .edit-btn {
            float: right;
            width: 24px;
            height: 24px;
            min-width: 24px;
            min-height: 24px;
            line-height: 24px;

            .md-icon {
                font-size: 16px;
                width: 16px;
                height: 16px;
                min-width: 16px;
                min-height: 16px;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------
    
    import _ from 'lodash';
    
    //------------------------------------------------------------------------------------------------------------------

    export default {
        props: {
            pool: {
                type: Object,
                required: true
            },
            name: { type: String },
            checkedIcon: {
                type: String,
                default: 'check_box'
            },
            uncheckedIcon: {
                type: String,
                default: 'check_box_outline_blank'
            },
            editDisabled: {
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
                get: function(){ return this.pool.max; },
                set: function(val)
                {
                    this.pool.max = val < 0 ? undefined : val;
                },
            },
            current: {
                get: function(){ return this.pool.current; },
                set: function(val)
                {
                    this.pool.current = val < 0 ? undefined : val;
                },
            },
            currentIndex()
            {
                const index = this.current - 1;
                return index < 0 ? undefined : index;
            }
        },
        methods: {
            openEditMax()
            {
                if(!this.editDisabled)
                {
                    this.editMax = this.pool.max;
                    this.$refs.editPool.open();
                } // end if
            },
            onMouseOver(index)
            {
                if(!this.editDisabled)
                {
                    this.hoveredIndex = index;
                } // end if
            },
            onMouseOut()
            {
                if(!this.editDisabled)
                {
                    this.hoveredIndex = undefined;
                } // end if
            },
            setIndex(index)
            {
                if(!this.editDisabled)
                {
                    if(index == this.currentIndex)
                    {
                        this.current -= 1;
                    }
                    else
                    {
                        this.current = (index + 1);
                    } // end if
                } // end if
            },
            checkHover(index)
            {
                if(index <= this.hoveredIndex)
                {
                    return "md-accent";
                } // end if
            },
            isChecked(index)
            {
                return index <= this.currentIndex;
            },
            cancelEdit()
            {
                this.editMax = null;
                this.$refs.editPool.close();
            },
            saveEdit()
            {
                this.pool.max = this.editMax;
                this.editMax = null;
                this.$refs.editPool.close();
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->