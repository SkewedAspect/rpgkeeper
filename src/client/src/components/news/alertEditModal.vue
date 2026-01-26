<!----------------------------------------------------------------------------------------------------------------------
  -- Alert Edit Modal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BModal
        v-model="visible"
        :title="isEdit ? 'Edit Alert' : 'New Alert'"
        header-bg-variant="dark"
        header-text-variant="white"
        size="lg"
        no-close-on-esc
        no-close-on-backdrop
        @ok="onSave"
        @hidden="onHidden"
    >
        <BFormGroup label="Message" label-class="fw-bold" label-for="message-input">
            <BFormInput
                id="message-input"
                v-model="message"
                autocomplete="off"
                placeholder="Alert message to display..."
            />
        </BFormGroup>

        <BFormRow class="mt-3">
            <BCol cols="6">
                <BFormGroup label="Level" label-class="fw-bold" label-for="level-select">
                    <BFormSelect id="level-select" v-model="level" :options="levelOptions" />
                </BFormGroup>
            </BCol>
            <BCol cols="6">
                <BFormGroup label="Status" label-class="fw-bold" label-for="active-check">
                    <BFormCheckbox id="active-check" v-model="active" switch>
                        {{ active ? 'Active' : 'Inactive' }}
                    </BFormCheckbox>
                </BFormGroup>
            </BCol>
        </BFormRow>

        <BFormGroup class="mt-3" label="Link (Optional)" label-class="fw-bold" label-for="link-input">
            <BFormInput
                id="link-input"
                v-model="link"
                type="url"
                autocomplete="off"
                placeholder="https://..."
            />
            <BFormText>
                Optional "Learn more" link displayed with the alert.
            </BFormText>
        </BFormGroup>

        <BFormGroup class="mt-3" label="Expires At (Optional)" label-class="fw-bold" label-for="expires-input">
            <BFormInput
                id="expires-input"
                v-model="expiresAtStr"
                type="datetime-local"
            />
            <BFormText>
                Leave empty for no expiration.
            </BFormText>
        </BFormGroup>

        <template #footer="{ ok, cancel }">
            <BButton variant="secondary" @click="cancel">
                <Fa icon="times" />
                Cancel
            </BButton>
            <BButton variant="primary" :disabled="!isValid" @click="ok">
                <Fa icon="save" />
                Save
            </BButton>
        </template>
    </BModal>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { computed, ref, watch } from 'vue';

    // Models
    import type { Alert, AlertLevel } from '@rpgk/core';

    // Stores
    import { useNewsStore } from '../../lib/resource-access/stores/news.ts';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        show : boolean;
        alert ?: Alert | null;
    }

    const props = withDefaults(defineProps<Props>(), {
        alert: null,
    });

    const emit = defineEmits<{
        'update:show' : [value: boolean];
        'saved' : [];
    }>();

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------

    const newsStore = useNewsStore();

    const message = ref('');
    const level = ref<AlertLevel>('info');
    const link = ref('');
    const active = ref(true);
    const expiresAtStr = ref('');

    const levelOptions = [
        { value: 'info', text: 'Info (Blue)' },
        { value: 'warning', text: 'Warning (Yellow)' },
        { value: 'danger', text: 'Danger (Red)' },
    ];

    //------------------------------------------------------------------------------------------------------------------
    // Computed
    //------------------------------------------------------------------------------------------------------------------

    const visible = computed({
        get: () => props.show,
        set: (value) => emit('update:show', value),
    });

    const isEdit = computed(() => props.alert !== null);
    const isValid = computed(() => message.value.trim() !== '');

    const expiresAt = computed(() =>
    {
        if(!expiresAtStr.value)
        {
            return null;
        }
        return Math.floor(new Date(expiresAtStr.value).getTime() / 1000);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Watches
    //------------------------------------------------------------------------------------------------------------------

    watch(() => props.show, (newVal) =>
    {
        if(newVal)
        {
            if(props.alert)
            {
                // Editing existing alert
                message.value = props.alert.message;
                level.value = props.alert.level;
                link.value = props.alert.link ?? '';
                active.value = props.alert.active;

                if(props.alert.expiresAt)
                {
                    const date = new Date(props.alert.expiresAt * 1000);
                    expiresAtStr.value = date.toISOString().slice(0, 16);
                }
                else
                {
                    expiresAtStr.value = '';
                }
            }
            else
            {
                // New alert
                message.value = '';
                level.value = 'info';
                link.value = '';
                active.value = true;
                expiresAtStr.value = '';
            }
        }
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    async function onSave() : Promise<void>
    {
        const alertData = {
            message: message.value,
            level: level.value,
            link: link.value || null,
            active: active.value,
            expiresAt: expiresAt.value,
        };

        if(isEdit.value && props.alert)
        {
            await newsStore.updateAlert(props.alert.id, alertData);
        }
        else
        {
            await newsStore.createAlert(alertData);
        }

        emit('saved');
    }

    function onHidden() : void
    {
        // Reset form
        message.value = '';
        level.value = 'info';
        link.value = '';
        active.value = true;
        expiresAtStr.value = '';
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
