<!----------------------------------------------------------------------------------------------------------------------
  -- Site Header
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BNavbar id="site-header" v-b-color-mode="'dark'" toggleable="md" type="dark" variant="dark" fixed="top">
        <BNavbarToggle target="nav-text-collapse" />
        <BNavbarBrand to="/">
            <img src="/images/logo.png" class="d-inline-block logo" alt="RPGKeeper Logo">
            RPGKeeper
        </BNavbarBrand>
        <BCollapse id="nav-text-collapse" is-nav>
            <BNavbarNav>
                <BNavItem to="/dashboard">
                    <Fa icon="columns" />
                    Dashboard
                </BNavItem>
                <BNavItem v-if="features.campaigns" to="/campaigns">
                    <Fa icon="notebook" />
                    Campaigns
                </BNavItem>
                <BNavItem to="/characters">
                    <Fa icon="users" />
                    Characters
                </BNavItem>
            </BNavbarNav>
            <BNavbarNav v-b-color-mode="'light'" class="ms-auto align-items-center">
                <BNavItem to="/about" title="About" class="icon-link">
                    <Fa icon="circle-info" size="lg" />
                </BNavItem>
                <BNavItem
                    href="https://github.com/Morgul/rpgkeeper"
                    target="_blank"
                    title="Github Project"
                    class="icon-link"
                >
                    <Fa :icon="['fab', 'github']" size="lg" />
                </BNavItem>
                <LoginBtn />
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

        .icon-link .nav-link {
            color: rgba(255, 255, 255, 0.55);

            &:hover, &:focus {
                color: rgba(255, 255, 255, 0.75);
            }
        }
	}
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { storeToRefs } from 'pinia';

    // Stores
    import { useAccountStore } from '../../lib/resource-access/stores/account';

    // Components
    import LoginBtn from './loginBtn.vue';

    // Config
    import { features } from '../../lib/config/features';

    //------------------------------------------------------------------------------------------------------------------

    const store = useAccountStore();
    const { account: _account } = storeToRefs(store);
</script>

<!--------------------------------------------------------------------------------------------------------------------->
