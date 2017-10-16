<!--------------------------------------------------------------------------------------------------------------------->
<!-- add.vue                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <edit-modal :char="newChar" ref="addCharModal" :title="title" @save="onSave"></edit-modal>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Utils
    import utilities from '../../../../server/utilities';

    // Managers
    import characterMan from '../../../api/managers/character';

    // Components
    import EditModal from './edit.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'AddCharacterModal',
        components: {
            EditModal
        },
        methods: {
            open()
            {
                _.assign(this.newChar, {
                    name: undefined,
                    system: '',
                    color: utilities.colorize(utilities.shortID()),
                    description: undefined,
                    portrait: undefined,
                    thumbnail: undefined,
                    biography: undefined
                });

                this.$refs.addCharModal.open();
            },
            onSave()
            {
                characterMan.save(this.newChar)
                    .then((char) => this.$emit('saved', char));
            }
        },
        data()
        {
            return {
                title: 'New Character',
                newChar: {
                    name: undefined,
                    system: '',
                    description: '',
                    portrait: '',
                    thumbnail: '',
                    color: '#aaaaaa',
                    biography: '',
                    get initial(){ return (_.get(this.name, '0', '?')).toUpperCase(); }
                }
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->