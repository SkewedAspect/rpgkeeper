<!----------------------------------------------------------------------------------------------------------------------
  -- EditConsequenceModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="edit-consequences-modal" v-if="character">
        <b-modal ref="modal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            size="lg"
            @ok="onSave"
            @shown="onShown">

            <!-- Modal Header -->
            <template slot="modal-title">
                <fa icon="file-edit"></fa>
                Edit Consequence
            </template>

            <!-- Modal Content -->
            <b-form-group
                id="mild-consequence-1"
                label="Mild Consequence (2)"
                label-class="font-weight-bold"
                label-for="mc-input-1">
                <b-form-input id="mc-input-1" v-model="mildConsequence1Edit.detail"></b-form-input>
            </b-form-group>
            <b-form-group
                v-if="hasExtraMild"
                id="mild-consequence-2"
                :label="`Mild Consequence (2, ${ extraMildType })`"
                label-class="font-weight-bold"
                label-for="mc-input-2">
                <b-form-input id="mc-input-2" v-model="mildConsequence2Edit.detail"></b-form-input>
            </b-form-group>
            <b-form-group
                id="moderate-consequence"
                label="Moderate Consequence (4)"
                label-class="font-weight-bold"
                label-for="mc-input">
                <b-form-input id="mc-input" v-model="moderateConsequenceEdit.detail"></b-form-input>
            </b-form-group>
            <b-form-group
                id="severe-consequence"
                label="Severe Consequence (6)"
                label-class="font-weight-bold"
                label-for="sc-input">
                <b-form-input id="sc-input" v-model="severeConsequenceEdit.detail"></b-form-input>
            </b-form-group>

            <!-- Modal Buttons -->
            <template slot="modal-ok">
                <fa icon="save"></fa>
                Save
            </template>
            <template slot="modal-cancel">
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    .edit-consequences-modal {
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Managers
    import charMan from '../../../client/api/managers/character';
    import consequences from './consequences';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EditConsequenceModal',
        subscriptions: {
            character: charMan.selected$
        },
        computed: {
            hasExtraMild(){ return this.extraMildType !== 'none'; },
            consequences(){ return _.filter(this.character.details.aspects, { type: 'consequence' }); },
            mildConsequence1(){ return _.filter(this.consequences, { value: 2 })[0] || { type: 'consequence', detail: "", healing: false, value: 2 }; },
            mildConsequence2(){ return _.filter(this.consequences, { value: 2 })[1] || { type: 'consequence', detail: "", healing: false, value: 2 }; },
            moderateConsequence(){ return _.filter(this.consequences, { value: 4 })[0] || { type: 'consequence', detail: "", healing: false, value: 4 }; },
            severeConsequence(){ return _.filter(this.consequences, { value: 6 })[0] || { type: 'consequence', detail: "", healing: false, value: 6 }; },
            extraMildType()
            {
                const will = _.find(this.character.details.skills, { name: "Will" });
                const physique = _.find(this.character.details.skills, { name: "Physique" });

                if((physique && physique.rank >= 5) && (will && will.rank >= 5))
                {
                    return 'Mental and Physical';
                }
                else if(physique && physique.rank >= 5)
                {
                    return 'Physical';
                }
                else if(will && will.rank >= 5)
                {
                    return 'Mental';
                }
                else
                {
                    return 'none';
                } // end if
            }
        },
        methods: {
            async onSave()
            {
                console.log('saving...');

                // Filter out any consequences that are now empty.
                const consequences = [
                    this.mildConsequence1Edit,
                    this.mildConsequence2Edit,
                    this.moderateConsequenceEdit,
                    this.severeConsequenceEdit
                ].filter((consequence) => !consequence.detail);

                // Pull out aspects, remove all consequences, and then re-add them.
                let aspects = this.character.details.aspects.filter((aspect) => aspect.type !== 'consequences');
                aspects = aspects.concat(consequences);

                // Add them back to the character
                this.character.details.aspects = aspects;

                // Save the character
                await charMan.save(this.character);
            },
            onShown()
            {
                // Reset the edit fields
                Object.assign(this.mildConsequence1Edit, this.mildConsequence1);
                Object.assign(this.mildConsequence2Edit, this.mildConsequence2);
                Object.assign(this.moderateConsequenceEdit, this.moderateConsequence);
                Object.assign(this.severeConsequenceEdit, this.severeConsequence);
            },

            show()
            {
                this.$refs.modal.show();
            },
            hide()
            {
                this.$refs.modal.hide();
            }
        },
        data()
        {
            return {
                mildConsequence1Edit: { type: 'consequence', detail: "", healing: false, value: 2 },
                mildConsequence2Edit: { type: 'consequence', detail: "", healing: false, value: 2 },
                moderateConsequenceEdit: { type: 'consequence', detail: "", healing: false, value: 4 },
                severeConsequenceEdit: { type: 'consequence', detail: "", healing: false, value: 6 },
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
