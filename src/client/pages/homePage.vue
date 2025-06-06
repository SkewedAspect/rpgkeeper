<!----------------------------------------------------------------------------------------------------------------------
  -- Main Page
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="main-page" class="container p-3">
        <div class="d-flex">
            <div class="d-flex m-auto">
                <img class="rpgk-logo" src="/images/logo.png" alt="RPGKeeper Logo">
                <div class="d-flex flex-column align-self-center">
                    <h1>
                        RPGKeeper
                        <br>
                        <small class="text-muted">
                            The universal digital character manager
                        </small>
                    </h1>
                    <p>
                        Everything you need to create, store, share, and play table top RPG characters.
                    </p>
                    <div>
                        <BButton v-if="account" variant="primary" to="/dashboard">
                            Go to Dashboard
                            <Fa icon="arrow-right" />
                        </BButton>
                        <BButton v-else variant="primary">
                            Create free account
                            <Fa icon="sign-in" />
                        </BButton>
                    </div>
                </div>
            </div>
        </div>

        <hr class="fancy mt-5">

        <BRow class="mt-5">
            <BCol>
                <h3 class="text-center">
                    <Fa icon="bullseye-pointer" />
                    Targeted Characters
                </h3>

                <p class="mt-4">
                    Each system RPGKeeper supports is hand-coded to the needs of that system. This is not a generic
                    character tracker; it's customized to the needs of each system, hand-tailored to the needs of each
                    and every system we support.
                </p>

                <hr class="fancy">
            </BCol>
            <BCol>
                <h3 class="text-center">
                    <Fa icon="users-crown" />
                    User Driven
                </h3>

                <p class="mt-4">
                    All features and designs come from our user community. Which systems are added, what direction the
                    site takes; it's all in the hands of the people using RPGKeeper! And, it's not exclusive; any user
                    can make suggestions or request features.
                </p>

                <hr class="fancy">
            </BCol>
            <BCol>
                <h3 class="text-center">
                    <Fa icon="chart-network" />
                    Interoperable
                </h3>

                <p class="mt-4">
                    RPGKeeper is deigned to be able to integrate with any other system that wants to do so. Using
                    standards like oAuth and REST, RPGKeeper exposes an API that allows other applications to
                    authenticate and pull character data.
                </p>

                <hr class="fancy">
            </BCol>
        </BRow>
        <BRow class="mt-5">
            <BCol>
                <h3 class="text-center">
                    <Fa icon="tachometer-alt" />
                    Optimized Code
                </h3>

                <p class="mt-4">
                    Built by veteran developer with years of experience in scaling websites to hundreds of thousands of
                    interactions per second, RPGKeeper is built on Enterprise grade technology, leveraging the same
                    frameworks that power much larger sites.
                </p>

                <hr class="fancy">
            </BCol>
            <BCol>
                <h3 class="text-center">
                    <Fa icon="code-branch" />
                    Open Source
                </h3>

                <p class="mt-4">
                    RPGKeeper is 100% open source. Issues can be reported directly to the developers. Features, new
                    systems, or improvements can be made by anyone and once approved will be made available to everyone,
                    sometimes as quickly as in a few minutes.
                </p>

                <hr class="fancy">
            </BCol>
            <BCol>
                <h3 class="text-center">
                    <Fa icon="sack-dollar" />
                    Usefully Free
                </h3>

                <p class="mt-4">
                    As RPGKeeper evolves from a passion project to a full-fledged platform, it's needs have to evolve as
                    well. Regardless, we are dedicated to always having the core functionality be free. RPGKeeper will
                    always be useful, even if you don't pay for it.
                </p>

                <hr class="fancy">
            </BCol>
        </BRow>

        <h4 class="text-center mt-5">
            Now that you've read our marketing pitch, why don't you try out RPGKeeper?
        </h4>
        <p class="text-center">
            After all, it's free. There's nothing to lose, and infinite worlds to gain.
        </p>

        <div class="text-center">
            <BButton v-if="account" variant="primary" to="/dashboard">
                Go to Dashboard
                <Fa icon="arrow-right" />
            </BButton>
            <BButton v-else variant="primary" href="/auth/google">
                Create free account
                <Fa icon="sign-in" />
            </BButton>
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
	#main-page {
        .rpgk-logo {
            width: 200px;
            margin-top: -10px;
            margin-right: -5px;
        }
	}
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useAccountStore } from '../lib/stores/account';

    //------------------------------------------------------------------------------------------------------------------

    const router = useRouter();
    const store = useAccountStore();
    const { account, redirectToDashboard } = storeToRefs(store);

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle Hooks
    //------------------------------------------------------------------------------------------------------------------

    onMounted(() =>
    {
        if(account.value && redirectToDashboard.value)
        {
            console.warn('User was signed in before page load, redirecting to dashboard.');

            // We've completed a sign in, redirect
            router.push('/dashboard');
        }
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
