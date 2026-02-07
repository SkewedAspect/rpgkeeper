<!----------------------------------------------------------------------------------------------------------------------
  -- speciesTag.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <span class="eote-species">
        <BBadge :id="`species-${ uid }`" variant="secondary">
            {{ speciesName }}
        </BBadge>
        <BPopover
            v-if="species"
            :id="`species-popover-${ uid }`"
            :title="speciesName"
            :target="`species-${ uid }`"
            triggers="hover"
            placement="auto"
            teleport-to="body"
        >
            <div :class="`${ mode }-system species-popover`">
                <!-- Characteristics -->
                <div class="characteristics mb-2">
                    <div
                        v-for="(value, char) in species.characteristics"
                        :key="char"
                        class="char-item"
                    >
                        <span class="char-label">{{ charAbbrev(char) }}</span>
                        <span class="char-value">{{ value }}</span>
                    </div>
                </div>

                <!-- Thresholds and XP -->
                <div class="thresholds mb-2">
                    <span class="threshold-item">
                        <b>WT:</b> {{ species.woundThreshold }}
                    </span>
                    <span class="threshold-item">
                        <b>ST:</b> {{ species.strainThreshold }}
                    </span>
                    <span class="threshold-item">
                        <b>XP:</b> {{ species.startingXP }}
                    </span>
                </div>

                <!-- Description -->
                <MarkdownBlock
                    v-if="species.description"
                    :text="species.description"
                    class="mb-2"
                />

                <!-- Special Abilities (EotE only) -->
                <div v-if="eoteSpecialAbilities" class="abilities mb-2">
                    <b>Special Abilities:</b>
                    <MarkdownBlock :text="eoteSpecialAbilities" inline />
                </div>

                <!-- Abilities -->
                <div v-if="species.abilities.length > 0" class="abilities mb-2">
                    <b>Abilities:</b>
                    <ul class="mb-0 ps-3">
                        <li v-for="(ability, idx) in species.abilities" :key="idx">
                            <b>{{ ability.name }}:</b> {{ ability.description }}
                        </li>
                    </ul>
                </div>

                <!-- Skill Modifiers -->
                <div v-if="species.skillModifiers && species.skillModifiers.length > 0" class="skills mb-2">
                    <b>Starting Skills: </b>
                    <span v-for="(mod, idx) in species.skillModifiers" :key="mod.skill">
                        {{ mod.skill }} {{ mod.startingRanks }}<span v-if="idx < species.skillModifiers.length - 1">, </span>
                    </span>
                </div>

                <!-- Reference -->
                <Reference v-if="speciesReference" class="float-end mt-2 mb-2" :reference="speciesReference" />
            </div>
        </BPopover>
    </span>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    // Target popovers with IDs starting with 'species-popover-'
    [id^="species-popover-"].popover {
        --bs-popover-max-width: 500px;
        max-width: 500px !important;
        width: 500px;

        .popover-body {
            max-height: 400px;
            overflow-y: auto;
        }
    }
</style>

<style lang="scss" scoped>
    .eote-species {
        cursor: pointer;
    }

    .species-popover {
        .characteristics {
            display: flex;
            gap: 0.5rem;
            justify-content: center;

            .char-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0.25rem 0.5rem;
                background: var(--bs-tertiary-bg);
                border-radius: 0.25rem;
                min-width: 2.5rem;

                .char-label {
                    font-size: 0.7rem;
                    font-weight: bold;
                    text-transform: uppercase;
                }

                .char-value {
                    font-size: 1.1rem;
                    font-weight: bold;
                }
            }
        }

        .thresholds {
            display: flex;
            gap: 1rem;
            justify-content: center;

            .threshold-item {
                font-size: 0.9rem;
            }
        }

        .abilities ul {
            font-size: 0.9rem;
        }

        .skills {
            font-size: 0.9rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, useId } from 'vue';

    // Models
    import type { EoteSpecies } from '../../../models.ts';

    // Components
    import Reference from '@client/components/character/referenceBlock.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';

    // Utils
    import { charAbbrev } from '../../lib/charUtils.ts';
    import { useSpeciesLookup } from '../../lib/useSpeciesLookup.ts';
    import { normalizeReference } from '@client/lib/utils/misc';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        id ?: string | null;
    }

    const props = withDefaults(defineProps<Props>(), {
        id: null,
    });

    const uid = useId();

    const speciesRef = computed(() => props.id ?? null);
    const { mode, species } = useSpeciesLookup(speciesRef);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const speciesName = computed<string>(() =>
    {
        if(!props.id)
        {
            return 'None';
        }
        return species.value?.name ?? 'Unknown';
    });

    const speciesReference = computed<string>(() => normalizeReference(species.value?.reference));

    const eoteSpecialAbilities = computed<string>(() =>
    {
        const sp = species.value as EoteSpecies | null;
        return sp?.specialAbilities ?? '';
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
