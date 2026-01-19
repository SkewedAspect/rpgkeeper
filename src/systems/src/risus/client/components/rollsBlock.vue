<!----------------------------------------------------------------------------------------------------------------------
  -- Risus Rolls
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="rolls" icon="dice" title="Rolls" fill>
        <BInputGroup append="D6">
            <BFormInput v-model.number="dice" type="number" min="0" max="999" step="1" :disabled="readonly" />
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
                <Fa icon="times" />
                Clear
            </BButton>
            <BButton variant="primary" class="ms-1" :disabled="readonly || !dice" @click="roll(dice)">
                <Fa icon="dice" />
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
    import type { DiceRoll } from '@rpgk/core';

    // Utils
    import diceUtil from '@client/lib/utils/dice';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';

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
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function roll(diceNum : number | null, rollName ?: string) : void
    {
        if(diceNum === null)
        {
            return;
        }

        const diceRoll = diceUtil.roll(`${ diceNum }d6`);
        rolls.value.unshift({
            roll: diceRoll,
            name: rollName ?? '',
            display: `${ diceRoll.render() } = ${ diceRoll.value }`,
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
