// vue augmentation
import Vue, { ComponentOptions } from 'vue';

import { ValidationRule } from './lib/validators';
import { Validation } from './vuelidate';

declare module 'vue/types/vue' {
    interface ValidationEvaluation {
        [ruleName : string] : boolean
    }

    type ValidationProperties<V> = {
        [P in Exclude<keyof V, '$v'>] ?: Validation & ValidationProperties<V[P]> & ValidationEvaluation
    }

    interface ValidationGroups {
        [groupName : string] : Validation & ValidationProperties<any>
    }

    interface Vue {
        $v : ValidationProperties<Vue> & ValidationGroups & Validation

        delayTouch(v : Validation) : void
    }
}

declare module 'vue/types/options' {
    interface ValidGroupDecl {
        [group : string] : string[]
    }

    type ValidationDecl = ValidationRule | ((...args : any[]) => ValidationRule)
    type GroupDecl = string[]
    type AsyncDecl = (...args : any[]) => boolean | Promise<boolean>

    interface RuleDecl {
        [rule : string] : ValidationDecl | GroupDecl | AsyncDecl | RuleDecl
    }

    type NestedDecl = RuleDecl
    type DynamicDecl = () => RuleDecl

    interface ValidPropertyDecl {
        [prop : string] : RuleDecl
    }

    interface ComponentOptions<V extends typeof Vue> {
        validations ?: RuleDecl | DynamicDecl | undefined
    }
}
