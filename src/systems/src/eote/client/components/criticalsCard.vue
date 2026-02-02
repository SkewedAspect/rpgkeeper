<!----------------------------------------------------------------------------------------------------------------------
  -- Criticals Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-criticals-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="heart-rate" />
                    <span class="d-none d-md-inline">Criticals</span>
                </h5>
            </div>
        </template>

        <!-- Card Body -->
        <BInputGroup>
            <BFormSelect
                v-model="selectedCritical"
                :options="formattedCriticals"
                :disabled="readonly"
            />
            <template #append>
                <BButton
                    variant="primary"
                    style="max-width: 48px; min-width: 48px;"
                    title="Add selected Critical"
                    :disabled="readonly"
                    @click="addCritical()"
                >
                    <Fa icon="plus" />
                </BButton>
            </template>
        </BInputGroup>

        <BInputGroup v-if="selectedCriticalNeedsDetail" class="mt-2">
            <BFormSelect v-if="selectedCriticalDetailType === 'limb'" v-model="detailInput" :disabled="readonly">
                <option value="">
                    Select limb...
                </option>
                <option v-for="limb in availableLimbs" :key="limb" :value="limb">
                    {{ limb }}
                </option>
            </BFormSelect>
            <BFormSelect
                v-else-if="selectedCriticalDetailType === 'characteristic'"
                v-model="detailInput"
                :disabled="readonly"
            >
                <option value="">
                    Select characteristic...
                </option>
                <option v-for="char in availableCharacteristics" :key="char" :value="char">
                    {{ char }}
                </option>
            </BFormSelect>
        </BInputGroup>

        <BInputGroup class="mt-2">
            <BFormInput v-model.number="rollBonus" type="number" min="0" step="1" placeholder="Crit. bonus" />
            <template #append>
                <BButton
                    variant="primary"
                    style="min-width: 48px;"
                    title="Roll for a random Critical"
                    :disabled="readonly"
                    @click="rollCritical()"
                >
                    <Fa icon="dice" />
                    Roll Crit.
                </BButton>
            </template>
        </BInputGroup>

        <hr class="mt-2 mb-2">

        <template v-for="(injury, index) in currentCriticals" :key="index">
            <CriticalCard
                v-if="findCritical(injury.name)"
                class="mt-2"
                :critical="findCritical(injury.name)!"
                :injury="injury"
                :readonly="readonly"
                @remove="removeCritical(index)"
                @update="updateCritical(index, $event)"
            />
        </template>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, onMounted, ref } from 'vue';
    import { storeToRefs } from 'pinia';
    import { sortBy } from 'lodash';

    // Store
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';

    // Models
    import type { EoteCritical, EoteCriticalInjury, EoteOrGenCharacter } from '../../models.ts';

    // Managers
    import diceMan from '@client/lib/utils/dice';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import CriticalCard from './sub/criticalCard.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        readonly : boolean;
    }

    const props = defineProps<Props>();

    type Events = (e : 'save') => void;

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharacterStore());

    const selectedCritical = ref(diceMan.eoteCriticals[0].title);
    const currentCriticals = ref<EoteCriticalInjury[]>([]);
    const rollBonus = ref<number | undefined>(undefined);
    const detailInput = ref<string>('');

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<EoteOrGenCharacter>(() => current.value as any);
    const readonly = computed(() => props.readonly);

    const criticals = computed(() => diceMan.eoteCriticals);

    const selectedCriticalNeedsDetail = computed(() =>
    {
        return [ 'Crippled', 'Maimed', 'Gruesome Injury' ].includes(selectedCritical.value);
    });

    const selectedCriticalDetailType = computed(() =>
    {
        if(selectedCritical.value === 'Gruesome Injury')
        {
            return 'characteristic';
        }
        else if([ 'Crippled', 'Maimed' ].includes(selectedCritical.value))
        {
            return 'limb';
        }

        return null;
    });

    const usedDetailsForCritical = computed(() =>
    {
        return currentCriticals.value
            .filter((injury) => injury.name === selectedCritical.value && injury.detail)
            .map((injury) => injury.detail as string);
    });

    const availableLimbs = computed(() =>
    {
        const allLimbs = [ 'Right Arm', 'Left Arm', 'Right Leg', 'Left Leg' ];
        return allLimbs.filter((limb) => !usedDetailsForCritical.value.includes(limb));
    });

    const availableCharacteristics = computed(() =>
    {
        const allChars = [ 'Brawn', 'Agility', 'Intellect', 'Cunning', 'Willpower', 'Presence' ];
        return allChars.filter((char) => !usedDetailsForCritical.value.includes(char));
    });
    const formattedCriticals = computed(() =>
    {
        return criticals.value.map((critical) =>
        {
            const lowerBound = (`${ critical.range[0] }`).padStart(3, '0');
            const upperBound = (`${ critical.range[1] }`).padStart(3, '0');

            let bounds = `${ lowerBound }-${ upperBound }`;
            let severity = `(${ critical.severity })`;

            if(upperBound === 'Infinity')
            {
                bounds = `${ lowerBound }+`;
            }

            if(!critical.severity)
            {
                severity = '';
            }

            return {
                value: critical.title,
                text: `${ bounds }: ${ critical.title } ${ severity }`,
            };
        });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function saveChar() : void
    {
        character.value.details.health.criticalInjuries = currentCriticals.value;
        emit('save');
    }

    function sortCriticals() : void
    {
        const health = character.value.details.health;
        currentCriticals.value = sortBy(
            health.criticalInjuries,
            (critical) => critical.value || 9000,
            (critical) => critical.name
        );
    }

    function findCritical(criticalName : string) : EoteCritical | undefined
    {
        return criticals.value.find((crit) => crit.title === criticalName);
    }

    function addCritical(critical ?: EoteCritical, detail ?: string) : void
    {
        critical = critical || criticals.value.find((crit) => crit.title === selectedCritical.value);
        if(critical)
        {
            const injury : EoteCriticalInjury = {
                name: critical.title,
                value: (critical.severity ?? 9001),
            };

            if(detail || detailInput.value)
            {
                injury.detail = detail || detailInput.value;
            }

            character.value.details.health.criticalInjuries.push(injury);
            sortCriticals();

            detailInput.value = '';

            return saveChar();
        }
    }

    function removeCritical(index : number) : void
    {
        currentCriticals.value.splice(index, 1);
        character.value.details.health.criticalInjuries = currentCriticals.value;
        saveChar();
    }

    function updateCritical(index : number, injury : EoteCriticalInjury) : void
    {
        currentCriticals.value[index] = injury;
        character.value.details.health.criticalInjuries = currentCriticals.value;
        saveChar();
    }

    function getAvailableDetailsForCritical(criticalName : string) : string[]
    {
        const usedDetails = currentCriticals.value
            .filter((injury) => injury.name === criticalName && injury.detail)
            .map((injury) => injury.detail as string);

        if(criticalName === 'Gruesome Injury')
        {
            const allChars = [ 'Brawn', 'Agility', 'Intellect', 'Cunning', 'Willpower', 'Presence' ];
            return allChars.filter((char) => !usedDetails.includes(char));
        }
        else if(criticalName === 'Crippled' || criticalName === 'Maimed')
        {
            const allLimbs = [ 'Right Arm', 'Left Arm', 'Right Leg', 'Left Leg' ];
            return allLimbs.filter((limb) => !usedDetails.includes(limb));
        }

        return [];
    }

    function generateRandomDetail(criticalName : string) : string | undefined
    {
        const available = getAvailableDetailsForCritical(criticalName);
        if(available.length === 0)
        {
            return undefined;
        }

        if(criticalName === 'Gruesome Injury')
        {
            const roll = Math.floor(Math.random() * 10) + 1;
            let selected : string;
            if(roll >= 1 && roll <= 3) { selected = 'Brawn'; }
            else if(roll >= 4 && roll <= 6) { selected = 'Agility'; }
            else if(roll === 7) { selected = 'Intellect'; }
            else if(roll === 8) { selected = 'Cunning'; }
            else if(roll === 9) { selected = 'Presence'; }
            else { selected = 'Willpower'; }

            if(available.includes(selected))
            {
                return selected;
            }

            return available[Math.floor(Math.random() * available.length)];
        }
        else if(criticalName === 'Crippled' || criticalName === 'Maimed')
        {
            return available[Math.floor(Math.random() * available.length)];
        }

        return undefined;
    }

    function rollCritical(bonus = 0) : void
    {
        bonus = bonus || rollBonus.value || 0;
        const totalBonus = bonus + (currentCriticals.value.length * 10);
        const rolledCritical = diceMan.rollEotECritical(totalBonus);
        if(rolledCritical)
        {
            const needsDetail = [ 'Crippled', 'Maimed', 'Gruesome Injury' ].includes(rolledCritical.title);
            if(needsDetail)
            {
                const detail = generateRandomDetail(rolledCritical.title);
                addCritical(rolledCritical, detail);
            }
            else
            {
                addCritical(rolledCritical);
            }
        }

        rollBonus.value = undefined;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle
    //------------------------------------------------------------------------------------------------------------------

    onMounted(() =>
    {
        sortCriticals();
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
