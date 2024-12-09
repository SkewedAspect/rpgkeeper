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
                />
                <Fa v-else icon="user-circle" size="2x" />
                {{ account.displayName }}
            </template>
            <BDropdownItem to="/settings">
                <Fa icon="user-circle" />
                Profile
            </BDropdownItem>
            <BDropdownDivider />
            <BDropdownItem @click="signOut()">
                <Fa icon="sign-out" />
                Sign Out
            </BDropdownItem>
        </BNavItemDropdown>

        <!-- Sign In Button -->
        <BButton v-else variant="dark" href="/auth/google">
            <Fa icon="sign-in" />
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

    async function signOut() : Promise<void>
    {
        return authMan.signOut();
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
