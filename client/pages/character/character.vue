<template>
    <div id="character"  class="container-fluid">
        <component :is="baseChar.system" :base="baseChar"></component>
    </div>
</template>

<script type="text/babel">
    import charSvc from '../../components/character/characterService.js';

    // Systems
    import GenericCharacter from '../../../systems/generic/client/character.vue'
    import EotECharacter from '../../../systems/eote/client/character.vue'
    import DnD35Character from '../../../systems/dnd35/client/character.vue'

    export default {
        components: {
            generic: GenericCharacter,
            eote: EotECharacter,
            dnd35: DnD35Character
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