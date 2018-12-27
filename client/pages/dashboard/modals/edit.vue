<!--------------------------------------------------------------------------------------------------------------------->
<!-- edit.vue                                                                                                        -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-dialog class="char-edit-modal" ref="addEditModal">
        <md-dialog-title>{{ title }}</md-dialog-title>

        <md-dialog-content>
            <md-layout v-flex="'grow'" md-gutter="16">
                <md-layout md-flex-xsmall="100" md-flex-medium="50">
                    <md-input-container :class="{ 'md-input-invalid': !char.name }">
                        <md-icon>web</md-icon>
                        <label>Name</label>
                        <md-input v-model="char.name" required></md-input>
                        <span class="md-error">Name is required</span>
                    </md-input-container>
                    <md-input-container  :class="{ 'md-input-invalid': !char.system }">
                        <label>System</label>
                        <md-select name="system" id="system" v-model="char.system" required>
                            <md-option :value="system.id" v-for="system in systems">{{ system.name }}</md-option>
                        </md-select>
                        <span class="md-error">System is required</span>
                    </md-input-container>
                </md-layout>
                <md-layout md-flex-xsmall="100" md-flex-medium="50">
                    <md-layout md-gutter="16">
                        <md-layout v-flex="'grow'" md-column>
                            <md-layout v-flex="'grow'">

                            </md-layout>
                            <md-layout v-flex="'shrink'">
                                <md-input-container>
                                    <md-icon>photo</md-icon>
                                    <label>Portrait</label>
                                    <md-input v-model="char.portrait"></md-input>
                                </md-input-container>
                            </md-layout>
                        </md-layout>
                        <md-layout v-flex="'shrink'">
                            <portrait class="small" :src="char.portrait"></portrait>
                        </md-layout>
                    </md-layout>
                </md-layout>
            </md-layout>
            <md-layout md-gutter="16">
                <md-layout v-flex="'grow'" md-gutter="16">
                    <md-layout md-flex-xsmall="100" md-flex="50">
                        <md-input-container>
                            <md-icon>palette</md-icon>
                            <label>Color</label>
                            <md-input type="color" v-model="char.color"></md-input>
                        </md-input-container>
                    </md-layout>
                    <md-layout md-flex-xsmall="100" md-flex="50">
                        <md-input-container>
                            <md-icon>photo</md-icon>
                            <label>Thumbnail</label>
                            <md-input v-model="char.thumbnail"></md-input>
                        </md-input-container>
                    </md-layout>
                </md-layout>
                <md-layout id="thumbnail" v-flex="'shrink'">
                    <md-avatar class="md-avatar-icon md-large" :style="{ 'background-color': char.color }">
                        <img :src="char.thumbnail" alt="">
                        <div class="md-avatar-text">{{ char.initial }}</div>
                    </md-avatar>
                </md-layout>
            </md-layout>
            <md-input-container>
                <md-icon>description</md-icon>
                <label>Description</label>
                <md-input v-model="char.description"></md-input>
            </md-input-container>
            <md-input-container>
                <md-icon>subject</md-icon>
                <label>Biography</label>
                <md-textarea v-model="char.biography"></md-textarea>
            </md-input-container>
        </md-dialog-content>

        <md-dialog-actions>
            <md-button class="md-primary" @click="close()">Cancel</md-button>
            <md-button class="md-primary"
                       :class="{ 'md-raised md-accent': charValid }"
                       @click="close(true)"
                       :disabled="!charValid">
                Save
            </md-button>
        </md-dialog-actions>
    </md-dialog>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .char-edit-modal {
        .md-dialog {
            min-width: 80%;
        }

        #thumbnail,
        #portrait {
            @media(max-width: 600px)
            {
                display: none;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Managers
    import systemsMan from '../../../api/managers/systems';

    // Components
    import Portrait from '../../../components/portrait.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EditCharacterModal',
        props: {
            char: {
                type: Object,
                required: true
            },
            title: {
                type: String,
                default: 'Edit Character'
            }
        },
        components: {
            Portrait
        },
        subscriptions: {
            allSystems: systemsMan.systems$
        },
        computed: {
            systems(){ return _.filter(this.allSystems, (sys) => sys.disabled !== true); },
            charValid(){ return !!this.char.name && !!this.char.system; }
        },
        methods: {
            open()
            {
                this.$refs.addEditModal.open();
            },
            close(save)
            {
                if(save)
                {
                    this.$emit('save', this.char);
                }
                else
                {
                    this.$emit('cancel', this.char);
                } // end if

                this.$refs.addEditModal.close();
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
