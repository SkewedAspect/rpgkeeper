<template>
    <img :src="gravatarURL">
</template>

<script type="text/babel">
    import gravatar from 'gravatar';

    export default {
        props: {
            email: {
                type: String,
                required: true
            },
            size: {
                type: Number,
                default: 40
            },
            rating: {
                type: String,
                default: 'g'
            },
            default: {
                type: String,
                default: 'identicon'
            },
            forceDefault: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            gravatarURL: function()
            {
                var options = {
                    size: this.size,
                    rating: this.rating,
                    default: this.default,
                };

                // We can't even include the option, or it will always force the default.
                if(this.forceDefault)
                {
                    options.forcedefault = true;
                } // end if

                return gravatar.url(this.email, options, true);
            }
        }
    }
</script>