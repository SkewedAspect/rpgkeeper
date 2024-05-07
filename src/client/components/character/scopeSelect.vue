<!----------------------------------------------------------------------------------------------------------------------
  -- scopeSelect
  --------------------------------------------------------------------------------------------------------------------->
<template>
    <b-form-group
        class="supp-scope-select"
        label="Scope"
        label-class="fw-bold"
        label-for="name-input"
    >
        <div class="d-flex">
            <BFormSelect v-model="scope" :options="options" :disabled="!canMakePublic"></BFormSelect>
            <BFormCheckbox v-model="official" class="ms-2 mt-2" switch>
                Official
            </BFormCheckbox>
        </div>
    </b-form-group>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, onMounted, ref } from 'vue';
    import { storeToRefs } from 'pinia';

    // Manager
    import authMan from '../../lib/managers/auth';

    // Stores
    import { useCharactersStore } from '../../lib/stores/characters';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        scope : 'public' | 'user';
        official : boolean;
    }

    const props = defineProps<Props>();

    interface Events
    {
        (e : 'update:scope', value : 'public' | 'user') : void;
        (e : 'update:official', value : boolean) : void;
    }

    const emit = defineEmits<Events>();

    //------------------------------------------------------------------------------------------------------------------
    // Ref
    //------------------------------------------------------------------------------------------------------------------

    const options = ref([
        { text: 'User', value: 'user' },
        { text: 'Public', value: 'public' }
    ]);

    const { system } = storeToRefs(useCharactersStore());

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const scope = computed({
        get() { return props.scope; },
        set(val : 'public' | 'user') { emit('update:scope', val); }
    });

    const official = computed({
        get() { return props.official; },
        set(val : boolean) { emit('update:official', val); }
    });

    const canMakePublic = computed(() =>
    {
        return authMan.hasPerm(`${ system }/canModifyContent`);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    onMounted(() =>
    {
        // Force us to be set to user if we don't have permissions to set a public scope.
        if(!canMakePublic.value)
        {
            scope.value = 'user';
        }
    });

</script>

<!--------------------------------------------------------------------------------------------------------------------->
