describe("FcPresentation directive Test", function() {

    var $elem, elem, $scope, $doc, resource;

    beforeEach(module('fc.presentation'));

    var mockLoader = {};

    beforeEach(inject(function($rootScope, $compile, _$document_, $q) {
        var testMarkup =
            '<fc-presentation>' +
                '<fc-presentation-slide>Some content</fc-presentation-slide>' +
                '<fc-presentation-slide>Some more content</fc-presentation-slide>' +
                '<fc-presentation-controls>' +
                    '<button ng-if="activeSlide < slides.length-1" class="indicator" ng-class="{active:activeSlide==0}" ng-click="slideTo(activeSlide+1)">Onwards!</button>' +
                    '<button ng-if="activeSlide == slides.length-1" class="indicator" ng-class="{active:activeSlide==0}" ng-click="slideTo(0)">Back!</button>' +
                '</fc-presentation-controls>' +
            '</fc-presentation>';

        $elem         = angular.element(testMarkup);
        $scope        = $rootScope.$new();
        $doc          = _$document_;
        $scope.loader = mockLoader;

        elem = $compile($elem)($scope);

        $scope.$apply();
    }));

    it('Should render', function() {
        // $scope.$apply();

        expect($elem.hasClass('fc-presentation')).toBe(true);
        expect($elem.hasClass('fc-presentation-slide-active-0')).toBe(true);

        var slides = angular.element($elem.children().children());
        expect(angular.element(slides[0]).hasClass('presentation-slide')).toBe(true);
        expect(angular.element(slides[1]).hasClass('presentation-slide')).toBe(true);
    });

    it('Should render', function() {
    });
});