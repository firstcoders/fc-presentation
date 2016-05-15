'use strict';
// Source: src/directives/fc-presentation.js
/**
 * FC presentation
 *
 * @author Mark Cremer <mark@firstcoders.co.uk>
 */
(function() {
angular.module('fc-presentation', ['duScroll'])
    .directive('fcPresentation', ['$document', '$timeout', '$window', function($document, $timeout, $window) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            controller: ['$scope', function($scope) {
                $scope.slides      = [];
                $scope.activeSlide = 0;

                this.registerSlide = function(slide) {
                    $scope.slides.push(slide);
                };

                this.isActive = function(slide) {
                    return $scope.slides[$scope.activeSlide] === slide;
                };
            }],
            link: function($scope) {
                var body, viewport, timeout;

                body = $document[0].body;
                viewport = angular.element($document);

                /**
                 * @see http://stackoverflow.com/questions/871399/cross-browser-method-for-detecting-the-scrolltop-of-the-browser-window
                 * @return {Integer}
                 */
                function getScrollTop() {
                    if(typeof $window.pageYOffset!= 'undefined'){
                        //most browsers except IE before #9
                        return $window.pageYOffset;
                    }
                    else{
                        var B= $document.body; //IE 'quirks'
                        var D= $document.documentElement; //IE with doctype
                        D= (D.clientHeight)? D: B;
                        return D.scrollTop;
                    }
                }

                var scrollspy = function(e) {
                    var scrollHeight, scrollTop;

                    scrollHeight = body.scrollHeight;
                    scrollTop    = getScrollTop();

                    if (timeout) {
                        $timeout.cancel(timeout);
                    }

                    timeout = $timeout(function() {
                        angular.forEach($scope.slides, function(slideEl, index) {
                            if (slideEl[0].getBoundingClientRect().top <= 0 &&
                                slideEl[0].getBoundingClientRect().bottom >= 0
                            ) {
                                $scope.activeSlide = index;
                            }
                        });
                    }, 10);
                };

                viewport.bind('wheel', scrollspy);

                //execute once on load
                scrollspy();

                var move = function() {
                    $scope.slideTo($scope.activeSlide);
                };

                $scope.slideTo = function(i) {
                    $document.scrollToElement($scope.slides[i], 0, 500);
                    $scope.activeSlide = i;
                };

                $scope.hasNext = function() {
                    return $scope.activeSlide < $scope.slides.length -1;
                };

                $scope.hasPrevious = function() {
                    return $scope.activeSlide > 0;
                };

                $scope.prev = function() {
                    if ($scope.hasPrevious()) {
                        $scope.activeSlide--;
                    }
                    move();
                };

                $scope.next = function() {
                    if ($scope.hasNext()) {
                        $scope.activeSlide++;
                    }
                    move();
                };
            },
            template:   '<div class="fc-presentation fc-presentation-slide-active-{{activeSlide}}">' +
                            '<div ng-transclude class="fc-presentation-content"></div>' +
                        '</div>'
        };
    }])

    .directive('fcPresentationSlide', function() {
        return {
            restrict: 'E',
            require: '^fcPresentation',
            transclude: true,
            replace: true,
            scope: true,
            link: function($scope, element, attr, parent) {
                parent.registerSlide(element);

                $scope.isActive = function() {
                    return parent.isActive(element);
                };
            },
            template: '<div class="fc-presentation-slide" ng-class="{active:isActive()}" ng-transclude></div>'
        };
    })

    .directive('fcPresentationControls', function() {
        return {
            restrict: 'E',
            require: '^fcPresentation',
            transclude: true,
            replace: true,
            template: '<div class="fc-presentation-controls" ng-transclude></div>'
        };
    })

    ;

})();
