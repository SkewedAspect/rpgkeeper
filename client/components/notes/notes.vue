<!--------------------------------------------------------------------------------------------------------------------->
<!-- notes.vue                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <md-card id="notes">
        <md-toolbar>
            <h2 class="md-title" v-flex="1">Notes</h2>
        </md-toolbar>
        <md-card-content style="display: flex">
            <md-list v-flex="'0 1 300px'" id="note-tabs">
                <md-list-item @click.native="loadPage(page)" v-for="page in notes">
                    {{ page.title }}
                    <md-button v-if="!disabled" class="md-icon-button md-list-action md-warn"
                               @click.native.prevent.stop="confirmDelete(page)">
                        <md-icon class="md-warn">delete</md-icon>
                    </md-button>
                </md-list-item>
            </md-list>
            <div v-flex="max" style="padding-left: 16px; padding-right: 16px">
                So, here's a few words.
            </div>
        </md-card-content>
    </md-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style rel="stylesheet/scss" lang="sass">
    #notes {
        #note-tabs {
            margin-left: -16px;
            margin-top: -16px;
            margin-bottom: -24px;
            box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);

            .md-list-action:first-child {
                margin: 0;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------
    
    import NotePage from './page.vue';
    
    //------------------------------------------------------------------------------------------------------------------

    export default {
        components: {
            notePage: NotePage
        },
        props: {
            notes: {
                type: Array,
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
            save: {
                type: Function,
                default: () => {}
            }
        },
        data()
        {
            return {
                // Data goes here
            };
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->