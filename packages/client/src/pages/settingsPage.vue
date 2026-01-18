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
                    :src="account.avatar"
                    :alt="account.name"
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
                                Set Display Name
                            </BButton>
                        </template>
                    </BInputGroup>
                    <small class="text-muted">
                        This is the name that will be displayed to other users.
                    </small>
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

                <div class="d-flex gap-2">
                    <BCard class="w-100">
                        <BFormGroup
                            label="Theme Colors"
                            label-for="color-mode"
                        >
                            <BFormRadioGroup
                                id="color-mode"
                                v-model="account.settings.colorMode"
                                :options="colorModeOptions"
                            />
                        </BFormGroup>
                    </BCard>
                    <BCard class="w-100">
                        <div class="d-flex gap-2">
                            <div class="w-50">
                                <BFormGroup
                                    label="Development Status Filter"
                                    label-for="sys-filter"
                                    description="By default, we don't display systems that are in early development.
                                    This setting allows you to change how we filter what systems we display for your
                                    user."
                                >
                                    <BFormSelect
                                        id="sys-filter"
                                        v-model="account.settings.systemFilter"
                                        :options="systemFilterOptions"
                                    />
                                </BFormGroup>
                            </div>
                            <div class="w-50">
                                <ul>
                                    <li class="font-xs">
                                        <b>Development (Alpha)</b> - these systems are in early development and may not
                                        be stable. Expect them to be incomplete, buggy, or missing features.
                                    </li>
                                    <li class="font-xs">
                                        <b>Public Preview (Beta)</b> - these systems are in public preview and may have
                                        some bugs or missing features.
                                    </li>
                                    <li class="font-xs">
                                        <b>Production Ready (Stable)</b> - these systems are production-ready and are
                                        considered stable. All features should be present and working.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </BCard>
                </div>
            </BCard>
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>

    import { onBeforeMount } from 'vue';
    import { storeToRefs } from 'pinia';

    // Stores
    import { useAccountStore } from '../lib/resource-access/stores/account';

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

    const systemFilterOptions = [
        { text: 'Development (Alpha)', value: 'dev' },
        { text: 'Public Preview (Beta)', value: 'beta' },
        { text: 'Production Ready (Stable)', value: 'stable' },
    ];

    const accountStore = useAccountStore();
    const { account } = storeToRefs(accountStore);

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    async function save() : Promise<void>
    {
        // Save the account
        authMan.saveAccount(account.value);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Lifecycle
    //------------------------------------------------------------------------------------------------------------------

    onBeforeMount(() =>
    {
        if(account.value)
        {
            account.value.settings = {
                // Default settings
                colorMode: 'auto',
                systemFilter: 'beta',

                // Current settings
                ...account.value.settings || {},
            };
        }

        // Check to see if we have permissions to see disabled systems.
        if(authMan.hasPerm('Systems/viewDisabled'))
        {
            systemFilterOptions.unshift({ text: 'Disabled (Unusable)', value: 'disabled' });
        }
    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
