<template>
    <div id="dnd35-char">
        <div v-if="!char">
            <h4 class="text-center">
                Loading...
            </h4>
        </div>
        <div v-else>
            <div style="margin-left: 2px;">
                <small class="text-muted">
                    {{ char.fullSystem.name }}
                </small>
            </div>
            <header>
                <div class="name">
                    <h1>
                        {{ char.name }}
                        <button class="btn btn-success-outline btn-sm" style="pointer-events: none">
                            <span v-if="!char.saving">
                                <i class="fa fa-check" />
                                Saved!
                            </span>
                            <span v-else>
                                <i class="fa fa-spinner fa-spin" />
                                Saving...
                            </span>
                        </button>
                    </h1>
                </div>
                <div class="race">
                    <h4 class="text-muted">
                        {{ char.race.name }}
                    </h4>
                    <button class="close" title="Edit Race">
                        <i class="fa fa-edit" />
                    </button>
                </div>
                <div class="classes">
                    <h4 class="text-muted">
                        <span v-for="classObj in char.classes">
                            {{ classObj.class.name }} {{ classObj.level }}
                            <span v-if="$index != (char.classes.length - 1)">/</span>
                        </span>
                    </h4>
                    <button class="close" title="Edit Classes and Levels">
                        <i class="fa fa-edit" />
                    </button>
                </div>
            </header>

            <!-- Main Sheet -->

            <div id="sheet">
                <div class="upper-sheet">
                    <div class="section-group por-bio">
                        <div class="portrait">
                            <img
                                class="img-thumbnail"
                                :src="char.portrait || 'http://placehold.it/800x1200'"
                                height="445px"
                                width="300px"
                                style="max-width: inherit"
                            >
                        </div>
                        <div class="section-group bio-lang">
                            <!-- Biographical Information -->
                            <div class="bio card">
                                <div class="card-header">
                                    <i class="fa fa-list" />
                                    Details
                                </div>
                                <div class="card-block flex-form">
                                    <div class="form-group age">
                                        <input id="age" v-model="char.age" type="number" class="form-control" debounce="500" number>
                                        <label for="age">Age</label>
                                    </div>
                                    <div class="form-group height">
                                        <input id="height" v-model="char.height" type="text" class="form-control" debounce="500">
                                        <label for="height">Height</label>
                                    </div>
                                    <div class="form-group size">
                                        <p class="form-control-static">
                                            {{ char.size }}
                                        </p>
                                        <label>Size</label>
                                    </div>
                                    <div class="form-group gender">
                                        <select id="gender" v-model="char.gender" class="form-control">
                                            <option :value="undefined" :selected="!char.gender">
                                                Please select...
                                            </option>
                                            <option v-for="opt in char.genderOptions" :value="opt.value">
                                                {{ opt.display }}
                                            </option>
                                        </select>
                                        <label for="gender">Gender</label>
                                    </div>
                                    <div class="form-group alignment">
                                        <select id="alignment" v-model="char.alignment" class="form-control">
                                            <option :value="undefined" :selected="!char.alignment">
                                                Please select...
                                            </option>
                                            <option v-for="opt in char.alignmentOptions" :value="opt.value">
                                                {{ opt.display }}
                                            </option>
                                        </select>
                                        <label for="alignment">Alignment</label>
                                    </div>
                                    <div class="form-group speed">
                                        <input id="speed" v-model="char.speed" type="number" class="form-control" debounce="500" number>
                                        <label for="speed">Speed</label>
                                    </div>
                                    <div class="form-group experience">
                                        <input id="experience" v-model="char.experience" type="number" class="form-control" debounce="500" number>
                                        <label for="experience">Experience</label>
                                    </div>
                                    <div class="form-group wealth">
                                        <input id="wealth" v-model="char.wealth" type="number" class="form-control" debounce="500" number>
                                        <label for="wealth">Wealth</label>
                                    </div>
                                </div>
                            </div>

                            <!-- Languages -->
                            <div class="languages card">
                                <div class="card-header">
                                    <i class="fa fa-list" />
                                    Languages
                                </div>
                                <div class="card-block">
                                    ???
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="section-group">
                        <div class="conditions card">
                            <div class="card-header">
                                <i class="fa fa-list" />
                                Conditions
                            </div>
                            <div class="card-block">
                                ???
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-sheet">
                    <!-- Rolls -->
                    <Rolls :char="char" />

                    <!-- Skills -->
                    <Skills :char="char" />
                </div>
            </div>

            <!-- Notes -->
            <Notes id="notes" :notes="char.notes" :save="save" />
        </div>
    </div>
</template>

<style lang="scss">
    #dnd35-char {
        header {
            display: flex;
            flex-wrap: wrap;

            .name {
                flex: 1 1 auto;
            }

            .race {
                margin-right: 10px;
            }

            .race,
            .classes {
                flex: 0 0 auto;
                line-height: 3.5rem;

                h4 {
                    display: inline-block;
                }

                button.close {
                    margin-top: 1.25rem;
                    display: inline-block;
                    margin-left: 5px;
                    font-size: 1em;
                }

            }
        }

        #sheet {
            display: flex;
            margin-left: -2.5px;
            margin-right: -2.5px;

            .card {
                margin-right: 2.5px;
                margin-left: 2.5px;
                margin-bottom: 5px;

                .card-header {
                    .btn {
                        margin-top: -7px;
                    }
                }
            }

            .upper-sheet {
                display: flex;
                flex-wrap: wrap;
                flex: 1 1 auto;
                flex-direction: column;

                .section-group {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    flex: 1 1 auto;
                }

                .por-bio {
                    flex: 0 0 450px;
                }

                .bio-lang {
                    flex-direction: column;
                    flex: 1 1 300px;
                    flex-wrap: nowrap;
                }

                .portrait {
                    flex: 0 0 300px;
                    margin-left: 2.5px;
                    margin-right: 2.5px;
                    margin-bottom: 5px;
                    height: 445px;

                    img {
                        height: 445px;
                        width: 300px;
                    }
                }

                .bio {
                    flex: 1 1 300px;
                    min-width: 300px;

                    .age {
                        flex-basis: 60px;
                        min-width: 60px;
                    }

                    .height {
                        flex-basis: 60px;
                        min-width: 60px;
                    }

                    .size {
                        flex-basis: 80px;
                        min-width: 80px;
                    }

                    .gender {
                        flex-basis: 100px;
                        min-width: 100px;
                    }

                    .alignment {
                        flex-basis: 130px;
                        min-width: 130px;
                    }

                    .speed {
                        flex-basis: 50px;
                        min-width: 50px;
                    }

                    .experience {
                        flex-basis: 100px;
                        min-width: 100px;
                    }

                    .wealth {
                        flex-basis: 100px;
                        min-width: 100px;
                    }
                }

                .languages {
                    flex: 1 1 300px;
                }

                .conditions {
                    flex: 1 1 300px;
                }
            }

            .right-sheet {
                display: flex;
                flex-direction: column;

                flex: 0 0 400px;
                min-width: 400px;

            }
        }

        #notes {
            margin-top: 5px;
        }

        .flex-form {
            display: flex;
            flex-wrap: wrap;
            margin-left: -2.5px;
            margin-right: -2.5px;

            .form-group {
                margin-left: 2.5px;
                margin-right: 2.5px;
                flex: 1 1 auto;

                label {
                    display: block;
                    color: #777;
                    font-size: .85rem;
                    text-align: center;
                }
            }
        }
    }
</style>

<script type="text/babel">
    import DnD35Character from './model';
    import systemsSvc from '../../../client/components/systems/systemsService';
    import diceUtil from '../../../client/components/dice/diceService';

    // Components
    import rolls from './components/rolls.vue';
    import skills from './components/skills.vue';
    import notes from '../../../client/components/notes/notes.vue';

    export default {
        components: {
            rolls,
            skills,
            notes,
        },
        props: {
            base: { required: true },
        },
        data()
        {
            return {
                char: null,
            };
        },
        methods: {
            save()
            {
                console.log('save?');
                this.char.save();
            },
        },
        activate(done)
        {
            var char = new DnD35Character(this.base, {});
            char.loading.then(() =>
            {
                this.char = char;
                done();
            });
        },
    };
</script>
