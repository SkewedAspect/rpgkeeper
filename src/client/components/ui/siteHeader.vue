<!----------------------------------------------------------------------------------------------------------------------
  -- Site Header
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BNavbar id="site-header" v-b-color-mode="'dark'" toggleable="md" type="dark" variant="dark" sticky="top">
        <BNavbarToggle target="nav-text-collapse"></BNavbarToggle>
        <BNavbarBrand to="/">
            <img src="/images/logo.png" class="d-inline-block logo" alt="RPGKeeper Logo" />
            RPGKeeper
        </BNavbarBrand>
        <BCollapse id="nav-text-collapse" is-nav>
            <BNavbarNav>
                <BNavItem to="/dashboard">
                    <fa icon="columns"></fa>
                    Dashboard
                </BNavItem>
            </BNavbarNav>
            <BNavbarNav class="ms-auto">
                <LoginBtn></LoginBtn>
            </BNavbarNav>
        </BCollapse>
    </BNavbar>
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
