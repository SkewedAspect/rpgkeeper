<!----------------------------------------------------------------------------------------------------------------------
  -- Site Header
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-navbar id="site-header" toggleable="md" type="dark" variant="dark" sticky>
        <b-navbar-brand to="/">
            <img src="/images/logo.png" class="d-inline-block logo" alt="RPGKeeper Logo" />
            RPGKeeper
        </b-navbar-brand>
        <b-navbar-nav>
            <b-nav-item to="/dashboard">
                <fa icon="columns"></fa>
                Dashboard
            </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
            <LoginBtn></LoginBtn>
        </b-navbar-nav>
    </b-navbar>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
	#site-header {
        .logo {
            margin-top: -5px;
            width: 30px;
            height: 30px;
        }
	}
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { storeToRefs } from 'pinia';

    // Stores
    import { useAccountStore } from '../../lib/stores/account';

    // Components
    import LoginBtn from './loginBtn.vue';

    //------------------------------------------------------------------------------------------------------------------

    const store = useAccountStore();
    const { account } = storeToRefs(store);
</script>

<!--------------------------------------------------------------------------------------------------------------------->
