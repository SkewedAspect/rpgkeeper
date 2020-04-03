<!----------------------------------------------------------------------------------------------------------------------
  -- EditWeaponsModal
  --------------------------------------------------------------------------------------------------------------------->

<template>
    <div v-if="character" class="edit-weapons-modal">
        <b-modal
            id="weapModal"
            ref="modal"
            header-bg-variant="dark"
            header-text-variant="white"
            no-close-on-esc
            no-close-on-backdrop
            body-class="position-static"
            size="lg"
            @ok="onSave"
            @shown="onShown"
        >
            <!-- Modal Header -->
            <template slot="modal-title">
                <span v-if="isAdd">
                    <fa icon="plus"></fa>
                    Add
                </span>
                <span v-else>
                    <fa icon="file-edit"></fa>
                    Edit
                </span>
                Weapons
            </template>

            <!-- Modal Content -->
            <b-form-row>
                <b-form-group
                    class="flex-fill pr-1 w-50"
                    label="Name"
                    label-class="font-weight-bold"
                    label-for="name-input"
                >
                    <b-form-input id="name-input" v-model="editWeapon.name" type="text"></b-form-input>
                </b-form-group>
                <b-form-group
                    class="flex-fill pl-1 pr-1 w-25"
                    label="Skill"
                    label-class="font-weight-bold"
                    label-for="skill-input"
                >
                    <b-form-select id="skill-input" v-model="editWeapon.skill" :options="skillNames"></b-form-select>
                </b-form-group>
                <b-form-group
                    class="flex-fill pl-1 w-25"
                    label="Range"
                    label-class="font-weight-bold"
                    label-for="range-input"
                >
                    <b-form-select id="range-input" v-model="editWeapon.range" :options="rangeOptions"></b-form-select>
                </b-form-group>
            </b-form-row>

            <b-form-row>
                <b-form-group
                    class="flex-fill pr-1 w-25"
                    label="Damage"
                    label-class="font-weight-bold"
                    label-for="skill-damage"
                >
                    <b-form-input id="skill-damage" v-model.number="editWeapon.damage" type="number" min="0" step="0"></b-form-input>
                </b-form-group>
                <b-form-group
                    class="flex-fill pl-1 pr-1 w-25"
                    label="Critical"
                    label-class="font-weight-bold"
                    label-for="skill-critical"
                >
                    <b-form-input id="skill-critical" v-model.number="editWeapon.criticalRating" type="number" min="0" step="0"></b-form-input>
                </b-form-group>
                <b-form-group
                    class="flex-fill pl-1 pr-1 w-25"
                    label="Encumb."
                    label-class="font-weight-bold"
                    label-for="skill-encumbrance"
                >
                    <b-form-input id="skill-encumbrance" v-model.number="editWeapon.encumbrance" type="number" min="0" step="0"></b-form-input>
                </b-form-group>
                <b-form-group
                    class="flex-fill pl-1 w-25"
                    label="Rarity"
                    label-class="font-weight-bold"
                    label-for="skill-rarity"
                >
                    <b-form-input id="skill-rarity" v-model.number="editWeapon.rarity" type="number" min="0" step="0"></b-form-input>
                </b-form-group>
            </b-form-row>

            <b-form-row>
                <b-form-group
                    class="flex-fill pl-1 w-25"
                    label="Qualities"
                    label-class="font-weight-bold"
                >
                    <b-form-tags v-model="selectedQualities" no-outer-focus class="mb-2">
                        <!-- List of Qualities -->
                        <template v-slot="{ tags, disabled, addTag }">
                            <b-dropdown size="sm" block menu-class="w-100 mt-2">
                                <template v-slot:button-content>
                                    Choose Qualities
                                </template>
                                <b-dropdown-form @submit.stop.prevent="() => {}">
                                    <b-form-group
                                        label-for="tag-search-input"
                                        class="mb-0"
                                        label-size="sm"
                                        :description="searchDesc"
                                        :disabled="disabled"
                                    >
                                        <b-input-group>
                                            <template v-slot:prepend>
                                                <b-input-group-text>
                                                    <fa icon="search"></fa>
                                                </b-input-group-text>
                                            </template>
                                            <b-form-input
                                                id="tag-search-input"
                                                v-model="search"
                                                type="search"
                                                size="sm"
                                                placeholder="Search..."
                                                autocomplete="off"
                                            ></b-form-input>
                                        </b-input-group>
                                    </b-form-group>
                                </b-dropdown-form>
                                <b-dropdown-divider></b-dropdown-divider>
                                <b-dropdown-item-button
                                    v-for="option in availableOptions"
                                    :key="option"
                                    @click="onOptionClick({ option, addTag })"
                                >
                                    {{ option }}
                                </b-dropdown-item-button>
                                <b-dropdown-text v-if="availableOptions.length === 0">
                                    There are no tags available to select
                                </b-dropdown-text>
                            </b-dropdown>

                            <!-- Selected Qualities -->
                            <b-form-row v-if="editWeapon.qualities.length > 0" class="mt-2 mb-0">
                                <b-col v-for="qual in editWeapon.qualities" :key="qual.name" class="mt-1 mb-1" cols="4">
                                    <b-input-group>
                                        <b-input-group-prepend class="flex-fill">
                                            <b-input-group-text class="flex-fill">
                                                {{ qual.name }}
                                            </b-input-group-text>
                                        </b-input-group-prepend>
                                        <b-form-input
                                            v-model.number="qual.rank"
                                            type="number"
                                            step="1"
                                            min="1"
                                            style="max-width: 80px"
                                            :placeholder="isRanked(qual.name) ? 'Rank' : 'N/A'"
                                            :disabled="!isRanked(qual.name)"
                                        ></b-form-input>
                                        <b-input-group-append>
                                            <b-btn variant="danger" @click="removeQual(qual.name)">
                                                <fa icon="trash-alt"></fa>
                                            </b-btn>
                                        </b-input-group-append>
                                    </b-input-group>
                                </b-col>
                            </b-form-row>

                            <div v-else class="text-center mt-2">
                                <h5>Please select a quality from the dropdown above.</h5>
                            </div>
                        </template>
                    </b-form-tags>
                </b-form-group>
            </b-form-row>

            <!-- Modal Buttons -->
            <template slot="modal-ok">
                <fa icon="save"></fa>
                Save
            </template>
            <template slot="modal-cancel">
                <fa icon="times"></fa>
                Cancel
            </template>
        </b-modal>
    </div>
</template>

<!--------------------------------------------------------------------------------------------------------------------->

<style lang="scss">
    #weapModal {
        .modal-content {
            overflow: initial !important;
        }
    }
</style>

<!--------------------------------------------------------------------------------------------------------------------->

<script>
    //------------------------------------------------------------------------------------------------------------------

    import _ from 'lodash';

    // Managers
    import charMan from '../../../api/managers/character';
    import eoteMan from '../../../api/managers/eote';

    //------------------------------------------------------------------------------------------------------------------

    export default {
        name: 'AddEditWeaponsModal',
        subscriptions: {
            character: charMan.selected$,
            mode: eoteMan.mode$,
            qualities: eoteMan.qualities$
        },
        data()
        {
            return {
                search: '',

                weapon: undefined,
                editWeapon: {
                    weaponID: undefined,
                    name: undefined,
                    skill: undefined,
                    damage: 0,
                    criticalRating: 0,
                    range: 'm',
                    encumbrance: 0,
                    rarity: 0,
                    qualities: []
                }
            };
        },
        computed: {
            criteria()
            {
                // Compute the search criteria
                return this.search.trim().toLowerCase();
            },
            qualityNames() { return this.qualities.map((qual) => qual.name).sort(); },
            selectedQualities: {
                get()
                {
                    return this.editWeapon.qualities.map((qual) => qual.name).sort();
                },
                set(qualities)
                {
                    qualities.concat().forEach((name) =>
                    {
                        const quality = _.find(this.qualities, { name });

                        // Only add if we can find the quality, and if we haven't added it already.
                        if(quality)
                        {
                            this.editWeapon.qualities.push({ name, rank: quality.ranked ? 1 : undefined });
                        } // end if

                        this.editWeapon.qualities = _.uniqBy(this.editWeapon.qualities, (qual) => qual.name);
                    });
                }
            },
            availableOptions()
            {
                const criteria = this.criteria;

                // Filter out already selected options
                const options = this.qualityNames.filter((opt) => this.selectedQualities.indexOf(opt) === -1);
                if(criteria)
                {
                    // Show only options that match criteria
                    return options.filter((opt) => opt.toLowerCase().indexOf(criteria) > -1);
                }

                // Show all options available
                return options;
            },
            searchDesc()
            {
                if(this.criteria && this.availableOptions.length === 0)
                {
                    return 'There are no tags matching your search criteria';
                }

                return '';
            },

            isAdd() { return !this.weapon; },
            skillNames() { return this.character.details.skills.map((skill) => skill.name).sort(); },
            rangeOptions()
            {
                return Object.keys(eoteMan.rangeEnum).map((rng) =>
                {
                    return {
                        text: eoteMan.rangeEnum[rng],
                        value: rng
                    };
                });
            }
        },
        methods: {
            isRanked(name)
            {
                const qual = _.find(this.qualities, { name });
                return qual && qual.ranked;
            },
            getQual(name)
            {
                return _.find(this.editWeapon.qualities, { name });
            },

            onOptionClick({ option, addTag })
            {
                addTag(option);
                this.search = '';
            },

            async onSave()
            {
                const index = this.character.details.weapons.indexOf(this.weapon);
                if(index !== -1)
                {
                    this.character.details.weapons.splice(index, 1, this.editWeapon);
                }
                else
                {
                    this.character.details.weapons.push(this.editWeapon);
                } // end if

                // Save the character
                await charMan.save(this.character);

                // Cleanup the modal
                this.weapon = undefined;
            },
            onShown()
            {
                // Reset the edit fields
                if(this.weapon)
                {
                    this.$set(this, 'editWeapon', _.cloneDeep(this.weapon));
                }
                else
                {
                    this.weapon = undefined;
                    this.$set(this, 'editWeapon', {
                        weaponID: undefined,
                        name: undefined,
                        skill: undefined,
                        damage: 0,
                        criticalRating: 0,
                        range: 'm',
                        encumbrance: 0,
                        rarity: 0,
                        qualities: []
                    });
                } // end if
            },

            removeQual(name)
            {
                this.editWeapon.qualities = _.filter(this.editWeapon.qualities, (qual) => qual.name !== name);
            }, // end removeQual

            show(weapon)
            {
                this.weapon = weapon;
                this.$refs.modal.show();
            },
            hide()
            {
                this.$refs.modal.hide();
            }
        }
    };
</script>

<!--------------------------------------------------------------------------------------------------------------------->
