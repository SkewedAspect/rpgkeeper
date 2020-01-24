<!----------------------------------------------------------------------------------------------------------------------
  -- Risus Rolls
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <rpgk-card id="rolls" icon="dice" title="Rolls" fill>

        <b-input-group append="D6">
            <b-form-input type="number" min="0" max="999" step="1" v-model.number="dice" :disabled="readonly"></b-form-input>
        </b-input-group>

        <!-- Roll History -->
        <div class="flex-fill mt-3 mb-3 overflow-auto h-0">
            <ul class="list-unstyled">
                <li v-for="(item, index) in rolls" :key="index">
                    <div>{{ item.display }}</div>
                    <div class="text-muted">
                        <small>{{ item.name }}</small>
                    </div>
                </li>
            </ul>
        </div>

        <!-- Roll Buttons -->
        <div v-if="!readonly" class="text-right">
            <b-btn @click="clearRolls()" :disabled="readonly">
                <fa icon="times"></fa>
                Clear
            </b-btn>
            <b-btn variant="primary" class="ml-1" @click="roll(dice)" :disabled="readonly || !dice">
                <fa icon="dice"></fa>
                Roll
            </b-btn>
        </div>
    </rpgk-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #rolls {
        .card-body {
            display: flex;
            flex-direction: column;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Utils
    import diceUtil from '../../../client/api/utils/dice';

    // Components
    import RpgkCard from '../../../client/components/ui/card.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'RisusRollsCard',
        components: {
            RpgkCard
        },
        props: {
            readonly: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            roll(dice, rollName)
            {
                const roll = diceUtil.roll(`${ dice }d6`);
                this.rolls.unshift({
                    roll,
                    name: rollName,
                    display: `${ roll.render() } = ${ roll.value }`
                });
            },
            clearRolls()
            {
                this.rolls = [];
                this.dice = null;
            }
        },
        data()
        {
            return {
                dice: null,
                rolls: [],
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
