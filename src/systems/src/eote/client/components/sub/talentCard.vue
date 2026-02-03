<!----------------------------------------------------------------------------------------------------------------------
  -- talentCard
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BCard
        v-if="talent && talentBase"
        :id="id"
        class="eote-talent-card"
        :class="{ 'editable': !readonly }"
        no-body
        @click="onEdit"
    >
        <template #header>
            <CloseButton
                v-if="!readonly"
                class="float-end"
                style="margin-top: -3px;"
                @click.stop.prevent="onRemove"
            />
            <div class="text-nowrap text-center">
                <b>{{ talentBase?.name }}</b>
                <span v-if="talentBase.ranked" class="fw-bold ms-1">{{ talent.ranks }}</span>
                <span v-if="mode === 'genesys'">
                    (Tier {{ talentBase?.tier }})
                </span>
            </div>

            <BPopover :target="id" triggers="hover" placement="top" teleport-to="body">
                <template #title>
                    <div :class="`${ mode }-system`">
                        {{ talentBase?.name }}
                        <span v-if="talentBase?.ranked" class="ms-1">{{ talent.ranks }}</span>
                        <span v-if="mode === 'genesys'">
                            (Tier {{ talentBase?.tier }})
                        </span>
                    </div>
                </template>
                <div :class="`${ mode }-system`">
                    <div>
                        <i>{{ activation }}</i>
                    </div>
                    <MarkdownBlock :text="talentBase?.description" inline />
                    <div class="clearfix">
                        <Reference class="float-end mt-2 mb-2" :reference="talentBase?.reference ?? ''" />
                    </div>
                    <div v-if="talent.notes">
                        <hr class="mt-1 mb-1">
                        <MarkdownBlock :text="talent.notes" inline />
                    </div>
                </div>
            </BPopover>
        </template>
    </BCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
.eote-talent-card {
    .card-header {
        border-bottom: none;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
    }

    &.editable {
        cursor: pointer;

        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
            border-color: var(--bs-primary);
        }
    }
}

.dark-mode .eote-talent-card.editable:hover {
    background-color: rgba(255, 255, 255, 0.05);
}
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';

    // Models
    import type { EoteTalentInst, GenesysTalent } from '../../../models.ts';

    // Utils
    import { shortID } from '@client/lib/utils/misc';

    // Stores
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Constants
    import { activationEnum } from '../../constants';

    // Components
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import Reference from '@client/components/character/referenceBlock.vue';
    import CloseButton from '@client/components/ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        talent : EoteTalentInst
        readonly : boolean;
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        remove : [talentId : string];
        edit : [talent : EoteTalentInst];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const uuid = ref(shortID());

    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const id = computed(() => `critical-${ uuid.value }`);
    const talent = computed(() => props.talent);
    const mode = computed(() => systemStore.current?.id ?? 'eote');

    // We use GenesysTalent here because it's just `TalentBase` exported, and XOR doesn't work how I want.
    const talents = computed(() => supplementStore.get<GenesysTalent>(mode.value, 'talent'));

    const talentBase = computed<GenesysTalent | undefined>(() =>
    {
        if(props.talent && props.talent.id)
        {
            return talents.value.find((item) => item.id === talent.value.id);
        }

        return undefined;
    });

    const activation = computed(() =>
    {
        if(talentBase.value?.name)
        {
            return activationEnum[talentBase.value?.activation];
        }

        return '';
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onRemove() : void
    {
        if(!props.readonly)
        {
            emit('remove', props.talent.id);
        }
    }

    function onEdit() : void
    {
        if(!props.readonly)
        {
            emit('edit', props.talent);
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
