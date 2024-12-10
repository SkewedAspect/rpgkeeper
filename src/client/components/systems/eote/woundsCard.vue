<!----------------------------------------------------------------------------------------------------------------------
  -- Wounds
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-wounds-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="heart" />
                    <span class="d-none d-md-inline">Wounds</span>
                </h5>
                <div v-if="!readonly" class="ms-auto">
                    <BButton size="sm" style="margin-bottom: 1px;" @click="openEditModal()">
                        <Fa icon="edit" fixed-width />
                        <span class="d-none d-md-inline">Edit</span>
                    </BButton>
                </div>
            </div>
        </template>

        <!-- Card Body -->
        <div class="d-flex">
            <BCard class="flex-fill me-2" no-body>
                <div class="p-2 text-center">
                    <b>Wounds</b>
                    <hr class="m-1">
                    <h5 class="m-0">
                        <span
                            :class="woundTextClass"
                        >{{ health.wounds }}</span> / <small class="text-muted">{{ health.woundThreshold }}</small>
                    </h5>
                </div>
            </BCard>
            <BCard class="flex-fill" no-body>
                <div class="p-2 text-center">
                    <b>Strain</b>
                    <hr class="m-1">
                    <h5 class="m-0">
                        <span
                            :class="strainTextClass"
                        >{{ health.strain }}</span> / <small class="text-muted">{{ health.strainThreshold }}</small>
                    </h5>
                </div>
            </BCard>
        </div>
        <BButtonGroup class="mt-1 w-100">
            <BButton
                v-b-tooltip.hover
                variant="outline-secondary"
                title="Use a stimpack"
                :disabled="readonly"
                @click="useStim"
            >
                <span v-if="mode === 'eote'">Stimpacks</span>
                <span v-else>Painkillers</span>
                ({{ stims }})
            </BButton>
            <BButton
                v-b-tooltip.hover
                variant="outline-secondary"
                style="max-width: 48px"
                title="Reset Usages"
                :disabled="readonly"
                @click="resetStims"
            >
                <Fa icon="sync" />
            </BButton>
        </BButtonGroup>
        <BInputGroup class="mt-1 text-nowrap flex-nowrap">
            <BFormInput
                v-model.number="woundsInput"
                type="number"
                min="0"
                step="1"
                placeholder="Wounds"
                autocomplete="off"
                :disabled="readonly"
            />
            <template #append>
                <BButton
                    v-b-tooltip.hover
                    variant="outline-secondary"
                    title="Deal damage, applying soak"
                    :disabled="readonly"
                    @click="soakWounds()"
                >
                    <Fa icon="shield-alt" />
                </BButton>
                <BButton
                    v-b-tooltip.hover
                    variant="outline-secondary"
                    title="Deal damage directly"
                    :disabled="readonly"
                    @click="dealWounds()"
                >
                    <Fa :icon="mode === 'eote' ? 'swords-laser' : 'swords'" />
                </BButton>
                <BButton
                    v-b-tooltip.hover
                    variant="outline-secondary"
                    title="Heal wounds"
                    :disabled="readonly"
                    @click="healWounds()"
                >
                    <Fa icon="first-aid" />
                </BButton>
            </template>
        </BInputGroup>
        <BInputGroup class="mt-1">
            <BFormInput
                v-model.number="strainInput"
                type="number"
                min="0"
                step="1"
                placeholder="Strain"
                autocomplete="off"
                :disabled="readonly"
            />
            <template #append>
                <BButton
                    v-b-tooltip.hover
                    variant="outline-secondary"
                    title="Deal damage, applying soak"
                    :disabled="readonly"
                    @click="soakStrain()"
                >
                    <Fa icon="shield-alt" />
                </BButton>
                <BButton
                    v-b-tooltip.hover
                    variant="outline-secondary"
                    title="Deal damage directly"
                    :disabled="readonly"
                    @click="dealStrain()"
                >
                    <Fa :icon="mode === 'eote' ? 'swords-laser' : 'swords'" />
                </BButton>
                <BButton
                    v-b-tooltip.hover
                    variant="outline-secondary"
                    title="Heal strain"
                    :disabled="readonly"
                    @click="healStrain()"
                >
                    <Fa icon="first-aid" />
                </BButton>
            </template>
        </BInputGroup>

        <hr class="mt-2 mb-2">

        <BButtonGroup class="w-100">
            <BButton
                ref="staggeredBtn"
                v-model:pressed="health.staggered"
                :variant="health.staggered ? 'warning' : 'outline-secondary'"
                size="sm"
                :disabled="readonly"
                @click="saveChar"
            >
                Stagg.
            </BButton>
            <BButton
                ref="immobilizedBtn"
                v-model:pressed="health.immobilized"
                :variant="health.immobilized ? 'warning' : 'outline-secondary'"
                size="sm"
                :title="immobilizedText"
                :disabled="readonly"
                @click="saveChar"
            >
                Immob.
            </BButton>

            <!-- The popover shoves a span in here which breaks the CSS for removing the border radius, so we have to
            re-add the border radius on the final button. -->
            <BButton
                ref="disorientedBtn"
                v-model:pressed="health.disoriented"
                :variant="health.disoriented ? 'warning' : 'outline-secondary'"
                size="sm"
                :title="disorientedText"
                :disabled="readonly"
                :style="buttonStyleFix"
                @click="saveChar"
            >
                Disor.
            </BButton>
        </BButtonGroup>

        <!-- Tooltip Components -->
        <BTooltip :target="staggeredBtn">
            A <b>staggered</b> character cannot perform actions (including downgrading actions to maneuvers).
        </BTooltip>

        <BTooltip :target="immobilizedBtn">
            <span :class="eoteMan.mode + '-system'">
                An <b>immobilized</b> character cannot perform maneuvers (including maneuvers purchased via strain or
                <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
                by spending <advantage />)
            </span>
        </BTooltip>

        <BTooltip :target="disorientedBtn">
            <span :class="eoteMan.mode + '-system'">
                <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
                A <b>disoriented</b> character adds <setback /> (setback) to all checks they make.
            </span>
        </BTooltip>

        <!-- Edit Modal -->
        <EditModal ref="editModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Store
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Models
    import { EoteOrGenCharacter } from '../../../../common/models/systems';

    // Managers
    import eoteMan from '../../../lib/managers/systems/eote';

    // Components
    import RpgkCard from '../../ui/rpgkCard.vue';
    import EditModal from './modals/editWoundsModal.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface CriticalInjury
    {
        name : string;
        value : number;
    }

    interface Health
    {
        wounds : number;
        woundThreshold : number;
        strain : number;
        strainThreshold : number;
        criticalInjuries : CriticalInjury[];
        stimsUsed : number;
        staggered : boolean;
        immobilized : boolean;
        disoriented : boolean;
    }

    interface Wounds
    {
        wounds : number;
        woundThreshold : number;
        strain : number;
        strainThreshold : number;
    }

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

    const buttonStyleFix = 'border-top-right-radius: var(--bs-btn-border-radius); '
        + 'border-bottom-right-radius: var(--bs-btn-border-radius)';

    const { current } = storeToRefs(useCharactersStore());

    const woundsInput = ref<number>(undefined);
    const strainInput = ref<number>(undefined);

    const staggeredBtn = ref<HTMLElement | null>(null);
    const immobilizedBtn = ref<HTMLElement | null>(null);
    const disorientedBtn = ref<HTMLElement | null>(null);
    const editModal = ref<InstanceType<typeof EditModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const character = computed<EoteOrGenCharacter>(() => current.value as any);
    const mode = computed(() => eoteMan.mode);
    const readonly = computed(() => props.readonly);

    const defenses = computed(() => { return character.value.details.defenses; });
    const health = computed(() => { return character.value.details.health; });

    const isIncapacitatedWounds = computed(() =>
    {
        return health.value.wounds >= health.value.woundThreshold;
    });

    const isIncapacitatedStrain = computed(() =>
    {
        return health.value.strain >= health.value.strainThreshold;
    });

    const isDangerWounds = computed(() =>
    {
        const threshold = Math.ceil(health.value.woundThreshold / 3);
        const woundCount = health.value.woundThreshold - threshold;
        return health.value.wounds >= woundCount;
    });

    const isDangerStrain = computed(() =>
    {
        const threshold = Math.ceil(health.value.strainThreshold / 3);
        const strainCount = health.value.strainThreshold - threshold;
        return health.value.strain >= strainCount;
    });

    const woundTextClass = computed(() =>
    {
        if(isIncapacitatedWounds.value)
        {
            return 'text-danger';
        }
        else if(isDangerWounds.value)
        {
            return 'text-warning';
        }

        return undefined;
    });

    const strainTextClass = computed(() =>
    {
        if(isIncapacitatedStrain.value)
        {
            return 'text-danger';
        }
        else if(isDangerStrain.value)
        {
            return 'text-warning';
        }

        return undefined;
    });

    // const staggeredText = computed(() =>
    // {
    //     return `A <b>staggered</b> character cannot perform actions (including downgrading actions to maneuvers).`;
    // });

    const immobilizedText = computed(() =>
    {
        return ``;
    });

    const disorientedText = computed(() =>
    {
        return `<span class="${ eoteMan.mode }-system">A <b>disoriented</b> character adds <setback></setback> `
            + `(setback) to all checks they make.</span>`;
    });

    const stims = computed(() =>
    {
        // This is just here in case there's ever a desire to make the maximum flexible.
        const maxStims = 5;
        return Math.max(0, maxStims - (health.value.stimsUsed || 0));
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editModal.value.show(character.value);
    }

    function onEditSave(woundsObj : Wounds) : void
    {
        character.value.details.health.wounds = woundsObj.wounds;
        character.value.details.health.woundThreshold = woundsObj.woundThreshold;
        character.value.details.health.strain = woundsObj.strain;
        character.value.details.health.strainThreshold = woundsObj.strainThreshold;

        emit('save');
    }

    function saveChar() : void
    {
        // Save the character
        // TODO: Why does this need a timeout to actually update correctly???
        setTimeout(() =>
        {
            emit('save');
        }, 0);
    }

    function useStim() : void
    {
        if((stims.value > 0) && (health.value.wounds > 0))
        {
            const newWounds = health.value.wounds - stims.value;
            health.value.wounds = Math.max(0, newWounds);
            health.value.stimsUsed = (health.value.stimsUsed || 0) + 1;

            // Save the character
            saveChar();
        }
    }

    function resetStims() : void
    {
        health.value.stimsUsed = 0;

        // Save the character
        character.value.details.health = health.value;
        emit('save');
    }

    function dealWounds(wounds ?: number) : void
    {
        wounds = wounds || woundsInput.value || 0;

        if(wounds)
        {
            health.value.wounds += wounds;

            // You can only get to 2 x woundThreshold before we stop tracking.
            health.value.wounds = Math.min(health.value.woundThreshold * 2, health.value.wounds);

            // Clear woundsInput
            woundsInput.value = undefined;

            // Save the character
            saveChar();
        }
    }

    function soakWounds() : void
    {
        const soak = defenses.value.soak || 0;
        if(woundsInput.value > soak)
        {
            // Safety check; can never be less than 0.
            const woundsRemaining = Math.max(0, woundsInput.value - soak);

            // Apply the rest as normal wounds
            dealWounds(woundsRemaining);
        }
    }

    function healWounds(wounds ?: number) : void
    {
        wounds = wounds || woundsInput.value || 0;

        if(wounds && this.health.wounds)
        {
            health.value.wounds -= wounds;
            health.value.wounds = Math.max(0, health.value.wounds);

            // Clear woundsInput
            woundsInput.value = undefined;

            // Save the character
            saveChar();
        }
    }

    function dealStrain(strain ?: number) : void
    {
        strain = strain || strainInput.value || 0;

        if(strain)
        {
            health.value.strain += strain;

            // You can only get to strainThreshold before we stop tracking.
            health.value.strain = Math.min(health.value.strainThreshold, health.value.strain);

            // Clear woundsInput
            strainInput.value = undefined;

            // Save the character
            saveChar();
        }
    }

    function soakStrain() : void
    {
        const soak = defenses.value.soak || 0;
        if(strainInput.value > soak)
        {
            // Safety check; can never be less than 0.
            const strainRemaining = Math.max(0, strainInput.value - soak);

            // Apply the rest as normal strain
            dealStrain(strainRemaining);
        }
    }

    function healStrain(strain ?: number) : void
    {
        strain = strain || strainInput.value || 0;

        if(strain && this.health.strain)
        {
            health.value.strain -= strain;
            health.value.strain = Math.max(0, health.value.strain);

            // Clear woundsInput
            strainInput.value = undefined;

            // Save the character
            saveChar();
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
