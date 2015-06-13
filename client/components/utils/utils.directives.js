// ---------------------------------------------------------------------------------------------------------------------
// Utility directives
//
// @module utils.directives.js
// ---------------------------------------------------------------------------------------------------------------------

function MarkdownDirective($compile, $filter)
{
    return {
        restrict: 'E',
        scope: {
            src: '=',
            skipCache: '='
        },
        template: "<div></div>",
        link: function(scope, elem)
        {
            scope.$watch('src', function()
            {
                // Render the markdown text
                var src = $filter('markdown')(scope.src, scope.skipCache);

                // Add those rendered elements to our element
                elem.html(src);

                // Tell $compile to render our element's new contents
                $compile(elem.contents())(scope);
            });
        },
        replace: true
    }
} // end MarkdownDirective

function EnterDirective()
{
    return function(scope, element, attrs)
    {
        element.bind("keydown keypress", function(event)
        {
            if(event.which === 13)
            {
                scope.$apply(function()
                {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            } // end if
        });
    };
} // end EnterDirective

function PopoverHtmlUnsafePopupDirective()
{
    return {
        restrict: "EA",
        replace: true,
        scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&" },
        templateUrl: "/components/utils/popover-html-unsafe-popup.html"
    };
} // end PopoverHtmlUnsafePopupDirective

function PopoverHtmlUnsafe($tooltip)
{
    return $tooltip("popoverHtmlUnsafe", "popover", "click");
} // end PopoverHtmlUnsafe

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.utils').directive('markdown', MarkdownDirective);
angular.module('rpgkeeper.utils').directive('ngEnter', EnterDirective);
angular.module('rpgkeeper.utils').directive('popoverHtmlUnsafePopup', PopoverHtmlUnsafePopupDirective);
angular.module('rpgkeeper.utils').directive('popoverHtmlUnsafe', ['$tooltip', PopoverHtmlUnsafe]);

// ---------------------------------------------------------------------------------------------------------------------