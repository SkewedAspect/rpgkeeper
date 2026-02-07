//----------------------------------------------------------------------------------------------------------------------
// Species/Archetype Lookup Composable
//----------------------------------------------------------------------------------------------------------------------

import { type ComputedRef, type Ref, computed } from 'vue';

// Models
import type { EoteSpecies } from '../../models.ts';

// Stores
import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';
import { useSystemStore } from '@client/lib/resource-access/stores/systems';

//----------------------------------------------------------------------------------------------------------------------

/**
 * Composable for looking up a species (EotE) or archetype (Genesys) from the supplement store.
 * Handles the system-specific supplement type mapping automatically.
 */
interface SpeciesLookupResult
{
    mode : ComputedRef<string>;
    supplementType : ComputedRef<string>;
    species : ComputedRef<EoteSpecies | null>;
}

export function useSpeciesLookup(speciesRef : Ref<string | null>) : SpeciesLookupResult
{
    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    const mode = computed(() => systemStore.current?.id ?? 'eote');

    const supplementType = computed(() =>
    {
        return mode.value === 'genesys' ? 'archetype' : 'species';
    });

    const species = computed<EoteSpecies | null>(() =>
    {
        if(!speciesRef.value)
        {
            return null;
        }

        const speciesList = supplementStore.get<EoteSpecies>(mode.value, supplementType.value);
        return speciesList.find((item) => item.id === speciesRef.value) ?? null;
    });

    return { mode, supplementType, species };
}

//----------------------------------------------------------------------------------------------------------------------
