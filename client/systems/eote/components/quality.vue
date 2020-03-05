<!----------------------------------------------------------------------------------------------------------------------
  -- quality.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <span class="eote-quality">
        <b-badge :id="`quality-${ name }`">
            {{ qualityName }}
        </b-badge>
        <b-popover :target="`quality-${ name }`" triggers="hover" placement="top">
            <markdown-block :text="qualityText"></markdown-block>
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

    import eoteMan from '../../../api/managers/eote';
    import MarkdownBlock from '../../../components/ui/markdown';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EoteQuality',
        components: { MarkdownBlock },
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
                qualities: eoteMan.qualities$
            };
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
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
