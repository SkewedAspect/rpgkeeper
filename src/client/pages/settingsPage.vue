<!----------------------------------------------------------------------------------------------------------------------
  -- Settings
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="settings-page container pt-3">
        <!-- Loading -->
        <loading v-if="!account" text="Account Loading..."></loading>

        <!-- Once loaded -->
        <div v-else>
            <!-- Giant Avatar Picture of Doom -->
            <div class="avatar-holder">
                <b-img
                    rounded="circle"
                    width="128"
                    height="128"
                    :src="account.avatarUrl"
                    :alt="account.displayName"
                    class="m-1"
                    center
                ></b-img>
                <h4 class="text-center">
                    {{ account.email }}
                </h4>
            </div>

            <!-- Display Name setting -->
            <b-form-row class="mb-4">
                <b-col offset="1" cols="10" offset-md="3" md="6" offset-lg="4" lg="4">
                    <b-input-group>
                        <b-form-input v-model="account.name" placeholder="Display Name"></b-form-input>

                        <b-input-group-append>
                            <b-btn variant="primary" @click="save()">
                                <fa icon="save"></fa>
                                Set Name
                            </b-btn>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
            </b-form-row>

            <!-- Settings -->
            <b-card header-bg-variant="dark" header-text-variant="white" class="drop-shadow">
                <template #header>
                    <h5 class="align-middle mt-2">
                        <fa icon="sliders-h"></fa>
                        Settings
                    </h5>
                </template>

                <h4 class="text-center text-muted mb-0">
                    Settings are not implemented.
                </h4>
            </b-card>
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
    import Loading from '../components/ui/loading.vue';

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
