<!----------------------------------------------------------------------------------------------------------------------
  -- editIdentityModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div v-if="character" class="edit-identity-modal">
        <b-modal
            v-model="showModal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @shown="onShown"
        >
            <!-- Modal Header -->
            <template #modal-title>
                <fa icon="file-edit"></fa>
                Edit Identity
            </template>

            <!-- Modal Content -->
            <b-form-group
                id="name-input-group"
                label="Name"
                label-for="name-input"
            >
                <b-form-input id="name-input" v-model="character.name"></b-form-input>
            </b-form-group>
            <b-form-group
                id="desc-input-group"
                label="Description"
                label-for="desc-input"
            >
                <b-card class="overflow-hidden" no-body>
                    <codemirror ref="editor" v-model="character.description"></codemirror>
                </b-card>
            </b-form-group>
            <b-form-group
                id="fp-input-group"
                label="Fate Refresh"
                label-for="fp-input"
            >
                <b-form-input id="fp-input" v-model.number="character.details.fatePoints.refresh" type="number" min="0" step="1"></b-form-input>
            </b-form-group>

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

<style lang="scss">
    .edit-identity-modal {
        .CodeMirror {
            height: 75px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts">
    //------------------------------------------------------------------------------------------------------------------

    import Vue from 'vue';

    // Managers
    import charMan from '../../../lib/managers/character';

    //------------------------------------------------------------------------------------------------------------------

    export default Vue.extend({
        name: 'EditIdentityModal',
        props: {
            value: {
                type: Boolean,
                default: false
            }
        },
        subscriptions()
        {
            return {
                character: charMan.selected$
            };
        },
        computed: {
            showModal: {
                get() { return this.value; },
                set(val) { this.$emit('input', val); }
            }
        },
        methods: {
            onSave()
            {
                // Save the character
                return charMan.save(charMan.selected);
            },
            onShown()
            {
                this.cmRefresh();
            },
            cmRefresh()
            {
                this.$nextTick(() =>
                {
                    this.$refs.editor.codemirror.refresh();
                });
            }
        }

    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
