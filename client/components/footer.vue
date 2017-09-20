<!--------------------------------------------------------------------------------------------------------------------->
<!-- footer                                                                                                         -->
<!--------------------------------------------------------------------------------------------------------------------->

<template>
    <footer id="site-footer" class="container text-center">
        <hr>
        <ul>
            <li><a href="/about"><i class="fa fa-question"></i> About</a></li>
            <li>|</li>
            <li><a href="https://github.com/Morgul/rpgkeeper"><i class="fa fa-github"></i> Github Project</a></li>
            <li>|</li>
            <li><a href="https://github.com/Morgul/rpgkeeper/issues/new"><i class="fa fa-bug"></i> Report a Bug</a></li>
        </ul>
        <p>&copy; 2015 - 2017 Skewed Aspect Studios. All rights reserved.</p>
    </footer>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #site-footer {
        color: #aaa;
        font-size: 12px;

        hr {
            border: 0;
            height: 1px;
            background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(180, 180, 180, 0.75), rgba(0, 0, 0, 0));
        }

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

<script>
    export default {}
</script>

<!--------------------------------------------------------------------------------------------------------------------->