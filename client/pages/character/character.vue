<template>
    <div id="character"  class="container">
        <component :is="baseChar.system" :base="baseChar"></component>
    </div>
</template>

<script type="text/babel">
    import charSvc from '../../components/character/characterService.js';

    // Systems
    import GenericCharacterComponent from '../../../systems/generic/client/character.vue'
    import EotECharacterComponent from '../../../systems/eote/client/character.vue'

    export default {
        components: {
            generic: GenericCharacterComponent,
            eote: EotECharacterComponent
        },
        data: function()
        {
            return {
                baseChar: {},
                charID: this.$route.params.id
            };
        },
        ready: function()
        {
            charSvc.get(this.charID)
                .then((char) => {
                    this.baseChar = char;
                });
        }
    }
</script>