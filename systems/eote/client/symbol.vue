<!----------------------------------------------------------------------------------------------------------------------
  -- symbol
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div class="eote-system-symbol d-inline-block" :class="symbolClass">
        {{ symbol }}
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss" scoped>
    .eote-system-symbol {
        &.dice {
            -webkit-text-stroke: 1px black;
            text-stroke: 1px black;

            &.boost {
                color: #95caeb;
            }

            &.setback {
                color: black;
            }

            &.ability {
                color: #5fb576;
            }

            &.difficulty {
                color: #706497;
            }

            &.proficiency {
                color: #ece44d;
            }

            &.challenge {
                color: #bb312e;
            }
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    // Managers
    import charMan from '../../../client/api/managers/character';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'EotESymbol',
        props: {
            icon: {
                type: String,
                required: true,
                validator(value)
                {
                    const validSymbols = [
                        'success',
                        'advantage',
                        'triumph',
                        'failure',
                        'threat',
                        'despair',
                        'boost',
                        'setback',
                        'ability',
                        'difficulty',
                        'proficiency',
                        'challenge',
                        'lightside',
                        'darkside'
                    ];

                    // The value must match one of these strings
                    return validSymbols.indexOf(value.toLowerCase()) !== -1;
                }
            }
        },
        subscriptions: {
            character: charMan.selected$
        },
        computed: {
            isEotE()
            {
                return this.system === 'eote';
            },
            isDiceSymbol()
            {
                const symbols = [
                    'success',
                    'advantage',
                    'triumph',
                    'failure',
                    'threat',
                    'despair'
                ];

                return !symbols.includes(this.icon.toLowerCase());
            },
            system()
            {
                return this.isDiceSymbol ? 'eote' : this.character.system;
            },
            symbol()
            {
                switch (this.icon.toLowerCase())
                {
                    case 'success':
                        return 's';

                    case 'advantage':
                        return 'a';

                    case 'triumph':
                        return this.isEotE ? 'x' : 't';

                    case 'failure':
                        return 'f';

                    case 'threat':
                        return this.isEotE ? 't' : 'h';

                    case 'despair':
                        return this.isEotE ? 'y' : 'd';

                    case 'boost':
                    case 'setback':
                        return 'b';

                    case 'ability':
                    case 'difficulty':
                        return 'd';

                    case 'proficiency':
                    case 'challenge':
                        return 'c';

                    case 'lightside':
                        return 'Z';

                    case 'darkside':
                        return 'z';
                } // end switch

                return undefined;
            },
            symbolClass()
            {
                // If we're a dice symbol we've gotta include more classes so we can color ourselves correctly.
                return `${ this.system }-symbol ${ this.isDiceSymbol ? `dice ${ this.icon.toLowerCase() }` : '' }`;
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
