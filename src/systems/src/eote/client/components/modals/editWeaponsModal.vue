<!----------------------------------------------------------------------------------------------------------------------
  -- EditWeaponsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-weapons-modal">
        <BModal
            id="weapModal"
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            body-class="position-static"
            size="xl"
            @ok="onSave"
            @cancel="onCancel"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <span v-if="isAdd">
                        <Fa icon="plus" />
                        Add
                    </span>
                    <span v-else>
                        <Fa icon="file-edit" />
                        Edit
                    </span>
                    Weapons
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Content -->
            <div :class="`${ mode }-system`">
                <BFormRow>
                    <BFormGroup
                        class="flex-fill pe-1 w-50"
                        label="Name"
                        label-class="fw-bold"
                        label-for="name-input"
                    >
                        <VueBootstrapAutocomplete
                            id="name-input"
                            v-model="editWeapon.name"
                            :data="availableWeapons"
                            :serializer="(w : EoteWeapon) => w.name"
                            :max-matches="1000"
                            placeholder="Search or enter name..."
                            show-on-focus
                            @hit="onWeaponTemplateHit"
                        >
                            <template #append>
                                <BButton
                                    variant="secondary"
                                    title="Browse weapons..."
                                    @click="openBrowseModal"
                                >
                                    <Fa icon="search" />
                                    Browse Weapons
                                </BButton>
                            </template>
                        </VueBootstrapAutocomplete>
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1 w-25"
                        label="Skill"
                        label-class="fw-bold"
                        label-for="skill-input"
                    >
                        <BFormSelect
                            id="skill-input"
                            v-model="editWeapon.skill"
                            :options="skillNames"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 w-25"
                        label="Range"
                        label-class="fw-bold"
                        label-for="range-input"
                    >
                        <BFormSelect
                            id="range-input"
                            v-model="editWeapon.range"
                            :options="rangeOptions"
                        />
                    </BFormGroup>
                </BFormRow>

                <BFormRow class="mt-2">
                    <BFormGroup
                        class="flex-fill pe-1"
                        style="width: 20%"
                        label="Damage"
                        label-class="fw-bold"
                        label-for="skill-damage"
                    >
                        <BFormInput
                            id="skill-damage"
                            v-model.number="editWeapon.damage"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1"
                        style="width: 20%"
                        label="Critical"
                        label-class="fw-bold"
                        label-for="skill-critical"
                    >
                        <BFormInput
                            id="skill-critical"
                            v-model.number="editWeapon.criticalRating"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1"
                        style="width: 20%"
                        label="Encumb."
                        label-class="fw-bold"
                        label-for="skill-encumbrance"
                    >
                        <BFormInput
                            id="skill-encumbrance"
                            v-model.number="editWeapon.encumbrance"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1 pe-1"
                        style="width: 20%"
                        label="Hardpoints"
                        label-class="fw-bold"
                        label-for="skill-hardpoints"
                    >
                        <BFormInput
                            id="skill-hardpoints"
                            v-model.number="editWeapon.hardpoints"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                    <BFormGroup
                        class="flex-fill ps-1"
                        style="width: 20%"
                        label="Rarity"
                        label-class="fw-bold"
                        label-for="skill-rarity"
                    >
                        <BFormInput
                            id="skill-rarity"
                            v-model.number="editWeapon.rarity"
                            type="number"
                            min="0"
                            step="0"
                        />
                    </BFormGroup>
                </BFormRow>

                <BTabs class="mt-3" content-class="mt-2">
                    <BTab title="Qualities" active>
                        <QualityEdit
                            v-model:qualities="editWeapon.qualities"
                            :attachment-refs="editWeapon.attachments"
                        />
                    </BTab>
                    <BTab>
                        <template #title>
                            Attachments
                            <BBadge :variant="attachmentHpVariant" class="ms-1">
                                {{ attachmentHpUsed }} / {{ editWeapon.hardpoints }} HP
                            </BBadge>
                        </template>
                        <AttachmentEdit
                            v-model:attachments="editWeapon.attachments"
                            :total-hardpoints="editWeapon.hardpoints"
                            use-with="weapon"
                            :show-hardpoints-summary="false"
                        />
                    </BTab>
                </BTabs>
            </div>

            <!-- Modal Buttons -->
            <template #ok="{ ok }">
                <BButton variant="primary" @click="ok">
                    <Fa icon="save" />
                    Save
                </BButton>
            </template>
            <template #cancel="{ cancel }">
                <BButton variant="secondary" @click="cancel">
                    <Fa icon="times" />
                    Cancel
                </BButton>
            </template>
        </BModal>

        <!-- Browse Weapons Modal -->
        <SupplementBrowserModal
            ref="browseModal"
            title="Browse Weapons"
            :supplements="availableWeapons"
            @select="onBrowseSelect"
            @add-new="onAddNewWeapon"
            @edit="onEditWeaponSupplement"
        >
            <template #preview="{ supplement }">
                <div class="weapon-stats d-flex flex-wrap mb-2">
                    <span class="me-4"><strong>Skill:</strong> {{ supplement.skill }}</span>
                    <span class="me-4"><strong>Range:</strong> {{ rangeEnum[supplement.range] }}</span>
                    <span class="me-4"><strong>Damage:</strong> {{ supplement.damage }}</span>
                    <span><strong>Critical:</strong> {{ supplement.criticalRating }}</span>
                </div>
                <div class="weapon-stats d-flex flex-wrap mb-2">
                    <span class="me-4"><strong>Encumbrance:</strong> {{ supplement.encumbrance }}</span>
                    <span><strong>Rarity:</strong> {{ supplement.rarity }}</span>
                </div>
                <hr class="my-2">
                <div class="weapon-description flex-grow-1 overflow-auto">
                    <MarkdownBlock :text="supplement.description ?? 'No description.'" inline />
                </div>
                <div class="text-end mt-auto pt-2">
                    <h5 class="mb-1">
                        <ScopeBadge :supplement="supplement" />
                    </h5>
                    <ReferenceBlock :reference="supplement.reference ?? ''" />
                </div>
            </template>
        </SupplementBrowserModal>

        <!-- Add/Edit Weapon Supplement Modal -->
        <AddEditWeaponModal
            ref="addEditWeaponModal"
            @add="onWeaponSupplementAdded"
            @edit="onWeaponSupplementEdited"
        />

        <!-- Confirm Overwrite Modal -->
        <ConfirmOverwriteModal
            ref="confirmOverwriteModal"
            title="Overwrite Weapon"
            message="Overwrite current weapon values?"
            description="This will replace all fields with the selected template values. Any changes you've made will be lost."
            @confirm="onConfirmOverwrite"
        />
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #weapModal {
        .modal-content {
            overflow: initial !important;
        }
    }

    .edit-weapons-modal {
        .weapon-description {
            max-height: 250px;
            overflow-y: auto;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, useTemplateRef } from 'vue';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useCharacterStore } from '@client/lib/resource-access/stores/characters';
    import { useSystemStore } from '@client/lib/resource-access/stores/systems';
    import { useSupplementStore } from '@client/lib/resource-access/stores/supplements';

    // Models
    import type {
        EncounterRange,
        EoteAttachment,
        EoteAttachmentRef,
        EoteCharacter,
        EoteQualityRef,
        EoteWeapon,
        EoteWeaponRef,
    } from '../../../models.ts';

    // Constants
    import { rangeEnum } from '../../constants';

    // Components
    import QualityEdit from '../sub/qualityEdit.vue';
    import AttachmentEdit from '../sub/attachmentEdit.vue';
    import { BModal } from 'bootstrap-vue-next';
    import { VueBootstrapAutocomplete } from '@morgul/vue-bootstrap-autocomplete';
    import CloseButton from '@client/components/ui/closeButton.vue';
    import SupplementBrowserModal from '@client/components/character/supplementBrowserModal.vue';
    import ConfirmOverwriteModal from '@client/components/ui/confirmOverwriteModal.vue';
    import AddEditWeaponModal from './addEditWeaponModal.vue';
    import MarkdownBlock from '@client/components/ui/markdownBlock.vue';
    import ScopeBadge from '@client/components/character/scopeBadge.vue';
    import ReferenceBlock from '@client/components/character/referenceBlock.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface SimpleWeapon
    {
        weaponID ?: number;
        name ?: string;
        skill ?: string;
        damage : number;
        addSkill : boolean;
        criticalRating : number;
        range : EncounterRange;
        encumbrance : number;
        hardpoints : number;
        rarity : number;
        restricted : boolean;
        qualities : EoteQualityRef[];
        attachments : EoteAttachmentRef[];
    }

    interface Events
    {
        (e : 'add', weapon : EoteWeaponRef) : void;
        (e : 'edit', weapon : EoteWeaponRef, index : number) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const { current } = storeToRefs(useCharacterStore());
    const systemStore = useSystemStore();
    const supplementStore = useSupplementStore();

    const weapIndex = ref(-1);
    const weapon = ref<EoteWeaponRef | undefined>(undefined);
    const editWeapon = ref<SimpleWeapon>({
        weaponID: undefined,
        name: undefined,
        skill: undefined,
        damage: 0,
        addSkill: false,
        criticalRating: 0,
        range: 'm',
        encumbrance: 0,
        hardpoints: 0,
        rarity: 0,
        restricted: false,
        qualities: [],
        attachments: [],
    });

    const pendingTemplate = ref<EoteWeapon | null>(null);

    const innerModal = useTemplateRef('innerModal');
    const browseModal = useTemplateRef<{ show : () => void; hide : () => void }>('browseModal');
    const addEditWeaponModal = useTemplateRef<InstanceType<typeof AddEditWeaponModal>>('addEditWeaponModal');
    const confirmOverwriteModal = useTemplateRef<InstanceType<typeof ConfirmOverwriteModal>>('confirmOverwriteModal');

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const char = computed<EoteCharacter>(() => current.value as any);
    const mode = computed(() => systemStore.current?.id ?? 'eote');

    const isAdd = computed(() => !weapon.value);
    const skillNames = computed(() => char.value.details.skills.map((skill) => skill.name).sort());
    const rangeOptions = computed(() =>
    {
        return Object.keys(rangeEnum).map((rng) =>
        {
            return {
                text: rangeEnum[rng],
                value: rng,
            };
        });
    });

    const availableWeapons = computed(() => supplementStore.get<EoteWeapon>(mode.value, 'weapon'));

    const attachmentHpUsed = computed(() =>
    {
        const attachments = supplementStore.get<EoteAttachment>(mode.value, 'attachment');
        return editWeapon.value.attachments.reduce((total, attRef) =>
        {
            const att = attachments.find((item) => item.id === attRef.id);
            return total + (att?.hpRequired ?? 0);
        }, 0);
    });

    const attachmentHpVariant = computed(() =>
    {
        if(attachmentHpUsed.value > editWeapon.value.hardpoints)
        {
            return 'danger';
        }
        else if(attachmentHpUsed.value === editWeapon.value.hardpoints && editWeapon.value.hardpoints > 0)
        {
            return 'warning';
        }

        return 'secondary';
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function formHasValues() : boolean
    {
        // Don't check name since that's what the user types to search
        return !!(
            editWeapon.value.skill
            || editWeapon.value.damage > 0
            || editWeapon.value.criticalRating > 0
            || editWeapon.value.encumbrance > 0
            || editWeapon.value.rarity > 0
            || editWeapon.value.qualities.length > 0
        );
    }

    function applyTemplate(template : EoteWeapon) : void
    {
        editWeapon.value = {
            weaponID: undefined,
            name: template.name,
            skill: template.skill,
            damage: template.damage,
            addSkill: template.addSkill ?? false,
            criticalRating: template.criticalRating,
            range: template.range,
            encumbrance: template.encumbrance,
            hardpoints: template.hardpoints ?? 0,
            rarity: template.rarity,
            restricted: template.restricted ?? false,
            qualities: [ ...(template.qualities ?? []) ],
            attachments: [],
        };
    }

    function onWeaponTemplateHit(template : EoteWeapon) : void
    {
        if(formHasValues())
        {
            pendingTemplate.value = template;
            confirmOverwriteModal.value?.show();
        }
        else
        {
            applyTemplate(template);
        }
    }

    function openBrowseModal() : void
    {
        browseModal.value?.show();
    }

    function onBrowseSelect(template : EoteWeapon) : void
    {
        if(formHasValues())
        {
            pendingTemplate.value = template;
            confirmOverwriteModal.value?.show();
        }
        else
        {
            applyTemplate(template);
        }
    }

    function onConfirmOverwrite() : void
    {
        if(pendingTemplate.value)
        {
            applyTemplate(pendingTemplate.value);
            pendingTemplate.value = null;
        }
    }

    function onAddNewWeapon() : void
    {
        browseModal.value?.hide();
        addEditWeaponModal.value?.show();
    }

    function onWeaponSupplementAdded(newWeapon : EoteWeapon) : void
    {
        // Optionally auto-apply the new weapon to the form
        applyTemplate(newWeapon);
    }

    function onEditWeaponSupplement(weaponSupp : EoteWeapon) : void
    {
        addEditWeaponModal.value?.show(weaponSupp);
    }

    function onWeaponSupplementEdited(updatedWeapon : EoteWeapon) : void
    {
        // Optionally auto-apply the updated weapon to the form
        applyTemplate(updatedWeapon);
    }

    function show(newWeapon ?: EoteWeaponRef, index ?: number) : void
    {
        index = index ?? -1;

        if(newWeapon)
        {
            weapIndex.value = index;
            weapon.value = newWeapon;

            editWeapon.value = {
                weaponID: undefined,
                name: newWeapon.name,
                skill: newWeapon.skill,
                damage: newWeapon.damage,
                addSkill: newWeapon.addSkill ?? false,
                criticalRating: newWeapon.criticalRating,
                range: newWeapon.range,
                encumbrance: newWeapon.encumbrance,
                hardpoints: newWeapon.hardpoints ?? 0,
                rarity: newWeapon.rarity,
                restricted: newWeapon.restricted ?? false,
                qualities: newWeapon.qualities,
                attachments: [ ...(newWeapon.attachments ?? []) ],
            };
        }
        else
        {
            weapIndex.value = -1;
            weapon.value = undefined;
            editWeapon.value = {
                weaponID: undefined,
                name: undefined,
                skill: undefined,
                damage: 0,
                addSkill: false,
                criticalRating: 0,
                range: 'm',
                encumbrance: 0,
                hardpoints: 0,
                rarity: 0,
                restricted: false,
                qualities: [],
                attachments: [],
            };
        }

        innerModal.value?.show();
    }

    function hide() : void
    {
        weapIndex.value = -1;
        weapon.value = undefined;
        editWeapon.value = {
            weaponID: undefined,
            name: undefined,
            skill: undefined,
            damage: 0,
            addSkill: false,
            criticalRating: 0,
            range: 'm',
            encumbrance: 0,
            hardpoints: 0,
            rarity: 0,
            restricted: false,
            qualities: [],
            attachments: [],
        };

        innerModal.value?.hide();
    }

    async function onSave() : Promise<void>
    {
        if(isAdd.value)
        {
            const newWeap : EoteWeaponRef = {
                name: editWeapon.value.name ?? '',
                skill: editWeapon.value.skill ?? '',
                damage: editWeapon.value.damage,
                addSkill: editWeapon.value.addSkill,
                criticalRating: editWeapon.value.criticalRating,
                range: editWeapon.value.range,
                encumbrance: editWeapon.value.encumbrance,
                hardpoints: editWeapon.value.hardpoints,
                rarity: editWeapon.value.rarity,
                restricted: editWeapon.value.restricted,
                attachments: editWeapon.value.attachments,
                qualities: editWeapon.value.qualities,
            };

            emit('add', newWeap);
        }
        else if(weapon.value)
        {
            const newWeapon : EoteWeaponRef = {
                ...weapon.value,
                name: editWeapon.value.name ?? weapon.value.name,
                skill: editWeapon.value.skill ?? weapon.value.skill,
                damage: editWeapon.value.damage,
                addSkill: editWeapon.value.addSkill,
                criticalRating: editWeapon.value.criticalRating,
                range: editWeapon.value.range,
                encumbrance: editWeapon.value.encumbrance,
                hardpoints: editWeapon.value.hardpoints,
                rarity: editWeapon.value.rarity,
                restricted: editWeapon.value.restricted,
                attachments: editWeapon.value.attachments,
                qualities: editWeapon.value.qualities,
            };

            emit('edit', newWeapon, weapIndex.value);
        }
    }

    function onCancel() : void
    {
        weapIndex.value = -1;
        weapon.value = undefined;
        pendingTemplate.value = null;
        editWeapon.value = {
            weaponID: undefined,
            name: undefined,
            skill: undefined,
            damage: 0,
            addSkill: false,
            criticalRating: 0,
            range: 'm',
            encumbrance: 0,
            hardpoints: 0,
            rarity: 0,
            restricted: false,
            qualities: [],
            attachments: [],
        };
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
