$(document).ready(function () {
    ko.applyBindings(viewModel);
});


//map model for init
var model = {
//map model for init
    maplocation: {
        lat: 48.165086,
        lng: 11.553062
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
            flickrimg: [],
            info: "Very popular scenic park, more internaitonal than its name would suggest, it contains a Greek temple, Chinese pagoda and Japanese tea house."

        },
        {
            title: "Eisbach Wave",
            position:
                {
                    lat: 48.143733,
                    lng: 11.588045
                },
            markerobj: null,
            flickrimg: [],
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
            flickrimg: [],
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
            flickrimg: [],
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
            flickrimg: [],
            info: "This famous beer hall, founded in the late 16th century, is an extremely popular destination for tourists looking to experience local culture.",
        },
        {
            title: "Frauenkirche",
            position:
                {
                    lat: 48.1386097,
                    lng: 11.5035857
                },
            markerobj: null,
            flickrimg: [],
            info: "The Frauenkirche is a church in the Bavarian city of Munich that serves as the cathedral of the Archdiocese of Munich and Freising and seat of its Archbishop. It is a landmark and is considered a symbol of the Bavarian capital city."
        },
        {
            title: "Olympiapark",
            position:
                {
                    lat: 48.1754433,
                    lng: 11.4817573
                },
            markerobj: null,
            flickrimg: [],
            info: "Olympiahalle is a multi-purpose arena located in Am Riesenfeld in Munich, Germany, part of Olympiapark."
        },
        {
            title: "Viktualienmarkt",
            position:
                {
                    lat: 48.135093,
                    lng: 11.5062152
                },
            markerobj: null,
            flickrimg: [],
            info: "The Viktualienmarkt is a daily food market and a square in the center of Munich, Germany. The Viktualienmarkt developed from an original farmers' market to a popular market for gourmets."
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

    //get top 10 image url from flicker for each location
    ko.computed(function () {

        for (var index = 0, leng = model.mapMarkers.length; index < leng; index++) {

            marker = model.mapMarkers[index];
            url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&' +
                'api_key=45b5c4e7658a4c9fba59f026aa028a75&lat=' + marker.position.lat + '&lon=' +
                marker.position.lng + '&per_page=10&page=1&format=json&nojsoncallback=1';

            $.getJSON(url, {"text": marker.title}, (function () {
                var currentindex = index;
                //call back function so that index can be accessed
                return function (data) {
                    photoslist = data.photos.photo;
                    for (var i = 0, len = photoslist.length; i < len; i++) {
                        model.mapMarkers[currentindex].flickrimg.push('https://farm' + photoslist[i].farm + '.staticflickr.com/' + photoslist[i].server + '/' + photoslist[i].id + '_' + photoslist[i].secret + '.jpg');
                    }
                }

            })());
        }
    }, this);

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



