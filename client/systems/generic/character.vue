<template>
    <h1>Generic System</h1>
    <pre>{{ char | json }}</pre>
</template>

<!--style lang="sass" src=""></style-->

<script type="text/babel">
    import GenericCharacter from './model';
    import systemsSvc from '../../components/systems/systemsService';

    export default {
        props: {
            base: {
                required: true
            },
        },
        data: function()
        {
            return {
                char: null
            };
        },
        activate: function(done)
        {
            systemsSvc.getChar(this.base.system, this.base.id)
                .then((char) =>
                {
                    // Wrap this in a model!
                    this.char = new GenericCharacter(this.base, char);

                    console.log('char:', this.char);
                    done();
                });
        }
    }
</script>