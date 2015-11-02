<template>
    <div id="dashboard" class="container">
        <!-- If the user isn't authenticated, we don't let them see anything. -->
        <div v-if="!isAuthenticated" class="text-center">
            <h4>You are not currently signed in.</h4>
            <p>Please sign in using the orange <i class="fa fa-envelope-o text-primary"></i> button in the upper right.</p>
        </div>

        <!-- If they are, we show them a list of their characters -->
        <div v-else>
            <div id="characters" class="card">
                <div class="card-header clearfix">
                    <div class="row">
                        <div class="col-xs-4 col-md-6">
                            <h3 class="card-title" style="line-height: 1.4em;">
                                <i class="fa fa-user"></i> Characters
                            </h3>
                        </div>
                        <div class="col-xs-8 col-md-6">
                            <div class="input-group">
                                <span class="input-group-addon" id="search-characters"><i class="fa fa-search"></i></span>
                                <input type="text" class="form-control" placeholder="Search Characters" aria-describedby="search-characters" v-model="searchFilter">
                            <span class="input-group-btn">
                                <button class="btn btn-primary" @click="addChar()">
                                    <i class="fa fa-user-plus"></i> Add
                                </button>
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="characters.length == 0" class="card-block">
                    <h4 class="text-center">No Characters, yet.</h4>
                </div>
                <div v-else class="list-group">
                    <a v-link="{ path: char.url }" class="list-group-item" v-for="char in characters | filterBy searchFilter | orderBy 'system' | orderBy 'name'">
                        <div class="btn-toolbar pull-right">
                            <button class="btn btn-primary" @click.prevent.stop="editChar(char)"><i class="fa fa-edit"></i> Edit</button>
                            <button class="btn btn-danger" @click.prevent.stop="confirmDelete(char)"><i class="fa fa-trash-o"></i> Delete</button>
                        </div>
                        <img class="img-thumbnail hidden-xs" :src="char.thumbnail || 'http://placehold.it/200'">
                        <h4 class="list-group-item-heading">{{ char.name }} <small>({{ char.fullSystem.name }})</small></h4>
                        <p class="list-group-item-text"><i>{{ char.description }}</i>&nbsp;</p>
                    </a>
                </div>
            </div>
        </div>

        <!-- Delete Modal -->
        <modal id="delModal" v-ref:del-modal>
            <div class="modal-header" slot="header">
                <h4 class="modal-title">
                    <i class="fa fa-trash-o"></i>
                    Delete Character
                </h4>
            </div>
            <div class="modal-body text-center" slot="body">
                <h3><i class="fa fa-exclamation-triangle"></i> Are you sure you want to delete your character?</h3>
                <p class="text-danger"><b>This cannot be undone!</b></p>
            </div>
            <div class="modal-footer" slot="footer">
                <button type="button"
                        class="btn btn-danger"
                        @click="deleteChar()">
                    <i class="fa fa-trash-o"></i>
                    Delete Character
                </button>
                <button type="button"
                        class="btn btn-secondary"
                        @click="close('delModal')">
                    <i class="fa fa-times"></i>
                    Cancel
                </button>
            </div>
        </modal>

        <!-- Add/Edit Modal -->
        <modal id="addEditModal" v-ref:add-edit-modal :backdrop="'static'" :keyboard="false">
            <div class="modal-header" slot="header">
                <h4 v-if="editing" class="modal-title">
                    <i class="fa fa-edit"></i>
                    Edit Character
                </h4>
                <h4 v-else class="modal-title">
                    <i class="fa fa-user-plus"></i>
                    Add Character
                </h4>
            </div>
            <div class="modal-body" slot="body">
                <form>
                    <fieldset class="form-group">
                        <label for="name">Name</label>
                        <input id="name" type="text" class="form-control" placeholder="Ex: 'Aerissa, The Lionhearted'" v-model="newChar.name">
                        <div class="text-right">
                            <small class="text-muted">
                                Having trouble coming up with a name? Try <a href="http://www.seventhsanctum.com/index-name.php">these</a>
                                name generators for inspiration.
                            </small>
                        </div>
                    </fieldset>
                    <fieldset class="form-group">
                        <label for="system">System</label>
                        <select id="system" class="form-control" v-model="newChar.system">
                            <option value="">Select a system</option>
                            <option v-for="system in systems" :value="system.id">{{ system.name }}</option>
                        </select>
                        <div class="text-right">
                            <small class="text-muted">
                                If your RPG system isn't listed, try the Generic system. If, instead, you'd like something more
                                tailored, feel free to <a href="https://github.com/Morgul/rpgkeeper/issues/new">request</a> a new system.
                            </small>
                        </div>
                    </fieldset>
                    <fieldset class="form-group">
                        <label for="description">Description</label>
                        <input id="description" type="text" class="form-control" placeholder="Ex: 'Level 12 Fighter, Knife's Edge campaign'" v-model="newChar.description">
                        <div class="text-right">
                            <small class="text-muted">
                                This is a small, one line description of your character. It's mainly used to differentiate
                                characters on the character list. Remember, this field is searchable!
                            </small>
                        </div>
                    </fieldset>
                    <fieldset class="form-group">
                        <label for="thumbnail">Thumbnail</label>
                        <div class="media" style="margin-top: 0;">
                            <div class="media-left">
                                <img class="media-object img-thumbnail" :src="newChar.thumbnail || 'http://placehold.it/200'" height="100px" width="100px" style="max-width: inherit">
                            </div>
                            <div class="media-body" style="vertical-align: bottom">
                                <p class="text-muted" style="line-height: 1rem; margin-bottom: .5rem;">
                                    <small>
                                        The thumbnail image is used whenever we display your character in lists on the site. It is also
                                        part of the publicly viewable information about your character, and can be used as an avatar for
                                        your character on thirdparty sites.
                                    </small>
                                </p>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="thumbnail" placeholder="Thumbnail URL" v-model="newChar.thumbnail">
                                    <div class="input-group-btn">
                                        <button class="btn btn-secondary" @click.prevent.stop="selectImage('thumbnail')">
                                            <i class="fa fa-dropbox"></i> Add from Dropbox
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <small class="text-muted">
                                The thumbnail should be a square image sized at at least <code>200x200px</code>. If omitted, the
                                portrait image will be used instead.
                            </small>
                        </div>
                    </fieldset>
                    <fieldset class="form-group">
                        <label for="portrait">Portrait</label>
                        <div class="media" style="margin-top: 0;">
                            <div class="media-left">
                                <img class="media-object img-thumbnail" :src="newChar.portrait || 'http://placehold.it/800x1200'" height="445px" width="300px" style="max-width: inherit">
                            </div>
                            <div class="media-body" style="vertical-align: bottom">
                                <p class="text-muted" style="line-height: 1rem; margin-bottom: .5rem;">
                                    <small>
                                        The portrait is a nice, large cover image for your character. While we know not everyone has
                                        access to artists, there is tons of websites online where you can find stock images and fantasy
                                        artwork. If you're still unable to find something suitable, consider checking out
                                        <a href="">Deviant Art</a>, and commissioning an artist.
                                    </small>
                                </p>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="portrait" placeholder="Portrait URL" v-model="newChar.portrait">
                                    <div class="input-group-btn">
                                        <button class="btn btn-secondary" @click.prevent.stop="selectImage('portrait')">
                                            <i class="fa fa-dropbox"></i> Add from Dropbox
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <small class="text-muted">
                                The portrait should be an image at least <code>400px</code> wide. We recommend images with
                                dimensions of <code>800x1200px</code>.
                            </small>
                        </div>
                    </fieldset>
                    <fieldset class="form-group">
                        <label for="bio">Biography</label>
                        <textarea id="bio" rows="5" class="form-control" placeholder="It was a dark and stormy night..." v-model="newChar.biography"></textarea>
                        <div class="text-right">
                            <small class="text-muted">
                                This is just a nice place to put any sort of descriptive text about your character you want.
                            </small>
                        </div>
                    </fieldset>
                </form>
            </div>
            <div class="modal-footer" slot="footer">
                <button type="button"
                        class="btn btn-primary"
                        @click="saveChar()">
                    <i class="fa fa-save"></i>
                    Save changes
                </button>
                <button type="button"
                        class="btn btn-secondary"
                        @click="close('addEditModal')">
                    <i class="fa fa-times"></i>
                    Cancel
                </button>
            </div>
        </modal>
    </div>
</template>

<style lang="scss" src="./dashboard.scss"></style>

<script type="text/babel">
    import _ from 'lodash';
    import { modal } from 'vueboot';

    import Character from '../../components/character/characterModel';

    import stateSvc from '../../components/state/stateService';
    import routeSvc from '../../components/route/routeService';
    import charSvc from '../../components/character/characterService.js';
    import systemsSvc from '../../components/systems/systemsService';
    import dropboxSvc from '../../components/dropbox/dropboxService';

    export default {
        components: {
            modal: modal
        },
        data: function()
        {
            return {
                editing: false,
                delChar: null,
                newChar: { system: "" },
                searchFilter: "",
                systems: [],
                characters: [],
                state: stateSvc.state
            };
        },
        computed: {
            user: function(){ return this.state.user; },
            isAuthenticated: function()
            {
                return !!this.user;
            }
        },
        methods: {
            refreshCharList: function()
            {
                if(this.user)
                {
                    charSvc.listByEmail(this.user.email)
                        .then((characters) =>
                        {
                            this.characters = characters;
                        });
                } // end if
            },
            selectImage: function(key)
            {
                dropboxSvc.chooseDropboxImage()
                    .then((url) =>
                    {
                        this.newChar[key] = url;
                    });
            },
            open: function(modalRef)
            {
                this.$refs[modalRef].showModal();
            },
            close: function(modalRef)
            {
                this.$refs[modalRef].hideModal();
            },
            addChar: function(char)
            {
                this.editing = false;
                this.newChar = { system: "" };
                this.open('addEditModal');
            },
            editChar: function(char)
            {
                this.editing = true;

                // A little frustrating, but we need to do this so vue can bind the properties correctly.
                this.newChar = _.assign({
                        name: "",
                        system: "",
                        description: "",
                        portrait: "",
                        thumbnail: "",
                        biography: ""
                    }, char._state);

                this.open('addEditModal');
            },
            confirmDelete: function(char)
            {
                this.delChar = char;
                this.open('delModal');
            },
            deleteChar: function()
            {
                this.close('delModal');
                this.delChar.delete()
                    .then(() =>
                    {
                        // While I _could_ just remove the character... why not refresh?
                        this.refreshCharList();
                    });
            },
            saveChar: function()
            {
                var char;
                var isNew = !this.editing;

                this.close('addEditModal');

                if(this.editing)
                {
                    char = _.find(this.characters, { id: this.newChar.id });
                    _.assign(char, this.newChar);
                }
                else
                {
                    char = new Character(this.newChar);
                } // end if

                // Save the character
                char.save()
                    .then((char) =>
                    {
                        if(isNew)
                        {
                            routeSvc.go(char.url);
                        }
                        else
                        {
                            this.refreshCharList();
                        } // end if

                        //TODO: Need something like ng-toast
                        console.log('saved!');
                    });
            }
        },
        watch: {
            user: function(){ this.refreshCharList() }
        },
        ready: function()
        {
            // Look, I'd rather just bind the data. But that didn't work. Got more important things to worry about, atm.
            systemsSvc.loading
                .then(() =>
                {
                    this.systems = systemsSvc.systems;
                });

            this.refreshCharList();
        }
    }
</script>