$(document).ready(function () {
    ko.applyBindings(viewModel);
});

//map model for init
var mapModel  = {
          lat: 48.135268,
          lng: 11.583283
      };

//ViewModel for map
var mapViewModel = function() {
    var self = this;
    self.mapView = ko.observable(mapModel);

    self.menubuttonclicked = function(){
        $("#menu-toggle").click(function (e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });
    };
}


/*
custom binding to bind the google map object
 */
    ko.bindingHandlers.map = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var mapObj = ko.utils.unwrapObservable(valueAccessor());
            var latLng = new google.maps.LatLng(
                ko.utils.unwrapObservable(mapObj.lat),
                ko.utils.unwrapObservable(mapObj.lng));
            //map option for custom map loading
            var mapOptions = {
                center: latLng,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                disableDefaultUI: true
            };

            mapObj.googleMap = new google.maps.Map(element, mapOptions);

        }
    };



var viewModel = new mapViewModel();


