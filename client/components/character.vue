<!--------------------------------------------------------------------------------------------------------------------->
<!-- System Character boilerplate                                                                                    -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="system-character">
        <md-tabs class="md-transparent" md-right>
            <md-tab md-label="Sheet">
                <slot>
                    <pre>{{ JSON.stringify(character, null, 2) }}</pre>
                </slot>
            </md-tab>
            <md-tab md-label="Notes">
                <notes :notes="character.notes" :save="character.$save"></notes>
            </md-tab>
        </md-tabs>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #system-character {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import NotesComponent from './notes/notes.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        components: {
            notes: NotesComponent
        },
        props: {
            character: {
                type: Object,
                required: true
            }
        },
        watch: {
            character: {
                handler: function(){ this.character.$save(); },
                deep: true
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->