<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="add-edit-modal">
        <b-modal
            ref="innerModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xxl"
            :ok-disabled="v$.$errors.length > 0"
            @ok="onSave"
            @hidden="onHidden"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <span v-if="isNew">
                    <fa icon="user-plus"></fa>
                    Add
                </span>
                <span v-else>
                    <fa icon="user-edit"></fa>
                    Edit
                </span>
                Character
            </template>

            <!-- Modal Body -->
            <div class="content">
                <b-form-row>
                    <b-col class="flex-grow-0 flex-shrink-0 w-auto">
                        <CharPortrait :src="char.portrait" :color="char.color" size="md"></CharPortrait>
                        <div class="text-center">
                            <small class="text-muted">Portrait</small>
                        </div>
                        <div class="text-center mt-4">
                            <CharThumbnail :char="char"></CharThumbnail>
                            <div>
                                <small class="text-muted">Thumbnail</small>
                            </div>
                        </div>
                    </b-col>
                    <b-col>
                        <b-form-row>
                            <b-col>
                                <b-form-group
                                    id="char-name-group"
                                    description="Your character's full name."
                                    label="Name"
                                    label-for="char-name"
                                >
                                    <b-form-input
                                        id="char-name"
                                        v-model="char.name"
                                        :state="validateState('name')"
                                        @input="v$.name.$touch()"
                                    ></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group
                                    id="char-sys-group"
                                    description="The rpg system this character is for."
                                    label="System"
                                    label-for="char-sys"
                                >
                                    <b-form-select
                                        id="char-sys"
                                        v-model="char.system"
                                        :options="systems"
                                        text-field="name"
                                        value-field="id"
                                        :disabled="!isNew"
                                        :state="validateState('system')"
                                        @input="v$.system.$touch()"
                                    ></b-form-select>
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col class="flex-grow-0 flex-shrink-0 w-auto" style="min-width: 5rem;">
                                <b-form-group
                                    id="char-color-group"
                                    label="Color"
                                    label-for="char-color"
                                >
                                    <ColorPicker v-model:color="char.color" variant="light" block></ColorPicker>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group
                                    id="char-portrait-group"
                                    label="Portrait"
                                    label-for="char-portrait"
                                >
                                    <b-input-group>
                                        <b-form-input
                                            id="char-portrait"
                                            v-model="char.portrait"
                                            :state="validateState('portrait')"
                                            @input="v$.portrait.$touch()"
                                        ></b-form-input>
                                        <b-input-group-append>
                                            <b-btn title="Choose file from Dropbox" @click="pickImageDropBox('portrait')">
                                                <fa :icon="[ 'fab', 'dropbox' ]"></fa>
                                            </b-btn>
                                        </b-input-group-append>
                                    </b-input-group>
                                    <template #description>
                                        Any urls are accepted. <br />
                                        Recommend dimensions are <code>600x900px</code>.
                                    </template>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group
                                    id="char-thumbnail-group"
                                    label="Thumbnail"
                                    label-for="char-thumbnail"
                                >
                                    <b-input-group>
                                        <b-form-input
                                            id="char-thumbnail"
                                            v-model="char.thumbnail"
                                            :state="validateState('thumbnail')"
                                            @input="v$.thumbnail.$touch()"
                                        ></b-form-input>
                                        <b-input-group-append>
                                            <b-btn title="Choose file from Dropbox" @click="pickImageDropBox('thumbnail')">
                                                <fa :icon="[ 'fab', 'dropbox' ]"></fa>
                                            </b-btn>
                                        </b-input-group-append>
                                    </b-input-group>
                                    <template #description>
                                        Any urls are accepted. <br />
                                        Recommend dimensions are <code>200x200px</code>.
                                    </template>
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-group
                            id="char-campaign-group"
                            description="A brief description of the campaign or RP this character is associated with."
                            label="Campaign"
                            label-for="char-campaign"
                        >
                            <b-form-input
                                id="char-campaign"
                                v-model="char.campaign"
                                :state="validateState('campaign')"
                                @input="v$.campaign.$touch()"
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group
                            id="char-desc-group"
                            description="A brief description of your character. Could be physical or personality."
                            label="Description"
                            label-for="char-desc"
                        >
                            <b-form-input
                                id="char-desc"
                                v-model="char.description"
                                :state="validateState('description')"
                                @input="v$.description.$touch()"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </div>

            <!-- Modal Buttons -->
            <template #modal-ok>
                <fa icon="save"></fa>
                Save
            </template>
            <template #modal-cancel>
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { get } from 'lodash';
    import { ref, computed } from 'vue';
    import { useVuelidate } from '@vuelidate/core';
    import { required, minLength, maxLength } from '@vuelidate/validators';

    // Interfaces
    import { Character } from '../../../common/interfaces/common';

    // Managers
    import systemsMan from '../../lib/managers/systems';

    // Stores
    import { useSystemsStore } from '../../lib/stores/systems';

    // Utils
    import dropboxUtil from '../../lib/utils/dropbox';

    // Components
    import ColorPicker from '../ui/colorPicker.vue';
    import CharThumbnail from './charThumbnail.vue';
    import CharPortrait from './charPortrait.vue';
    import { BModal } from 'bootstrap-vue';

    //------------------------------------------------------------------------------------------------------------------
    // Types
    //------------------------------------------------------------------------------------------------------------------

    type NewChar = Omit<Character<any>, 'details' | 'accountID' | 'noteID'>;

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
        id: null,
        name: '',
        portrait: '',
        thumbnail: '',
        color: '',
        campaign: '',
        description: '',
        system: null
    });

    const sysStore = useSystemsStore();

    const innerModal = ref<InstanceType<typeof BModal> | null>(null);

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const isNew = computed(() => !char.value.id);

    const systems = computed(() =>
    {
        return sysStore.systems
            .map((sys) =>
            {
                return {
                    ...sys,
                    name: sys.status ? `${ sys.name } (${ systemsMan.getStatusDisplay(sys.status) })` : sys.name
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
            maxLength: maxLength(255)
        },
        portrait: {
            minLength: minLength(1),
            maxLength: maxLength(255)
        },
        thumbnail: {
            minLength: minLength(1),
            maxLength: maxLength(255)
        },
        campaign: {
            minLength: minLength(1),
            maxLength: maxLength(255)
        },
        description: {
            minLength: minLength(1),
            maxLength: maxLength(255)
        },
        system: {
            required
        }
    };

    // TODO: Cast it to an any so we don't get spurious errors, but this is pretty bad...
    // @see: https://github.com/vuelidate/vuelidate/issues/925
    const v$ : any = useVuelidate<typeof rules>(rules, char);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function show(selectedChar : Character) : void
    {
        v$.value.$reset();

        // Destructure just the properties we want
        const { id, name, portrait, thumbnail, color, campaign, description, system } = selectedChar;

        // Populate our char variable
        char.value = { id: id ?? null, name, portrait, thumbnail, color: color || '#999', campaign, description, system };

        // Now show the modal
        innerModal.value.show();
    }

    function hide() : void
    {
        innerModal.value.hide();
    }

    function onHidden() : void
    {
        emit('hidden');
    }

    function onSave(bvModalEvent) : void
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

    function getRandomColor()
    {
        return '#90f';
    }

    function validateState(name : string) : boolean
    {
        const { $dirty, $error } = get(v$.value, name);
        return $dirty ? !$error : null;
    }

    async function pickImageDropBox(prop)
    {
        this[prop] = await dropboxUtil.chooseDropboxImage();
    }

    //------------------------------------------------------------------------------------------------------------------

    defineExpose({ show, hide });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
