<!----------------------------------------------------------------------------------------------------------------------
  -- bioCard.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="wfrp-bio-block" :class="{ readonly: readonly }" fill>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="address-card" />
                    <span class="d-none d-md-inline">Bio</span>
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
        <BFormGroup
            id="name-input-group"
            label="Name"
            label-class="fw-bold"
        >
            <h5>{{ char.name }}</h5>
        </BFormGroup>
        <BFormGroup
            id="desc-input-group"
            label="Description"
            label-class="fw-bold"
        >
            <MarkdownBlock class="font-sm" :text="description" inline />
        </BFormGroup>

        <!-- Edit Modal -->
        <EditBioModal ref="bioModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #wfrp-bio-block {
        &.card:not(.readonly) {
            .card-header {
                padding-top: 0.5rem !important;
                padding-bottom: 0.5rem !important;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';
    import { truncate } from 'lodash';

    // Interfaces
    import { Character } from '../../../../common/models';

    // Stores
    import { useCharactersStore } from '../../../lib/stores/characters';

    // Components
    import EditBioModal from './editBioModal.vue';
    import MarkdownBlock from '../../ui/markdownBlock.vue';
    import RpgkCard from '../../ui/rpgkCard.vue';

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

    const { current } = storeToRefs(useCharactersStore());
    const bioModal = ref<InstanceType<typeof EditBioModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const readonly = computed(() => props.readonly);

    const char = computed<Character>(() => current.value as any);

    const description = computed(() =>
    {
        return truncate(char.value.description, { length: 160 });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onChange() : void
    {
        if(!props.readonly)
        {
            emit('save');
        }
    }

    function openEditModal() : void
    {
        bioModal.value.show(char.value);
    }

    function onEditSave(bio : { name : string, description : string }) : void
    {
        char.value.name = bio.name;
        char.value.description = bio.description;

        emit('save');
    }

    // export default defineComponent({
    //     name: 'WfrpBioCard',
    //     components: {
    //         EditBioModal,
    //         MarkdownBlock,
    //         RpgkCard
    //     },
    //     props: {
    //         readonly: {
    //             type: Boolean,
    //             default: false
    //         }
    //     },
    //     data()
    //     {
    //         return {
    //             showEdit: false
    //         };
    //     },
    //     subscriptions()
    //     {
    //         return {
    //             character: charMan.selected$
    //         };
    //     },
    //     computed: {
    //         description()
    //         {
    //             return _.truncate(this.character.description, { length: 160 });
    //         }
    //     },
    //     methods: {
    //         onChange()
    //         {
    //             if(!this.readonly)
    //             {
    //                 // Save the character
    //                 return charMan.save(charMan.selected);
    //             }
    //         },
    //         openEditModal()
    //         {
    //             this.showEdit = true;
    //         }
    //     }
    // });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
