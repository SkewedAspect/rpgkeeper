<!----------------------------------------------------------------------------------------------------------------------
  -- CoC Rolls
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="rolls" icon="dice" title="Rolls" fill>
        <BInputGroup>
            <BFormInput v-model="dice" number type="number" min="0" max="999" step="1" :disabled="readonly"></BFormInput>
            <template #append>
                <BDropdown>
                    <template #button-content>
                        <span v-if="selectedDice === 'd100'">
                            <fa icon="dice-d10"></fa>
                            <fa icon="dice-d10"></fa>
                        </span>
                        <fa v-else :icon="`dice-${ selectedDice }`"></fa>
                        {{ selectedDice.toUpperCase() }}
                    </template>
                    <BDropdownItem v-for="die in diceOptions" :key="die" @click="selectedDice = die">
                        <fa :icon="`dice-${ die }`"></fa>
                        {{ die.toUpperCase() }}
                    </BDropdownItem>
                    <BDropdownItem @click="selectedDice = 'd100'">
                        <fa icon="dice-d10"></fa>
                        <fa icon="dice-d10"></fa>
                        D100
                    </BDropdownItem>
                </BDropdown>
            </template>
        </BInputGroup>

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
        <div v-if="!readonly" class="text-end">
            <BButton :disabled="readonly" @click="clearRolls()">
                <fa icon="times"></fa>
                Clear
            </BButton>
            <BButton variant="primary" class="ms-1" :disabled="readonly || !dice" @click="roll(dice)">
                <fa icon="dice"></fa>
                Roll
            </BButton>
        </div>
    </RpgkCard>
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

    import { computed, ref } from 'vue';

    // Interfaces
    import { DiceRoll } from '../../../../common/interfaces/common';

    // Utils
    import diceUtil from '../../../lib/utils/dice';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';

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

    const diceOptions = [
        'd4',
        'd6',
        'd8',
        'd10',
        'd12',
        'd20',
    ] as const;

    const selectedDice = ref<typeof diceOptions[number] | 'd100'>('d100');

    const dice = ref<number | null>(null);
    const rolls = ref<DiceRoll[]>([]);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function roll(diceNum : number, rollName ?: string) : void
    {
        const diceRoll = diceUtil.roll(`${ diceNum }${ selectedDice.value }`);
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
