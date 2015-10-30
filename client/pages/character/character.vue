<template>
    <h1>Character goes here!</h1>
    <code>{{ charID }}</code>
</template>

<script type="text/babel">
    export default {
        data: function()
        {
            return {
                charID: this.$route.params.id
            };
        }
    }
</script>