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
            markerobj: null,
            info: "Very popular scenic park, more internaitonal than its name would suggest, it contains a Greek temple, Chinese pagoda and Japanese tea house."
        },
        {
            title: "Surfers corner",
            position:
                {
                    lat: 48.143733,
                    lng: 11.588045
                },
            markerobj: null,
            info: "There's year-round surfing on this continuous wave on the Englischer Garten's Eisbach River,legalized in the summer of 2010 only for experienced."
        },
        {
            title: "Marienplatz/Town Hall",
            position:
                {
                    lat: 48.1383715,
                    lng: 11.5708304
                },
            markerobj: null,
            info: "This prominent public square, the largest in Munich, still stands as the center of social activity in the city, much as it has throughout history.",

        },
        {
            title: "St. Peter's Church / Peterskirche",
            position:
                {
                    lat: 48.1367954,
                    lng: 11.5720024
                },
            markerobj: null,
            info: "This 11th-century cathedral, the city's oldest remaining church, is best known for its beautiful golden interior.",

        },
        {
            title: "Hofbräuhaus",
            position:
                {
                    lat: 48.1371928,
                    lng: 11.5764119
                },
            markerobj: null,
            info: "This famous beer hall, founded in the late 16th century, is an extremely popular destination for tourists looking to experience local culture.",
        }

    ]
};
//ViewModel for map
var mapViewModel = function() {
    var self = this;
    self.mapView = ko.observable(model);
    self.markers = ko.observableArray(model.mapMarkers);
    self.keyword = ko.observable("");

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

    self.filterMarkerList = function () {
        var value = (self.keyword()).toLowerCase();
        $("#markerlist li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    };

    self.animateMarker = function (data, event) {
        self.mapselected();
        data.markerobj.setAnimation(google.maps.Animation.DROP);
        new google.maps.event.trigger(data.markerobj, 'click');
    };

}


/*
custom binding to bind the google map object
 */
    ko.bindingHandlers.map = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var model = ko.utils.unwrapObservable(valueAccessor());
            var mapObj = model.maplocation;
            var infowindow = new google.maps.InfoWindow();
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
                //model.mapMarkers[index].infowindow = infowindow;

                mapObj.marker.addListener('click', function () {
                    //creating a info window
                    infowindow.setOptions({
                        content: '<div> <h3>' + marker.title + '</h3><p>' + marker.info + '</p></div>',
                        position: marker.position,
                        maxWidth: 200
                    });

                    infowindow.open(mapObj.googleMap, this);
                });
            });

        }
    };



var viewModel = new mapViewModel();


