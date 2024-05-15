<!----------------------------------------------------------------------------------------------------------------------
  -- Login Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="login">
        <!-- Profile dropdown -->
        <BNavItemDropdown v-if="account" id="profile-dropdown" :title="account.displayName" right no-caret>
            <template #button-content>
                <BImg
                    v-if="account.avatar"
                    rounded="circle"
                    width="32"
                    height="32"
                    blank-color="#777"
                    :src="account.avatar"
                ></BImg>
                <fa v-else icon="user-circle" size="2x"></fa>
                {{ account.displayName }}
            </template>
            <BDropdownItem to="/settings">
                <fa icon="user-circle"></fa>
                Profile
            </BDropdownItem>
            <BDropdownDivider></BDropdownDivider>
            <BDropdownItem @click="signOut()">
                <fa icon="sign-out"></fa>
                Sign Out
            </BDropdownItem>
        </BNavItemDropdown>

        <!-- Sign In Button -->
        <BButton v-else variant="dark" href="/auth/google">
            <fa icon="sign-in"></fa>
            Sign In
        </BButton>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #login {
		#profile-dropdown {
            margin-top: -2px;
            margin-bottom: -2px;

			a.nav-link {
				padding-top: 0.25rem;
                padding-bottom: 0.25rem;
			}
		}
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { storeToRefs } from 'pinia';

    // Stores
    import { useAccountStore } from '../../lib/stores/account';

    // Managers
    import authMan from '../../lib/managers/auth';

    //------------------------------------------------------------------------------------------------------------------

    const store = useAccountStore();
    const { account } = storeToRefs(store);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function signOut()
    {
        return authMan.signOut();
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
