<!----------------------------------------------------------------------------------------------------------------------
  -- Settings
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="settings-page container text-center">

        <!-- Loading -->
        <md-progress v-if="status === 'unknown'" class="md-accent" md-indeterminate></md-progress>

        <!-- Once loaded -->
        <div class="centered" v-else-if="status === 'signed in'">
            <md-avatar class="md-xlarge">
                <img :src="account.avatarUrl" :alt="account.name">
            </md-avatar>
            <h4 class="text-center">{{ account.email }}</h4>

            <md-layout class="name-edit">
                <md-layout>
                    <md-input-container>
                        <label>Display Name</label>
                        <md-input placeholder="Display Name" v-model="account.name"></md-input>
                    </md-input-container>
                </md-layout>
                <md-layout v-flex="'shrink'">
                    <div>
                        <md-button class="refresh-btn md-raised md-primary" @click.native="save()">Save</md-button>
                    </div>
                </md-layout>
            </md-layout>
            <md-card id="settings" style="flex: 1">
                <md-toolbar class="md-dense">
                    <h2 class="md-title">Settings</h2>
                </md-toolbar>
                <md-card-content style="flex: 1; padding-bottom: 0">
                    <h3 class="text-center text-muted" style="margin-top: 0">Settings are not implemented.</h3>
                </md-card-content>
            </md-card>
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .settings-page {
        padding: 16px;

        .name-edit {
            margin: 0 auto;
            width: 400px;
            max-width: 100%;
        }

        .centered {
            margin: 0 auto;

            .md-avatar.md-xlarge {
                width: 128px;
                min-width: 128px;
                height: 128px;
                min-height: 128px;
                border-radius: 128px;
            }

            .md-avatar.md-xlarge img, .md-avatar.md-xlarge .md-avatar-text {
                width: 128px;
                height: 128px;
                text-align: center;
                line-height: 128px;
                font-size: 64px;
            }
        }

        .text-muted {
            color: #999;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    // Managers
    import authMan from '../api/managers/auth';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'SettingsPage',
        subscriptions: {
            account: authMan.account$,
            status: authMan.status$
        },
        methods: {
            save()
            {
                authMan.saveAccount(this.account);
            }
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
