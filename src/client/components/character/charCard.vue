<!----------------------------------------------------------------------------------------------------------------------
  -- charCard
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <BCard class="char-card" @click="openChar(character)">
        <div class="d-flex">
            <div class="thumbnail-column">
                <CharThumbnail :char="character" />
            </div>
            <div class="d-flex flex-column justify-content-center">
                <h5 class="mb-1">
                    {{ character.name }}
                </h5>
                <BBadge class="me-1">
                    {{ getSystem(character.system).name }}
                </BBadge>
                <div class="text-muted m-0">
                    <small>{{ character.campaign }}</small>
                </div>
            </div>
        </div>
    </BCard>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .char-card {
        cursor: pointer;

        .thumbnail-column {
            min-width: 64px;
            width: 64px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { useRouter } from 'vue-router';

    // Stores
    import { useSystemsStore } from '../../lib/stores/systems';

    // Models
    import { Character, SystemDefinition } from '../../../common/models';

    // Components
    import CharThumbnail from './charThumbnail.vue';

    //------------------------------------------------------------------------------------------------------------------
    // Refs
    //------------------------------------------------------------------------------------------------------------------
    const router = useRouter();
    const sysStore = useSystemsStore();

    //------------------------------------------------------------------------------------------------------------------
    // Props
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        character : Character;
        compact ?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        compact: false,
    });

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function getSystem<T extends Record<string, unknown>>(systemID : string) : SystemDefinition<T> | undefined
    {
        return sysStore.find(systemID);
    }

    function openChar(char : Character) : void
    {
        router.push(`/characters/${ char.id }`);
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
