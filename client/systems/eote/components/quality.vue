<!----------------------------------------------------------------------------------------------------------------------
  -- quality.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <span class="eote-quality">
        <b-badge :id="id">
            {{ qualityName }}
        </b-badge>
        <b-popover :title="qualityName" :target="id" triggers="hover" placement="top">
            <div :class="`${ mode }-system`">
                <markdown-block :text="qualityText" inline></markdown-block>
                <reference class="float-right mt-2 mb-2" :reference="qualityReference"></reference>
            </div>
        </b-popover>
    </span>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .eote-quality {
        cursor: pointer;

        & + .eote-quality {
            margin-left: 0.25rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import { v4 } from 'uuid';

    // Managers
    import eoteMan from '../../../api/managers/eote';

    // Components
    import Reference from './reference.vue';
    import MarkdownBlock from '../../../components/ui/markdown';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EoteQuality',
        components: { MarkdownBlock, Reference },
        props: {
            name: {
                type: String,
                required: true
            },
            rank: {
                type: Number,
                default: 1
            }
        },
        subscriptions()
        {
            return {
                mode: eoteMan.mode$,
                qualities: eoteMan.qualities$
            };
        },
        data()
        {
            return { id: v4() };
        },
        computed: {
            passive()
            {
                return this.quality && this.quality.passive;
            },
            quality()
            {
                return this.qualities.filter((quality) => quality.name === this.name)[0];
            },
            qualityName()
            {
                let text = `${ this.name }`;

                if(this.quality && this.quality.ranked)
                {
                    text += ` ${ this.rank }`;
                } // end if

                return text;
            },
            qualityText()
            {
                let text = this.passive ? '**Passive:** ' : '**Active:** ';
                if(this.quality && this.quality.description)
                {
                    text += this.quality.description;
                }
                else
                {
                    text += 'Unknown quality.';
                } // end if

                return text;
            },
            qualityReference()
            {
                if(this.quality && this.quality.reference)
                {
                    return this.quality.reference;
                } // end if

                return '';
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
