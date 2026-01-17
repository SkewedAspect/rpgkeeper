<!----------------------------------------------------------------------------------------------------------------------
  -- EotE Rolls
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="rolls" icon="dice" title="Rolls" fill>
        <div class="roll-dice">
            <b>Roll:</b>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="diceDisplay" />
        </div>

        <div class="dice-input d-flex flex-wrap align-content-stretch justify-content-center">
            <BInputGroup v-for="die in diceList" :key="die" size="sm" class="text-nowrap flex-nowrap w-auto m-1">
                <template #prepend>
                    <BButton :variant="btnVariant" @click="addDie(die)">
                        <Fa icon="plus" />
                    </BButton>
                </template>
                <BInputGroupText>
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <span v-html="makeDieHTML(die)" />
                </BInputGroupText>
                <template #append>
                    <BButton :variant="btnVariant" @click="removeDie(die)">
                        <Fa icon="minus" />
                    </BButton>
                </template>
            </BInputGroup>
        </div>

        <!-- Roll History -->
        <div class="flex-fill mb-3 overflow-auto h-0">
            <div v-if="rollResult.name" class="me-1 float-start text-muted">
                <small>{{ rollResult.name }}</small>
            </div>
            <div class="text-end text-muted">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="fullResultDisplay" />
            </div>

            <h3 class="mt-3">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="uncancelledResultDisplay" />
            </h3>
        </div>

        <!-- Roll Buttons -->
        <div v-if="!readonly" class="text-end">
            <BButton :disabled="readonly" @click="clearRoll()">
                <Fa icon="times" />
                Clear
            </BButton>
            <BButton variant="primary" class="ms-1" :disabled="readonly" @click="roll()">
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

            .roll-dice {
                padding-bottom: 0.5rem;
                margin-bottom: 0.5rem;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            .dice-input {
                padding-bottom: 0.5rem;
                margin-bottom: 0.5rem;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);

                .input-group {
                    .btn.btn-light {
                        border: 1px solid #ced4da !important;
                    }
                }
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';
    import { useAccountStore } from '@client/lib/resource-access/stores/account';

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

    const { current } = storeToRefs(useCharacterStore());

    const pendingRollName = ref('');
    const rollResult = ref({
        full: [],
        uncancelled: [],
        name: '',
    });

    const dice = ref({
        proficiency: 0,
        ability: 0,
        boost: 0,
        challenge: 0,
        difficulty: 0,
        setback: 0,
        force: 0,
    });

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const diceList = computed(() =>
    {
        return Object.keys(dice.value)
            .filter((die) =>
            {
                return current.value.system !== 'genesys' || die !== 'force';
            });
    });

    const diceDisplay = computed(() =>
    {
        const rollArray = diceUtil.eoteDiceSortOrder.reduce((accum, die) =>
        {
            // Make an array with the string name of the die repeated `dice[die]` times.
            return accum.concat(Array(dice.value[die]).fill(die));
        }, []);

        return rollArray
            .sort((d1, d2) =>
            {
                return diceUtil.eoteDiceSortOrder.indexOf(d1) - diceUtil.eoteDiceSortOrder.indexOf(d2);
            })
            .reduce((results, die) => `${ results }<${ die }></${ die }>`, '');
    });

    const btnVariant = computed(() =>
    {
        if(useAccountStore().bsTheme === 'light')
        {
            return 'light';
        }
        else
        {
            return 'secondary';
        }
    });

    const fullResultDisplay = computed(() =>
    {
        return rollResult.value.full.reduce((results, result) => `${ results }<${ result }></${ result }>`, '');
    });

    const uncancelledResultDisplay = computed(() =>
    {
        return rollResult.value.uncancelled.reduce((results, result) => `${ results }<${ result }></${ result }>`, '');
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function makeDieHTML(die : string) : string
    {
        return `${ dice.value[die] } <${ die }></${ die }>`;
    }

    function addDie(die : string) : void
    {
        dice.value[die] += 1;
    }

    function removeDie(die : string) : void
    {
        dice.value[die] = Math.max(dice.value[die] - 1, 0);
    }

    function setDice(diceVals : Record<string, number> = {}, rollName = '') : void
    {
        // Set our dice counts to what was specified.
        dice.value = {
            ability: 0,
            proficiency: 0,
            difficulty: 0,
            challenge: 0,
            boost: 0,
            setback: 0,
            force: 0,
            ...diceVals,
        };

        // Set the roll name
        pendingRollName.value = rollName;
    }

    function roll(rollName ?: string) : void
    {
        rollName = rollName || pendingRollName.value;

        rollResult.value = {
            ...diceUtil.rollEotE(this.dice),
            name: rollName,
        };

        // Clear pending roll name
        pendingRollName.value = '';
    }

    function clearRoll() : void
    {
        rollResult.value = {
            full: [],
            uncancelled: [],
            name: '',
        };

        // Reset our dice counts
        setDice();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ setDice, clearRoll });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
