# What even is this?

This fold works around the fact that, for whatever reason, `vue-rx` won't play nicely with `vue-color` or `vuelidate`'s 
types packages.

All this does, is make sure these packages can get their types in _before_ `vue-rx`, and then everything seems to work.
