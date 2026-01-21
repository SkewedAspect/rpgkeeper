<!----------------------------------------------------------------------------------------------------------------------
  -- armorCard.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <RpgkCard id="eote-armor-block" :class="{ readonly: readonly }" fill no-body>
        <!-- Header -->
        <template #header>
            <div class="d-flex">
                <h5 class="align-items-center d-flex text-nowrap m-0 me-2 flex-grow-0 flex-shrink-0 w-auto">
                    <Fa class="me-1" icon="helmet-battle" />
                    Armor
                    <span v-if="armor.name" class="ms-1"> - {{ armor.name }}</span>
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
        <BTableSimple
            v-if="armor.name"
            class="font-sm mb-0"
            small
        >
            <BThead>
                <BTr>
                    <BTh class="text-center">
                        Defense
                    </BTh>
                    <BTh class="text-center">
                        Soak
                    </BTh>
                    <BTh class="text-center">
                        Hardpoints
                    </BTh>
                    <BTh class="text-center">
                        Encumb.
                    </BTh>
                    <BTh class="text-center">
                        Rarity
                    </BTh>
                    <BTh>
                        Upgrades
                    </BTh>
                    <BTh>
                        Attachments
                    </BTh>
                </BTr>
            </BThead>
            <BTbody>
                <BTr>
                    <BTd class="text-center">
                        {{ armor.defense }}
                    </BTd>
                    <BTd class="text-center">
                        {{ armor.soak }}
                    </BTd>
                    <BTd class="text-center">
                        {{ armor.hardpoints }}
                    </BTd>
                    <BTd class="text-center">
                        {{ armor.encumbrance }}
                    </BTd>
                    <BTd class="text-center">
                        {{ armor.rarity }}
                    </BTd>
                    <BTd class="text-nowrap">
                        <QualityTag
                            v-for="quality in armor.qualities"
                            :id="quality.id"
                            :key="quality.id"
                            :ranks="quality.ranks"
                        />
                        <span v-if="armor.qualities.length === 0" class="text-muted">
                            None
                        </span>
                    </BTd>
                    <BTd class="text-nowrap">
                        <AttachmentTag
                            v-for="att in armor.attachments"
                            :id="att.id"
                            :key="att.id"
                            :activated-mods="att.activatedMods"
                        />
                        <span v-if="armor.attachments.length === 0" class="text-muted">
                            None
                        </span>
                    </BTd>
                </BTr>
            </BTbody>
        </BTableSimple>
        <h5 v-else class="mt-2 text-center">
            No armor
        </h5>

        <!-- Edit Modal -->
        <EditArmorModal ref="editArmorModal" @save="onEditSave" />
    </RpgkCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #eote-armor-block {
        .table tr td {
            vertical-align: middle !important;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';
    // import { useSystemStore } from '@client/lib/resource-access/stores/systems';

    // Models
    import type { EoteArmorRef, EoteCharacter } from '../../models.ts';

    // Components
    import RpgkCard from '@client/components/ui/rpgkCard.vue';
    import QualityTag from './sub/qualityTag.vue';
    import AttachmentTag from './sub/attachmentTag.vue';
    import EditArmorModal from './modals/editArmorModal.vue';

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
    // const systemStore = useSystemStore();

    const editArmorModal = ref<InstanceType<typeof EditArmorModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<EoteCharacter>(() => current.value as any);
    // const mode = computed(() => systemStore.current?.id ?? 'eote');
    const readonly = computed(() => props.readonly);

    const armor = computed(() => char.value.details.armor);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function openEditModal() : void
    {
        editArmorModal.value?.show(char.value);
    }

    function onEditSave(newArmor : EoteArmorRef) : void
    {
        char.value.details.armor = newArmor;

        emit('save');
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
