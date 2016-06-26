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
                $scope.slides = [];

                this.registerSlide = function(slide) {
                    $scope.slides.push(slide);
                };

                this.isActive = function(slide) {
                    return $scope.slides[$scope.activeSlide] === slide;
                };

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
            }],
            link: function($scope, elem, attr, ctrl) {
                var body, $win, isChecking, top, delay;

                body = $document[0].body;
                $win = angular.element($window);
                top = parseInt(attr.fcPresentationTop) || 0;
                delay = parseInt(attr.delay) || 250;

                function isSlideVisible(el) {
                    var rect = el[0].getBoundingClientRect();

                    return (
                        rect.top <= top &&
                        rect.bottom >= 0
                    );
                }

                var handleScroll = function(e) {
                    if (!isChecking) {
                        isChecking = true;
                        $timeout(function() {
                            angular.forEach($scope.slides, function(slideEl, index) {
                                if (isSlideVisible(slideEl)) {
                                    $scope.activeSlide = index;
                                }
                            });
                            isChecking = false;
                        }, 100);
                    }
                };

                $win.on("scroll", handleScroll);

                $scope.$on('$destroy', function() {
                    $win.off("scroll", handleScroll);
                });

                //execute once on load
                $timeout(function() {
                    handleScroll();
                }, delay);

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
