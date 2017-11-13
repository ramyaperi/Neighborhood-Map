$(document).ready(function () {
    ko.applyBindings(viewModel);
});

//map model for init
var model = {
//map model for init
    maplocation: {
        lat: 48.135268,
        lng: 11.583283
    },

    mapMarkers: [
        {
            title: "Englischer Garten",
            position:
                {
                    lat: 48.164308,
                    lng: 11.605395
                },
            markerobj: null
        },
        {
            title: "Surfers corner",
            position:
                {
                    lat: 48.143733,
                    lng: 11.588045
                },
            markerobj: null
        },
        {
            title: "Marienplatz/Town Hall",
            position:
                {
                    lat: 48.1383715,
                    lng: 11.5708304
                },
            markerobj: null
        },
        {
            title: "St. Peter's Church / Peterskirche",
            position:
                {
                    lat: 48.1367954,
                    lng: 11.5720024
                },
            markerobj: null
        },
        {
            title: "Hofbräuhaus",
            position:
                {
                    lat: 48.1371928,
                    lng: 11.5764119
                },
            markerobj: null
        }

    ]
};
//ViewModel for map
var mapViewModel = function() {
    var self = this;
    self.mapView = ko.observable(model);
    self.markers = ko.observableArray(model.mapMarkers);

    console.log(self.markers);

    self.mapselected = function () {
        // hide the sidebar
        $('#sidebar').removeClass('active');
        // fade out the overlay
        $('.overlay').fadeOut();
    };

    self.menuselected = function () {
        $('#sidebar').addClass('active');
        // fade in the overlay
        $('.overlay').fadeIn();
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    };
}


/*
custom binding to bind the google map object
 */
    ko.bindingHandlers.map = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var model = ko.utils.unwrapObservable(valueAccessor());
            var mapObj = model.maplocation;
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
            model.mapMarkers.forEach(function (marker, index) {
                mapObj.marker = new google.maps.Marker({

                    position: marker.position,
                    title: marker.title,
                    map: mapObj.googleMap,

                });
                model.mapMarkers[index].markerobj = mapObj.marker;
            });

        }
    };



var viewModel = new mapViewModel();


