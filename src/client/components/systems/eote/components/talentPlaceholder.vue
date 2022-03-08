<!----------------------------------------------------------------------------------------------------------------------
  -- Talent Placeholder
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <b-card :id="id" class="eote-talent-placeholder" no-body>
        <template #header>
            <div class="text-muted text-nowrap text-center">
                Open Talent Slot
            </div>
        </template>
    </b-card>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .eote-talent-placeholder {
        border-style: dashed;

        .card-header {
            border-bottom: none;
            //cursor: pointer;
            padding: 0.25rem 0.5rem;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts">
    //------------------------------------------------------------------------------------------------------------------

    import Vue from 'vue';

    // Utils
    import { shortID } from '../../../../../common/utils/misc';

    //------------------------------------------------------------------------------------------------------------------

    export default Vue.extend({
        name: 'EotETalentPlaceholder',
        data()
        {
            return {
                uuid: shortID()
            };
        },
        computed: {
            id() { return `talent-${ this.uuid }`; }
        }

    });
</script>

<!--------------------------------------------------------------------------------------------------------------------->
