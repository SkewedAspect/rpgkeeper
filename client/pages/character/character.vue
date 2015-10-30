<template>
    <h1>Character goes here!</h1>
    <pre>{{ baseChar | json }}</pre>
</template>

<script type="text/babel">
    import charSvc from '../../components/character/characterService.js';

    export default {
        data: function()
        {
            return {
                baseChar: null,
                systemChar: null,
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