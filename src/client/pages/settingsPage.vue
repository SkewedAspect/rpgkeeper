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
            <div class="text-center">
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
                                Set Nick Name
                            </BButton>
                        </template>
                    </BInputGroup>
                </BCol>
            </BFormRow>

            <!-- Settings -->
            <BCard header-bg-variant="dark" header-text-variant="white" class="drop-shadow">
                <template #header>
                    <BButton
                        variant="primary"
                        class="float-end"
                        @click="save()"
                    >
                        <Fa icon="save" />
                        Save
                    </BButton>
                    <h5 class="align-middle mt-2">
                        <Fa icon="sliders-h" />
                        Settings
                    </h5>
                </template>

                <BFormGroup
                    label="Color Mode"
                    label-for="color-mode"
                >
                    <BFormRadioGroup
                        id="color-mode"
                        v-model="account.settings.colorMode"
                        :options="colorModeOptions"
                    />
                </BFormGroup>
            </BCard>
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>

    import { onBeforeMount } from 'vue';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useAccountStore } from '../lib/stores/account';
    import { useColorModeStore } from '../lib/stores/colorMode';

    // Managers
    import authMan from '../lib/managers/auth';

    // Components
    import Loading from '../components/ui/loadingWidget.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const colorModeOptions = [
        { text: 'Light', value: 'light' },
        { text: 'Dark', value: 'dark' },
        { text: 'Auto', value: 'auto' },
    ];

    const accountStore = useAccountStore();
    const { account } = storeToRefs(accountStore);

    const colorModeStore = useColorModeStore();
    const { colorMode } = storeToRefs(colorModeStore);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    async function save() : Promise<void>
    {
        // Save the account
        authMan.saveAccount(account.value);

        // Save the color mode
        colorMode.value = account.value.settings.colorMode ?? 'auto';
    }

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle
    //------------------------------------------------------------------------------------------------------------------

    onBeforeMount(() =>
    {
        account.value.settings = {
            // Default settings
            colorMode: 'auto',

            // Current settings
            ...account.value.settings || {},
        };
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
