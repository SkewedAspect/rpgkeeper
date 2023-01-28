<!----------------------------------------------------------------------------------------------------------------------
  -- talentCard
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-card v-if="talent && talentBase" :id="id" class="eote-talent-card" no-body>
        <template #header>
            <div class="text-nowrap text-center">
                <b>{{ talentBase.name }}</b>
                <span v-if="talentBase.ranked" class="font-weight-bold">{{ talent.ranks }}</span>
                <span v-if="mode === 'genesys'">
                    (Tier {{ talentBase.tier }})
                </span>
            </div>

            <b-popover :target="id" triggers="hover" placement="top">
                <template #title>
                    <div :class="`${ mode }-system`">
                        {{ talentBase.name }}
                        <span v-if="talentBase.ranked">{{ talent.ranks }}</span>
                        <span v-if="mode === 'genesys'">
                            (Tier {{ talent.tier }})
                        </span>
                    </div>
                </template>
                <div :class="`${ mode }-system`">
                    <div>
                        <i>{{ activation }}</i>
                    </div>
                    <MarkdownBlock :text="talentBase.description" inline></MarkdownBlock>
                    <div class="clearfix">
                        <reference class="float-right mt-2 mb-2" :reference="talentBase.reference"></reference>
                    </div>
                    <div v-if="talent.notes">
                        <hr class="mt-1 mb-1" />
                        <MarkdownBlock :text="talent.notes" inline></MarkdownBlock>
                    </div>
                </div>
            </b-popover>
        </template>
    </b-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
.eote-talent-card {
    .card-header {
        border-bottom: none;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
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
    import MarkdownBlock from '../../../ui/markdownBlock.vue';
    import Reference from '../../../character/reference.vue';

    //------------------------------------------------------------------------------------------------------------------

    export default defineComponent({
        name: 'EotETalentCard',
        components: {
            MarkdownBlock,
            Reference
        },
        props: {
            talent: {
                type: Object,
                required: true
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
        subscriptions()
        {
            return {
                talents: eoteMan.talents$,
                mode: eoteMan.mode$
            };
        },
        emits: [ 'edit', 'remove' ],
        data()
        {
            return {
                uuid: shortID()
            };
        },
        computed: {
            id()
            {
                return `talent-${ this.uuid }`;
            },
            talentBase()
            {
                if(this.talent && this.talent.id)
                {
                    return this.talents.find((talent) => talent.id === this.talent.id);
                }

                return {};
            },
            activation()
            {
                if(this.talentBase.name)
                {
                    return eoteMan.activationEnum[this.talentBase.activation];
                }

                return '';
            }
        },
        methods: {
            edit()
            {
                if(!this.readonly)
                {
                    this.$emit('edit', this.talent.title);
                }
            },
            remove()
            {
                if(!this.readonly)
                {
                    this.$emit('remove', this.talent.title);
                }
            }
        }

    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
