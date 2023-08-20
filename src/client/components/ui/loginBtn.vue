<!----------------------------------------------------------------------------------------------------------------------
  -- Login Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="login">
        <!-- Profile dropdown -->
        <b-nav-item-dropdown v-if="account" id="profile-dropdown" :title="account.displayName" right no-caret>
            <template #button-content>
                <b-img
                    v-if="account.avatar"
                    rounded="circle"
                    width="32"
                    height="32"
                    blank-color="#777"
                    :src="account.avatar"
                ></b-img>
                <fa v-else icon="user-circle" size="2x"></fa>
                {{ account.displayName }}
            </template>
            <b-dropdown-item to="/settings">
                <fa icon="user-circle"></fa>
                Profile
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="signOut()">
                <fa icon="sign-out"></fa>
                Sign Out
            </b-dropdown-item>
        </b-nav-item-dropdown>

        <!-- Sign In Button -->
        <b-button v-else variant="dark" href="/auth/google">
            <fa icon="sign-in"></fa>
            Sign In
        </b-button>
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
