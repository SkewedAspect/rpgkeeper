//----------------------------------------------------------------------------------------------------------------------
// SystemCharacterModel
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import _ from 'lodash';
import BaseModel from './base';

//----------------------------------------------------------------------------------------------------------------------

class SystemCharacterModel extends BaseModel
{
    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get url(){ return `/systems/${ this._systemID }/character/${ _.get(this.$state, 'id', '') }`; }

} // end SystemCharacterModel

//----------------------------------------------------------------------------------------------------------------------

export default SystemCharacterModel;

//----------------------------------------------------------------------------------------------------------------------