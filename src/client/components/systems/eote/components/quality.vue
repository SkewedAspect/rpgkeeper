<!----------------------------------------------------------------------------------------------------------------------
  -- quality.vue
  --------------------------------------------------------------------------------------------------------------------->
<template>
    <span class="eote-quality">
        <b-badge :id="uniqueID">
            {{ qualityName }}
        </b-badge>
        <b-popover :title="qualityName" :target="uniqueID" triggers="hover" placement="top">
            <div :class="`${ mode }-system`">
                <MarkdownBlock :text="qualityText" inline></MarkdownBlock>
                <reference
                    v-if="qualityReference"
                    class="float-right mt-2 mb-2"
                    :reference="qualityReference"
                ></reference>
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
<script lang="ts">
    //------------------------------------------------------------------------------------------------------------------

    import { defineComponent } from 'vue';

    // Utils
    import { shortID } from '../../../../../common/utils/misc';

    // Managers
    import eoteMan from '../../../../lib/managers/systems/eote';

    // Components
    import Reference from '../../../character/reference.vue';
    import MarkdownBlock from '../../../ui/markdownBlock.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default defineComponent({
        name: 'EoteQuality',
        components: { MarkdownBlock, Reference },
        props: {
            id: {
                type: Number,
                required: true
            },
            ranks: {
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
            return {
                uniqueID: shortID()
            };
        },
        computed: {
            passive()
            {
                return this.quality && this.quality.passive;
            },
            quality()
            {
                return this.qualities.filter((quality) => quality.id === this.id)[0];
            },
            qualityName()
            {
                let text = 'Unknown';

                if(this.quality)
                {
                    text = `${ this.quality.name }`;
                    if(this.quality.ranked)
                    {
                        text += ` ${ this.ranks }`;
                    }
                }

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
                }

                return text;
            },
            qualityReference()
            {
                if(this.quality && this.quality.reference)
                {
                    return this.quality.reference;
                }

                return '';
            }
        }

    });
</script>
<!--------------------------------------------------------------------------------------------------------------------->
