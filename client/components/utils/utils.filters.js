// ---------------------------------------------------------------------------------------------------------------------
// Small collection of useful filters.
//
// @module utils.filters.js
// ---------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------
// Capitalize filter
// ---------------------------------------------------------------------------------------------------------------------

function CapitalizeFilter()
{
    return function capitalize(input)
    {
        if (input != null)
        {
            return input.substring(0,1).toUpperCase() + input.substring(1);
        } // end if

        return '';
    }; // end capitalize
} // end CapitalizeFilter

// ---------------------------------------------------------------------------------------------------------------------
// Markdown filter (Note: Must be used with ng-bind!)
// ---------------------------------------------------------------------------------------------------------------------

function MarkdownFilter($rootScope, $sce, $cacheFactory)
{
    function simpleHash(s)
    {
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    } // end hash

    if(!$rootScope.markdownCache)
    {
        $rootScope.markdownCache = $cacheFactory('markdown-cache', { capacity: 100 });
    } // end if

    return function markdown(text, skipCache)
    {
        if(text)
        {
            if(!skipCache)
            {
                var hash = simpleHash(text);
                var value = $rootScope.markdownCache.get(hash);
                if(value)
                {
                    return $sce.trustAsHtml(value);
                } // end if
            } // end if

            var mdown = marked(text);

            // Support leading newlines.
            text.replace(/^(\r?\n)+/, function(match)
            {
                mdown = match.split(/\r?\n/).join("<br>") + mdown;
            });

            if(!skipCache)
            {
                $rootScope.markdownCache.put(hash, mdown);
            } // end if

            return $sce.trustAsHtml(mdown);
        } // end if
    }; // end markdown
} // end MarkdownFilter

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.utils').filter('capitalize', CapitalizeFilter);
angular.module('rpgkeeper.utils').filter('markdown', ['$rootScope', '$sce', '$cacheFactory', MarkdownFilter]);

// ---------------------------------------------------------------------------------------------------------------------