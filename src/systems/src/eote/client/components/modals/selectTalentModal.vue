<!----------------------------------------------------------------------------------------------------------------------
  -- SelectTalentModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="select-talent-modal">
        <SupplementBrowserModal
            ref="browserModal"
            :title="`Select Tier ${ selectedTier } Talent`"
            :supplements="tierTalents"
            @select="onTalentSelect"
        >
            <template #list-item-extra="{ supplement }">
                <BBadge class="me-1">
                    Tier {{ supplement.tier }}
                </BBadge>
            </template>

            <template #preview-title="{ supplement }">
                {{ supplement.name }}
                <span v-if="supplement.ranked" class="ms-1">
                    <BBadge variant="info">Ranked</BBadge>
                </span>
            </template>

            <template #preview="{ supplement }">
                <div :class="`${ mode }-system`">
                    <!-- Ranks selector for ranked talents -->
                    <BFormGroup
                        v-if="supplement.ranked"
                        label="Ranks"
                        label-class="fw-bold"
                        label-for="ranks-input"
                        class="mb-3"
                        style="max-width: 150px;"
                    >
                        <BFormSpinbutton
                            id="ranks-input"
                            v-model="ranks"
                            min="1"
                            max="5"
                        />
                    </BFormGroup>

                    <div class="mb-2">
                        <i>{{ getActivation(supplement) }}</i>
                    </div>
                    <MarkdownBlock :text="supplement.description" inline />
                    <Reference
                        class="float-end mt-2"
                        :reference="supplement.reference ?? ''"
                    />
                </div>
            </template>
        </SupplementBrowserModal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, useTemplateRef } from 'vue';

    // Models
    import type { EoteTalentInst, GenesysTalent } from '../../../models.ts';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Constants
    import { activationEnum } from '../../constants';

    // Components
    import SupplementBrowserModal from '@client/components/character/supplementBrowserModal.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import Reference from '@client/components/character/referenceBlock.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    const emit = defineEmits<{
        save : [talent : EoteTalentInst, replacingId ?: string];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    interface BrowserModalExposed { show : (initialSelectedId ?: string) => void; hide : () => void }
    const browserModal = useTemplateRef<BrowserModalExposed>('browserModal');
    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    const selectedTier = ref<number>(1);
    const ranks = ref<number>(1);
    const replacingTalentId = ref<string | undefined>(undefined);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const mode = computed(() => systemStore.current?.id ?? 'genesys');
    const allTalents = computed(() => supplementStore.get<GenesysTalent>(mode.value, 'talent'));

    const tierTalents = computed(() =>
    {
        return allTalents.value.filter((talent) => talent.tier === selectedTier.value);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(tier : number, existingTalent ?: EoteTalentInst) : void
    {
        selectedTier.value = tier;

        if(existingTalent)
        {
            // Editing existing talent
            replacingTalentId.value = existingTalent.id;
            ranks.value = existingTalent.ranks ?? 1;
            browserModal.value?.show(existingTalent.id);
        }
        else
        {
            // Adding new talent
            replacingTalentId.value = undefined;
            ranks.value = 1;
            browserModal.value?.show();
        }
    }

    function onTalentSelect(talent : GenesysTalent) : void
    {
        if(!talent.id)
        {
            return;
        }

        const talentInst : EoteTalentInst = {
            id: talent.id,
            ranks: talent.ranked ? ranks.value : undefined,
        };

        emit('save', talentInst, replacingTalentId.value);

        // Reset for next time
        ranks.value = 1;
        replacingTalentId.value = undefined;
    }

    function getActivation(talent : GenesysTalent) : string
    {
        return activationEnum[talent.activation];
    }

    //------------------------------------------------------------------------------------------------------------------
    // Expose
    //------------------------------------------------------------------------------------------------------------------

    defineExpose({
        show,
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
