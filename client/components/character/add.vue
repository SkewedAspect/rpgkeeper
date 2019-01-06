<!--------------------------------------------------------------------------------------------------------------------->
<!-- add.vue                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <edit-modal :char="newChar" ref="addCharModal" :title="title" @save="onSave"></edit-modal>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    // Utils
    import utilities from '../../../server/utils/misc';

    // Managers
    import characterMan from '../../api/managers/character';

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
                Object.assign(this.newChar, {
                    name: '',
                    system: '',
                    color: utilities.colorize(utilities.shortID()),
                    description: '',
                    portrait: '',
                    thumbnail: '',
                    biography: '',
                });

                this.$refs.addCharModal.open();
            },
            async onSave()
            {
                const { initial, ...charDef } = this.newChar;
                const char = await characterMan.create(charDef);
                await characterMan.save(char);
                this.$emit('saved', char);
            }
        },
        data()
        {
            return {
                title: 'New Character',
                newChar: {
                    name: '',
                    system: '',
                    description: '',
                    portrait: '',
                    thumbnail: '',
                    color: '#aaaaaa',
                    biography: '',
                    get initial(){ return (this.name[0] || '?').toUpperCase(); }
                }
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
