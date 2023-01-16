<!----------------------------------------------------------------------------------------------------------------------
  -- AddEditModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div v-if="char" class="add-edit-modal">
        <b-modal
            v-model="showModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="xxl"
            :ok-disabled="$v.$anyError"
            @ok="onSave"
            @show="onShow"
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
                        <portrait :src="portrait" :color="color" size="md"></portrait>
                        <div class="text-center">
                            <small class="text-muted">Portrait</small>
                        </div>
                        <div class="text-center mt-4">
                            <thumbnail :src="thumbnail" :color="color" :text="initials"></thumbnail>
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
                                        v-model="name"
                                        :state="validateState('name')"
                                        @input="$v.name.$touch()"
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
                                        v-model="currentSystem"
                                        :options="systems"
                                        text-field="name"
                                        value-field="id"
                                        :disabled="!isNew"
                                        :state="validateState('char.system')"
                                        @input="$v.char.system.$touch()"
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
                                    <color-picker v-model="color" variant="light" block></color-picker>
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
                                            v-model="portrait"
                                            :state="validateState('portrait')"
                                            @input="$v.portrait.$touch()"
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
                                            v-model="thumbnail"
                                            :state="validateState('thumbnail')"
                                            @input="$v.thumbnail.$touch()"
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
                                v-model="campaign"
                                :state="validateState('campaign')"
                                @input="$v.campaign.$touch()"
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
                                v-model="description"
                                :state="validateState('description')"
                                @input="$v.description.$touch()"
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

<style lang="scss" scoped>
    .add-edit-modal {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts">
    //------------------------------------------------------------------------------------------------------------------

    import { get } from 'lodash';
    import { defineComponent, PropType } from 'vue';
    // import { required, minLength, maxLength } from 'vuelidate/lib/validators';

    // Managers
    import charMan from '../../lib/managers/character';
    import systemsMan from '../../lib/managers/systems';

    // Utils
    import dropboxUtil from '../../lib/utils/dropbox';

    // Models
    import CharacterModel from '../../lib/models/character';

    // Components
    import ColorPicker from '../ui/colorPicker.vue';
    import Thumbnail from './thumbnail.vue';
    import Portrait from './portrait.vue';

    //------------------------------------------------------------------------------------------------------------------
    /* eslint vue/no-mutating-props: "off" */

    export default defineComponent({
        name: 'AddEditModal',
        components: {
            ColorPicker,
            Portrait,
            Thumbnail
        },
        model: {
            prop: 'char'
        },
        props: {
            char: {
                type: Object as PropType<CharacterModel>,
                default: undefined
            }
        },
        subscriptions()
        {
            return {
                allSystems: systemsMan.systems$
            };
        },
        emits: [ 'hidden' ],
        data()
        {
            return {
                name: undefined,
                color: undefined,
                portrait: undefined,
                thumbnail: undefined,
                campaign: undefined,
                description: undefined,
                saving: false
            };
        },
        computed: {
            isNew() { return !this.char || !this.char.id; },
            initials() : string
            {
                if(this.name)
                {
                    const nameParts = this.name.split(' ');
                    const initials = nameParts[0][0] + (nameParts[1]?.[0] ?? '');

                    return initials.toUpperCase();
                }
                else
                {
                    return '-';
                }
            },
            showModal: {
                get() { return !!this.char; },
                set() { /* We ignore setting */ }
            },
            currentSystem: {
                get() { return this.char.system; },
                set(val)
                {
                    if(this.char)
                    {
                        this.$set(this.char, 'system', val);
                        charMan.updateSysDefaults(this.char);
                    }
                }
            },
            systems()
            {
                return this.allSystems
                    .map((sys) =>
                    {
                        return {
                            ...sys,
                            name: sys.status ? `${ sys.name } (${ systemsMan.getStatusDisplay(sys.status) })` : sys.name
                        };
                    });
            }
        },
        methods: {
            onShow()
            {
                this.name = this.char.name;
                this.color = this.char.color;
                this.portrait = this.char.portrait;
                this.thumbnail = this.char.thumbnail;
                this.campaign = this.char.campaign;
                this.description = this.char.description;
            },
            onHidden()
            {
                // If we're not in the middle of a save, let's revert any changes.
                if(!this.saving)
                {
                    this.char.revert();
                }

                this.$v.$reset();
                this.$emit('hidden');
            },
            async onSave(bvModalEvent)
            {
                this.$v.$touch();

                if(!this.$v.$anyError)
                {
                    this.saving = true;

                    this.char.name = this.name;
                    this.char.color = this.color;
                    this.char.portrait = this.portrait;
                    this.char.thumbnail = this.thumbnail;
                    this.char.campaign = this.campaign;
                    this.char.description = this.description;

                    await charMan.save(this.char);

                    this.saving = false;
                }
                else
                {
                    bvModalEvent.preventDefault();
                }
            },
            async pickImageDropBox(prop)
            {
                this[prop] = await dropboxUtil.chooseDropboxImage();
            },
            validateState(name)
            {
                const { $dirty, $error } = get(this.$v, name);
                return $dirty ? !$error : null;
            }
        }
        // validations: {
        //     name: {
        //         required,
        //         minLength: minLength(1),
        //         maxLength: maxLength(255)
        //     },
        //     portrait: {
        //         minLength: minLength(1),
        //         maxLength: maxLength(255)
        //     },
        //     thumbnail: {
        //         minLength: minLength(1),
        //         maxLength: maxLength(255)
        //     },
        //     campaign: {
        //         minLength: minLength(1),
        //         maxLength: maxLength(255)
        //     },
        //     description: {
        //         minLength: minLength(1),
        //         maxLength: maxLength(255)
        //     },
        //     char: {
        //         system: {
        //             required
        //         }
        //     }
        // }
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
