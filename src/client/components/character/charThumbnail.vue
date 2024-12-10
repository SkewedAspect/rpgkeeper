<!----------------------------------------------------------------------------------------------------------------------
  -- Character Thumbnail
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="char-thumbnail">
        <BImg
            :src="char.thumbnail"
            width="64px"
            height="64px"
            rounded="circle"
            :blank="!char.thumbnail"
            :blank-color="char.color"
            thumbnail
            class="shadow-sm"
            :style="{ 'background-color': char.color }"
        />
        <div v-if="!char.thumbnail" class="char-text">
            {{ getInitials(char) }}
        </div>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .char-thumbnail {
        position: relative;
        display: inline-block;

        .char-text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: absolute;
            top: 0; bottom: 0; left: 0; right: 0;
            text-align: center;

            font-size: 2rem;
            color: black;
        }

        img {
            border: none !important;
            width: 64px;
            height: 64px;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script lang="ts" setup>
    import { Character } from '../../../common/models';

    //------------------------------------------------------------------------------------------------------------------
    // Component Definition
    //------------------------------------------------------------------------------------------------------------------

    interface Props
    {
        char : Character
    }

    const props = defineProps<Props>();

    //------------------------------------------------------------------------------------------------------------------
    // Methods
    //------------------------------------------------------------------------------------------------------------------

    function getInitials(char : Character) : string
    {
        if(char.name)
        {
            const nameParts = char.name.split(' ');
            const initials = nameParts[0][0] + (nameParts[1]?.[0] ?? '');

            return initials.toUpperCase();
        }
        else
        {
            return '-';
        }
    }
</script>

<!--------------------------------------------------------------------------------------------------------------------->
