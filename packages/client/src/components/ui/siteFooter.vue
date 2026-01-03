<!----------------------------------------------------------------------------------------------------------------------
  -- Footer
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <footer id="site-footer" class="container text-center">
        <hr class="mt-0 fancy">
        <ul>
            <li>
                <RouterLink to="/about">
                    <Fa icon="question" />
                    About
                </RouterLink>
            </li>
            <li>|</li>
            <li>
                <a href="https://github.com/Morgul/rpgkeeper" target="_blank">
                    <Fa :icon="['fab', 'github']" />
                    Github Project
                </a>
            </li>
            <li>|</li>
            <li>
                <a :href="bugURL" target="_blank">
                    <Fa icon="bug" />
                    Report a Bug
                </a>
            </li>
            <li>|</li>
            <li>
                <a :href="feedbackURL" target="_blank">
                    <Fa icon="comment-alt-lines" />
                    Leave Feedback
                </a>
            </li>
        </ul>
        <p class="mt-2 mb-0">
            &copy; 2015 - {{ currentYear }} Skewed Aspect Studios. All rights reserved.
        </p>
        <div class="mb-2">
            v{{ appVersion }}
        </div>
    </footer>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #site-footer {
        color: #aaa;
        font-size: 12px;

        ul {
            padding-left: 0;
            margin-bottom: 0;
            list-style-type: none;

            li {
                display: inline-block;
                margin-right: 20px;

                &:last-child {
                    margin-right: 0;
                }
            }

            & + p {
                margin-top: 0;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>

    import { computed } from 'vue';

    //------------------------------------------------------------------------------------------------------------------

    const bugURL = 'https://github.com/Morgul/rpgkeeper/issues/new?labels=bug,needs%20review&title=[Bug Report]%20';
    const feedbackURL = 'https://github.com/Morgul/rpgkeeper/issues/new?labels=feedback&title=[Feedback]%20';

    // eslint-disable-next-line no-undef
    const appVersion = computed(() => __APP_VERSION__);
    const currentYear = computed(() => (new Date()).getFullYear());
</script>

<!--------------------------------------------------------------------------------------------------------------------->
