<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-edit-modal">
        <BModal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xxl"
            :ok-disabled="/*v$.$errors.length > 0*/false"
            @ok="onSave"
            @hidden="onHidden"
        >
            <!-- Modal Header -->
            <template #header="{ cancel }">
                <h5 v-b-color-mode="'dark'" class="w-100 mb-0">
                    <span v-if="isNew">
                        <Fa icon="user-plus" />
                        Add
                    </span>
                    <span v-else>
                        <Fa icon="user-edit" />
                        Edit
                    </span>
                    Character
                    <CloseButton class="float-end" @click="cancel" />
                </h5>
            </template>

            <!-- Modal Body -->
            <div class="content">
                <BFormRow>
                    <BCol class="flex-grow-0 flex-shrink-0 w-auto">
                        <CharPortrait :src="char.portrait" :color="char.color" size="md" />
                        <div class="text-center">
                            <small class="text-muted">Portrait</small>
                        </div>
                        <div class="text-center mt-4">
                            <CharThumbnail :char="char" />
                            <div>
                                <small class="text-muted">Thumbnail</small>
                            </div>
                        </div>
                    </BCol>
                    <BCol>
                        <BFormRow>
                            <BCol>
                                <BFormGroup
                                    id="char-name-group"
                                    description="Your character's full name."
                                    label="Name"
                                    label-for="char-name"
                                >
                                    <BFormInput
                                        id="char-name"
                                        v-model="char.name"
                                        :state="validateState('name')"
                                        @input="v$.name.$touch()"
                                    />
                                </BFormGroup>
                            </BCol>
                            <BCol>
                                <BFormGroup
                                    id="char-sys-group"
                                    description="The rpg system this character is for."
                                    label="System"
                                    label-for="char-sys"
                                >
                                    <BFormSelect
                                        id="char-sys"
                                        v-model="char.system"
                                        :options="systems"
                                        text-field="name"
                                        value-field="id"
                                        :disabled="!isNew"
                                        :state="validateState('system')"
                                        @input="v$.system.$touch()"
                                    />
                                </BFormGroup>
                            </BCol>
                        </BFormRow>
                        <BFormRow>
                            <BCol class="flex-grow-0 flex-shrink-0 w-auto" style="min-width: 5rem;">
                                <BFormGroup
                                    id="char-color-group"
                                    label="Color"
                                    label-for="char-color"
                                >
                                    <ColorPicker v-model:color="char.color" variant="light" block />
                                </BFormGroup>
                            </BCol>
                            <BCol>
                                <BFormGroup
                                    id="char-portrait-group"
                                    label="Portrait"
                                    label-for="char-portrait"
                                >
                                    <BInputGroup>
                                        <BFormInput
                                            id="char-portrait"
                                            v-model="char.portrait"
                                            :state="validateState('portrait')"
                                            @input="v$.portrait.$touch()"
                                        />
                                        <template #append>
                                            <BButton
                                                title="Choose file from Dropbox"
                                                @click="pickImageDropBox('portrait')"
                                            >
                                                <Fa :icon="[ 'fab', 'dropbox' ]" />
                                            </BButton>
                                        </template>
                                    </BInputGroup>
                                    <template #description>
                                        Any urls are accepted. <br>
                                        Recommend dimensions are <code>600x900px</code>.
                                    </template>
                                </BFormGroup>
                            </BCol>
                            <BCol>
                                <BFormGroup
                                    id="char-thumbnail-group"
                                    label="Thumbnail"
                                    label-for="char-thumbnail"
                                >
                                    <BInputGroup>
                                        <BFormInput
                                            id="char-thumbnail"
                                            v-model="char.thumbnail"
                                            :state="validateState('thumbnail')"
                                            @input="v$.thumbnail.$touch()"
                                        />
                                        <template #append>
                                            <BButton
                                                title="Choose file from Dropbox"
                                                @click="pickImageDropBox('thumbnail')"
                                            >
                                                <Fa :icon="[ 'fab', 'dropbox' ]" />
                                            </BButton>
                                        </template>
                                    </BInputGroup>
                                    <template #description>
                                        Any urls are accepted. <br>
                                        Recommend dimensions are <code>200x200px</code>.
                                    </template>
                                </BFormGroup>
                            </BCol>
                        </BFormRow>
                        <BFormGroup
                            id="char-campaign-group"
                            description="A brief description of the campaign or RP this character is associated with."
                            label="Campaign"
                            label-for="char-campaign"
                        >
                            <BFormInput
                                id="char-campaign"
                                v-model="char.campaign"
                                :state="validateState('campaign')"
                                @input="v$.campaign.$touch()"
                            />
                        </BFormGroup>
                        <BFormGroup
                            id="char-desc-group"
                            description="A brief description of your character. Could be physical or personality."
                            label="Description"
                            label-for="char-desc"
                        >
                            <BFormInput
                                id="char-desc"
                                v-model="char.description"
                                :state="validateState('description')"
                                @input="v$.description.$touch()"
                            />
                        </BFormGroup>
                    </BCol>
                </BFormRow>
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
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { get } from 'lodash';
    import { computed, ref } from 'vue';
    import { useVuelidate } from '@vuelidate/core';
    import { maxLength, minLength, required } from '@vuelidate/validators';

    // Interfaces
    import type { Character } from '@rpgk/core';

    // Managers
    import systemsMan from '../../lib/managers/systems';

    // Stores
    import { useSystemStore } from '../../lib/resource-access/stores/systems';

    // Utils
    import dropboxUtil from '../../lib/utils/dropbox';

    // Components
    import ColorPicker from '../ui/colorPicker.vue';
    import CharThumbnail from './charThumbnail.vue';
    import CharPortrait from './charPortrait.vue';
    import { BModal } from 'bootstrap-vue-next';
    import CloseButton from '../ui/closeButton.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Types
    //------------------------------------------------------------------------------------------------------------------

    type NewChar = Omit<Character<any>, 'details' | 'accountID' | 'noteID' | 'created' | 'updated'>;

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Events
    {
        (e : 'hidden') : void;
        (e : 'save', char : NewChar) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const char = ref<NewChar>({
        id: undefined,
        name: '',
        portrait: '',
        thumbnail: '',
        color: '',
        campaign: '',
        description: '',
        system: '',
    });

    const sysStore = useSystemStore();

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isNew = computed(() => !char.value.id);

    const systems = computed(() =>
    {
        return sysStore.filteredSystems
            .map((sys) =>
            {
                return {
                    ...sys,
                    name: sys.status !== 'stable'
                        ? `${ sys.name } (${ systemsMan.getStatusDisplay(sys.status) })` : sys.name,
                };
            });
    });

    //------------------------------------------------------------------------------------------------------------------
    // Validation
    //------------------------------------------------------------------------------------------------------------------

    const rules = {
        name: {
            required,
            minLength: minLength(1),
            maxLength: maxLength(255),
        },
        portrait: {
            minLength: minLength(1),
            maxLength: maxLength(255),
        },
        thumbnail: {
            minLength: minLength(1),
            maxLength: maxLength(255),
        },
        campaign: {
            minLength: minLength(1),
            maxLength: maxLength(255),
        },
        description: {
            minLength: minLength(1),
            maxLength: maxLength(255),
        },
        system: {
            required,
        },
    };

    // TODO: Cast it to an any so we don't get spurious errors, but this is pretty bad...
    // @see: https://github.com/vuelidate/vuelidate/issues/925
    const v$ : any = useVuelidate(rules, char as any);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(selectedChar : Character) : void
    {
        v$.value.$reset();

        // Destructure just the properties we want
        const { id, name, portrait, thumbnail, color, campaign, description, system } = selectedChar;

        // Populate our char variable
        char.value = {
            id,
            name,
            portrait,
            thumbnail,
            color: color || '#999',
            campaign,
            description,
            system,
        };

        // Now show the modal
        innerModal.value?.show();
    }

    function hide() : void
    {
        innerModal.value?.hide();
    }

    function onHidden() : void
    {
        emit('hidden');
    }

    function onSave(bvModalEvent : { preventDefault : () => void }) : void
    {
        v$.value.$touch();

        if(v$.value.$errors.length === 0)
        {
            emit('save', char.value);
        }
        else
        {
            bvModalEvent.preventDefault();
        }
    }

    function validateState(name : string) : boolean | null
    {
        const { $dirty, $error } = get(v$.value, name);
        return $dirty ? !$error : null;
    }

    async function pickImageDropBox(prop : 'portrait' | 'thumbnail') : Promise<void>
    {
        char.value[prop] = await dropboxUtil.chooseDropboxImage();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
