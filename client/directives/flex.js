//----------------------------------------------------------------------------------------------------------------------
// FlexDirective - Usable as 'v-flex', this directive sets the `flex` property on an element. It supports several
// shortcuts:
//      * `min` - Make the element shrink to the minimum possible value (`flex: 0 0 0%`).
//      * `max` - Make the element grow to the maximum possible value (`flex: 1 1 100%`).
//      * `shrink` - Make the element shrink to it's contents (`flex: 0 0 auto`).
//      * `grow` - Make the element grow to fill any remaining space possible value (`flex: 1 1 auto`).
//
//----------------------------------------------------------------------------------------------------------------------

export default {
    inserted(el, binding)
    {
        let flexValue = binding.value || binding.expression;
        switch(flexValue)
        {
            case 'min':
                flexValue = '0 0 0%';
                break;

            case 'max':
                flexValue = '1 1 100%';
                break;

            case 'shrink':
                flexValue = '0 0 auto';
                break;

            case 'grow':
                flexValue = '1 1 auto';
                break;

            default:
                flexValue = binding.value;
                break;
        } // end switch

        el.style.flex = flexValue;
    } // end inserted
}; // end FlexDirective

//----------------------------------------------------------------------------------------------------------------------