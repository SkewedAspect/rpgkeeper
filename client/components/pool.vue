<!--------------------------------------------------------------------------------------------------------------------->
<!-- A Resource Pool                                                                                                 -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="pool">
        <div v-if="name" class="pool-label md-subheading">{{ name }}</div>
        <div v-if="max > 0" class="pool-icons">
            <span v-for="index in poolRange">
                <md-icon v-if="isChecked(index)"
                         :class="checkHover(index)"
                         @mouseover.native="onMouseOver(index)"
                         @mouseout.native="onMouseOut(index)"
                         @click.native.prevent.stop="setIndex(index)">
                    {{ checkedIcon }}
                </md-icon>
                <md-icon v-else
                         :class="checkHover(index)"
                         @mouseover.native="onMouseOver(index)"
                         @mouseout.native="onMouseOut(index)"
                         @click.native.prevent.stop="setIndex(index)">
                    {{ uncheckedIcon }}
                </md-icon>
            </span>
        </div>
        <h2 class="md-caption" v-else>No Pool.</h2>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style rel="stylesheet/scss" lang="sass" scoped>
    #pool {
        .pool-label {
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);
            margin-bottom: 5px;
        }

        .pool-icons {
            .md-icon {
                cursor: pointer;
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
            max: {
                type: Number,
                required: true
            },
            value: {},
            name: { type: String },
            checkedIcon: {
                type: String,
                default: 'check_box'
            },
            uncheckedIcon: {
                type: String,
                default: 'check_box_outline_blank'
            }
        },
        data()
        {
            return {
                hoveredIndex: undefined
            };
        },
        computed:
        {
            poolRange(){ return _.range(this.max); },
            current: {
                get: function(){ return this.value; },
                set: function(val)
                {
                    const newVal = val < 0 ? undefined : val;
                    this.$emit('input', newVal);
                },
            },
            currentIndex()
            {
                const index = this.current - 1;
                return index < 0 ? undefined : index;
            }
        },
        methods: {
            onMouseOver(index)
            {
                this.hoveredIndex = index;
            },
            onMouseOut()
            {
                this.hoveredIndex = undefined;
            },
            setIndex(index)
            {
                if(index == this.currentIndex)
                {
                    this.current -= 1;
                }
                else
                {
                    this.current = (index + 1);
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
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->