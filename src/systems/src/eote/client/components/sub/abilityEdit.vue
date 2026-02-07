<!----------------------------------------------------------------------------------------------------------------------
  -- abilityEdit.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="ability-edit">
        <SupplementSelect
            ref="suppSelect"
            label="Abilities"
            label-class="fw-bold"
            :available="mergedAvailable"
            :selected="mergedSelected"
            @add="onAbilityAdd"
            @remove="onAbilityRemove"
            @new="onAbilityNew"
            @edit="onAbilityEdit"
            @delete="onAbilityDelete"
        >
            <template #remove-button="{ instance }">
                <BButton
                    v-if="!isSpeciesAbility(instance.id)"
                    class="ms-2 text-nowrap"
                    variant="danger"
                    title="Remove"
                    @click.prevent.stop="onAbilityRemove(instance)"
                >
                    <Fa icon="times" />
                </BButton>
                <span v-else :title="`From ${ speciesLabel }`" class="d-inline-block">
                    <BButton
                        class="ms-2 text-nowrap"
                        variant="outline-secondary"
                        disabled
                    >
                        <Fa icon="dna" />
                    </BButton>
                </span>
            </template>
            <template #preview="{ supplement }">
                <MarkdownBlock :text="supplement.description ?? 'No description.'" inline />
                <div class="text-end mt-2">
                    <h5 class="mb-1">
                        <BBadge v-if="isSpeciesAbility(supplement.id)" variant="info">
                            {{ speciesLabel }}
                        </BBadge>
                        <ScopeBadge v-else :supplement="supplement" />
                    </h5>
                    <Reference
                        v-if="supplement.reference"
                        :reference="String(supplement.reference)"
                    />
                </div>
            </template>
        </SupplementSelect>

        <!-- Modals -->
        <AddEditAbilityModal ref="addEditAbilityModal" @add="onAbilityAdd" />
        <DeleteModal
            ref="delAbilityModal"
            :name="delAbility.name"
            type="ability"
            @hidden="onDelAbilityHidden"
            @delete="onDelAbilityDelete"
        />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, useTemplateRef } from 'vue';

    // Models
    import type { Supplement } from '@rpgk/core';
    import type { SpeciesAbility } from '../../../models.ts';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Components
    import SupplementSelect from '@client/components/character/supplementSelect.vue';
    import DeleteModal from '@client/components/ui/deleteModal.vue';
    import AddEditAbilityModal from '../modals/addEditAbilityModal.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import Reference from '@client/components/character/referenceBlock.vue';
    import ScopeBadge from '@client/components/character/scopeBadge.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    const SPECIES_PREFIX = 'species:';

    interface Props
    {
        abilities : string[];
        speciesAbilities ?: SpeciesAbility[];
        speciesReference ?: string | string[];
    }

    const props = withDefaults(defineProps<Props>(), {
        speciesAbilities: () => [],
        speciesReference: '',
    });

    const emit = defineEmits<{
        'update:abilities' : [abilities : string[]];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const delAbility = ref<{ id ?: string, name ?: string }>({
        id: undefined,
        name: undefined,
    });

    const addEditAbilityModal = ref<InstanceType<typeof AddEditAbilityModal> | null>(null);
    const delAbilityModal = ref<InstanceType<typeof DeleteModal> | null>(null);
    const suppSelect = useTemplateRef('suppSelect');

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'eote');
    const allAbilities = computed(() => supplementStore.get<Supplement>(mode.value, 'ability'));

    const speciesLabel = computed(() =>
    {
        return mode.value === 'genesys' ? 'Archetype' : 'Species';
    });

    // Create virtual supplement objects from species abilities
    const speciesAbilitySupplements = computed<Supplement[]>(() =>
    {
        return props.speciesAbilities.map((ability) => ({
            id: `${ SPECIES_PREFIX }${ ability.name }`,
            name: ability.name,
            description: ability.description,
            reference: props.speciesReference,
            official: true,
        }));
    });

    // Merge real supplements with species ability virtuals for the available list
    const mergedAvailable = computed(() => [ ...speciesAbilitySupplements.value, ...allAbilities.value ]);

    // Merge species ability IDs with character ability IDs for the selected list
    const mergedSelected = computed(() =>
    {
        const speciesIds = speciesAbilitySupplements.value.map((sa) => sa.id).filter((id) : id is string => !!id);
        return [ ...speciesIds, ...props.abilities ];
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function isSpeciesAbility(id ?: string) : boolean
    {
        return !!id && id.startsWith(SPECIES_PREFIX);
    }

    function onAbilityAdd(ability : { id ?: string }) : void
    {
        if(!ability.id || isSpeciesAbility(ability.id)) { return; }

        // Don't add duplicates
        if(props.abilities.includes(ability.id)) { return; }

        emit('update:abilities', [ ...props.abilities, ability.id ]);
    }

    function onAbilityRemove(ability : { id ?: string }) : void
    {
        if(!ability.id || isSpeciesAbility(ability.id)) { return; }
        emit('update:abilities', props.abilities.filter((id) => id !== ability.id));
    }

    function onAbilityNew() : void
    {
        addEditAbilityModal.value?.show();
    }

    function onAbilityEdit(ability : Supplement) : void
    {
        if(isSpeciesAbility(ability.id)) { return; }
        addEditAbilityModal.value?.show(ability);
    }

    function onAbilityDelete(ability : Supplement) : void
    {
        if(isSpeciesAbility(ability.id)) { return; }

        delAbility.value.id = ability.id;
        delAbility.value.name = ability.name;

        delAbilityModal.value?.show();
    }

    function onDelAbilityHidden() : void
    {
        delAbility.value.id = undefined;
        delAbility.value.name = undefined;
    }

    async function onDelAbilityDelete() : Promise<void>
    {
        suppSelect.value?.clearSelection();

        if(delAbility.value.id)
        {
            await supplementStore.remove(mode.value, 'ability', delAbility.value.id);
        }

        emit('update:abilities', props.abilities.filter((id) => id !== delAbility.value.id));
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
