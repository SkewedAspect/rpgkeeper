<!----------------------------------------------------------------------------------------------------------------------
  -- Criticals Card
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-criticals-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <fa class="me-1" icon="heart-rate"></fa>
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
            ></BFormSelect>
            <BInputGroupAppend>
                <BButton
                    variant="primary"
                    style="max-width: 48px; min-width: 48px;"
                    title="Add selected Critical"
                    :disabled="readonly"
                    @click="addCritical()"
                >
                    <fa icon="plus"></fa>
                </BButton>
            </BInputGroupAppend>
        </BInputGroup>

        <BInputGroup class="mt-2">
            <BFormInput v-model="rollBonus" number type="number" min="0" step="1" placeholder="Crit. bonus"></BFormInput>
            <BInputGroupAppend>
                <BButton
                    variant="primary"
                    style="min-width: 48px;"
                    title="Roll for a random Critical"
                    :disabled="readonly"
                    @click="rollCritical()"
                >
                    <fa icon="dice"></fa>
                    Roll Crit.
                </BButton>
            </BInputGroupAppend>
        </BInputGroup>

        <hr class="mt-2 mb-2" />

        <CriticalCard
            v-for="(critical, index) in currentCriticals"
            :key="index"
            class="mt-2"
            :critical="findCritical(critical.name)"
            :readonly="readonly"
            @remove="removeCritical(index)"
        ></CriticalCard>
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, onMounted, ref } from 'vue';
    import { storeToRefs } from 'pinia';
    import { sortBy } from 'lodash';

    // Store
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Models
    import { EoteCritical, EoteOrGenCharacter } from '../../../../common/interfaces/systems/eote';

    // Managers
    import diceMan from '../../../lib/utils/dice';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';
    import CriticalCard from './components/criticalCard.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        readonly : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'save') : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharactersStore());

    const selectedCritical = ref(diceMan.eoteCriticals[0].title);
    const currentCriticals = ref([]);
    const rollBonus = ref(undefined);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<EoteOrGenCharacter>(() => current.value as any);
    const readonly = computed(() => props.readonly);

    const criticals = computed(() => diceMan.eoteCriticals);
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
                html: `${ bounds }: ${ critical.title } ${ severity }`
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

    function findCritical(criticalName) : EoteCritical
    {
        return criticals.value.find((crit) => crit.title === criticalName);
    }

    function addCritical(critical : EoteCritical) : void
    {
        critical = critical || criticals.value.find((crit) => crit.title === selectedCritical.value);
        if(critical)
        {
            character.value.details.health.criticalInjuries
                .push({ name: critical.title, value: (critical.severity ?? 9001) });
            sortCriticals();

            return saveChar();
        }
    }

    function removeCritical(index : number) : void
    {
        currentCriticals.value.splice(index, 1);
        character.value.details.health.criticalInjuries = currentCriticals.value;
        return this.saveChar();
    }

    function rollCritical(bonus = 0) : void
    {
        bonus = bonus || rollBonus.value || 0;
        const totalBonus = bonus + (currentCriticals.value.length * 10);
        addCritical(diceMan.rollEotECritical(totalBonus));

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
