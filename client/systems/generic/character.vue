<template>
    <h1>Generic System</h1>
    <pre>{{ base | json }}</pre>
</template>

<!--style lang="sass" src=""></style-->

<script type="text/babel">
    export default {
        props: {
            base: {
                required: true
            },
        },
        data: function()
        {
            return {};
        }
    }
</script>