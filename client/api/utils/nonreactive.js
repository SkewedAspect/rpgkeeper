//----------------------------------------------------------------------------------------------------------------------
// NonReactiveUtil
//----------------------------------------------------------------------------------------------------------------------

/**
 * Mark an existing property non-configurable. (Vue ignores these entirely.)
 *
 * @param {object} object - The object on which we are defining the property.
 * @param {string} propName - The name of the property
 */
export function markNonConfigurable(object, propName)
{
    const propertyDesc = Object.getOwnPropertyDescriptor(object, propName);

    if(propertyDesc && propertyDesc.configurable)
    {
        propertyDesc.configurable = false;
        Object.defineProperty(object, propName, propertyDesc);
    } // end if
} // end markNonConfigurable

//----------------------------------------------------------------------------------------------------------------------

/**
 * @module nonreactive
 *
 * Allows you to mark an object as 'non-reactive', i.e. Vue will ignore it and not build properties for it.
 * This utility class has a few tricks it pulls off to trick Vue into ignoring this.
 *
 */
export default {
    markNonConfigurable
};

//----------------------------------------------------------------------------------------------------------------------
