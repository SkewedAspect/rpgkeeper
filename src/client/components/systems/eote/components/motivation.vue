<!----------------------------------------------------------------------------------------------------------------------
  -- motivation
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="genesys-motivation d-inline-block">
        <b-badge :id="uniqueID">
            {{ motivationName }}
        </b-badge>
        <b-popover :title="motivationName" :target="uniqueID" triggers="hover" placement="top">
            <div :class="`genesys-system`">
                <markdown-block :text="motivationText" inline></markdown-block>
                <reference
                    v-if="motivationReference"
                    class="float-right mt-2 mb-2"
                    :reference="motivationReference"
                ></reference>
            </div>
        </b-popover>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .genesys-motivation {
        cursor: pointer;
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts">
//------------------------------------------------------------------------------------------------------------------

    import Vue from 'vue';

    // Utils
    import { shortID } from '../../../../../common/utils/misc';

    // Managers
    import eoteMan from '../../../../lib/managers/eote';

    // Components
    import Reference from '../../../character/reference.vue';
    import MarkdownBlock from '../../../ui/markdown.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default Vue.extend({
        name: 'GenesysMotivation',
        components: { MarkdownBlock, Reference },
        props: {
            id: {
                type: Number,
                required: true
            }
        },
        subscriptions()
        {
            return {
                motivations: eoteMan.motivations$
            };
        },
        data()
        {
            return {
                uniqueID: shortID()
            };
        },
        computed: {
            motivation()
            {
                return this.motivations.filter((motivation) => motivation.id === this.id)[0];
            },
            motivationName()
            {
                let text = 'Unknown';

                if(this.motivation)
                {
                    text = `${ this.motivation.name }`;
                    if(this.motivation.ranked)
                    {
                        text += ` ${ this.ranks }`;
                    }
                }

                return text;
            },
            motivationText()
            {
                if(this.motivation && this.motivation.description)
                {
                    return this.motivation.description;
                }
                else
                {
                    return 'Unknown motivation.';
                }
            },
            motivationReference()
            {
                if(this.motivation && this.motivation.reference)
                {
                    return this.motivation.reference;
                }

                return '';
            }
        }

    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
