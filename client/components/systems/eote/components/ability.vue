<!----------------------------------------------------------------------------------------------------------------------
  -- ability.vue
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <span class="eote-ability">
        <b-badge :id="id">
            {{ abilityName }}
        </b-badge>
        <b-popover :title="abilityName" :target="id" triggers="hover" placement="top">
            <div :class="`${ mode }-system`">
                <markdown-block :text="abilityText" inline></markdown-block>
                <reference class="float-right mt-2 mb-2" :reference="abilityReference"></reference>
            </div>
        </b-popover>
    </span>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .eote-ability {
        cursor: pointer;

        & + .eote-ability {
            margin-left: 0.25rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import { v4 } from 'uuid';

    // Managers
    import eoteMan from '../../../../api/managers/eote';

    // Components
    import Reference from './reference.vue';
    import MarkdownBlock from '../../../ui/markdown';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EoteAbility',
        components: { MarkdownBlock, Reference },
        props: {
            name: {
                type: String,
                required: true
            }
        },
        subscriptions()
        {
            return {
                mode: eoteMan.mode$,
                abilities: eoteMan.abilities$
            };
        },
        data()
        {
            return { id: v4() };
        },
        computed: {
            passive()
            {
                return this.ability && this.ability.passive;
            },
            ability()
            {
                return this.abilities.filter((ability) => ability.name === this.name)[0];
            },
            abilityName()
            {
                return `${ this.name }`;
            },
            abilityText()
            {
                if(this.ability && this.ability.description)
                {
                    return this.ability.description;
                }
                else
                {
                    return 'Unknown ability.';
                } // end if
            },
            abilityReference()
            {
                if(this.ability && this.ability.reference)
                {
                    return this.ability.reference;
                } // end if

                return '';
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
