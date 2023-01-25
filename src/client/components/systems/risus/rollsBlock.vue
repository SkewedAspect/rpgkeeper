<!----------------------------------------------------------------------------------------------------------------------
  -- Risus Rolls
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <rpgk-card id="rolls" icon="dice" title="Rolls" fill>
        <b-input-group append="D6">
            <b-form-input v-model="dice" number type="number" min="0" max="999" step="1" :disabled="readonly"></b-form-input>
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
            <b-btn :disabled="readonly" @click="clearRolls()">
                <fa icon="times"></fa>
                Clear
            </b-btn>
            <b-btn variant="primary" class="ml-1" :disabled="readonly || !dice" @click="roll(dice)">
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

<script lang="ts" setup>
    //------------------------------------------------------------------------------------------------------------------

    import { ref } from 'vue';

    // Interfaces
    import { DiceRoll } from '../../../../common/interfaces/common';

    // Utils
    import diceUtil from '../../../lib/utils/dice';

    // Components
    import RpgkCard from '../../ui/card.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        readonly : boolean;
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const dice = ref<number | null>(null);
    const rolls = ref<DiceRoll[]>([]);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function roll(diceNum : number, rollName : string) : void
    {
        const diceRoll = diceUtil.roll(`${ diceNum }d6`);
        rolls.value.unshift({
            roll: diceRoll,
            name: rollName,
            display: `${ diceRoll.render() } = ${ diceRoll.value }`
        });
    }

    function clearRolls() : void
    {
        rolls.value = [];
        dice.value = null;
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ roll, clearRolls });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
