<!----------------------------------------------------------------------------------------------------------------------
  -- Settings
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="settings-page container pt-3">
        <!-- Loading -->
        <Loading v-if="!account" text="Account Loading..." />

        <!-- Once loaded -->
        <div v-else>
            <!-- Giant Avatar Picture of Doom -->
            <div class="avatar-holder">
                <BImg
                    rounded="circle"
                    width="128"
                    height="128"
                    :src="account.avatarUrl"
                    :alt="account.displayName"
                    class="m-1"
                    center
                />
                <h4 class="text-center">
                    {{ account.email }}
                </h4>
            </div>

            <!-- Display Name setting -->
            <BFormRow class="mb-4">
                <BCol offset="1" cols="10" offset-md="3" md="6" offset-lg="4" lg="4">
                    <BInputGroup>
                        <BFormInput v-model="account.name" placeholder="Display Name" />

                        <template #append>
                            <BButton variant="primary" @click="save()">
                                <Fa icon="save" />
                                Set Name
                            </BButton>
                        </template>
                    </BInputGroup>
                </BCol>
            </BFormRow>

            <!-- Settings -->
            <BCard header-bg-variant="dark" header-text-variant="white" class="drop-shadow">
                <template #header>
                    <h5 class="align-middle mt-2">
                        <Fa icon="sliders-h" />
                        Settings
                    </h5>
                </template>

                <h4 class="text-center text-muted mb-0">
                    Settings are not implemented.
                </h4>
            </BCard>
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>

    import { storeToRefs } from 'pinia';

    // Stores
    import { useAccountStore } from '../lib/stores/account';

    // Managers
    import authMan from '../lib/managers/auth';

    // Components
    import Loading from '../components/ui/loadingWidget.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const store = useAccountStore();
    const { account } = storeToRefs(store);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    async function save() : Promise<void>
    {
        return authMan.saveAccount(account.value);
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
