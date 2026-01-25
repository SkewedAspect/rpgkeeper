<!----------------------------------------------------------------------------------------------------------------------
  -- Login Component
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div id="login">
        <!-- Profile dropdown -->
        <BNavItemDropdown v-if="account" id="profile-dropdown" :title="account.name" right no-caret>
            <template #button-content>
                <BImg
                    v-if="account.avatar && !avatarError"
                    rounded="circle"
                    width="32"
                    height="32"
                    blank-color="#777"
                    :src="account.avatar"
                    @error="onAvatarError"
                />
                <Fa v-else icon="user-circle" size="2x" />
                {{ account.name }}
            </template>
            <BDropdownItem to="/settings">
                <Fa icon="user-circle" />
                Profile
            </BDropdownItem>
            <BDropdownDivider />
            <BDropdownItem :href="bugURL" target="_blank">
                <Fa icon="bug" />
                Report a Bug
            </BDropdownItem>
            <BDropdownItem :href="feedbackURL" target="_blank">
                <Fa icon="comment-alt-lines" />
                Leave Feedback
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
    import { ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useAccountStore } from '../../lib/resource-access/stores/account';

    // Managers
    import authMan from '../../lib/managers/auth';

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const avatarError = ref(false);

    //------------------------------------------------------------------------------------------------------------------

    const store = useAccountStore();
    const { account } = storeToRefs(store);

    const bugURL = 'https://github.com/Morgul/rpgkeeper/issues/new?labels=bug,needs%20review&title=[Bug Report]%20';
    const feedbackURL = 'https://github.com/Morgul/rpgkeeper/issues/new?labels=feedback&title=[Feedback]%20';

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function onAvatarError() : void
    {
        avatarError.value = true;
    }

    async function signOut() : Promise<void>
    {
        return authMan.signOut();
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
