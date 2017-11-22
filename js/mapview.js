$(document).ready(function () {
    ko.applyBindings(viewModel);
});


//map model for init
var model = {
//map model for init
    maplocation: {
        lat: 48.152778,
        lng: 11.592100
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
            title: "Marienplatz",
            position:
                {
                    lat: 48.137609,
                    lng: 11.575424
                },
            markerobj: null,
            flickrimg: [],
            info: "This prominent public square, the largest in Munich, still stands as the center of social activity in the city, much as it has throughout history."

        },
        {
            title: "Peterskirche",
            position:
                {
                    lat: 48.136871,
                    lng: 11.576086
                },
            markerobj: null,
            flickrimg: [],
            info: "This 11th-century cathedral, the city's oldest remaining church, is best known for its beautiful golden interior."

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
            info: "This famous beer hall, founded in the late 16th century, is an extremely popular destination for tourists looking to experience local culture."
        },
        {
            title: "Frauenkirche",
            position:
                {
                    lat: 48.138938,
                    lng: 11.573591
                },
            markerobj: null,
            flickrimg: [],
            info: "The Frauenkirche is a church in the Bavarian city of Munich that serves as the cathedral of the Archdiocese of Munich and Freising and seat of its Archbishop. It is a landmark and is considered a symbol of the Bavarian capital city."
        },
        {
            title: "Olympiapark",
            position:
                {
                    lat: 48.175672,
                    lng: 11.551801
                },
            markerobj: null,
            flickrimg: [],
            info: "Olympiahalle is a multi-purpose arena located in Am Riesenfeld in Munich, Germany, part of Olympiapark."
        },
        {
            title: "Viktualienmarkt",
            position:
                {
                    lat: 48.135276,
                    lng: 11.576266
                },
            markerobj: null,
            flickrimg: [],
            info: "The Viktualienmarkt is a daily food market and a square in the center of Munich, Germany. The Viktualienmarkt developed from an original farmers' market to a popular market for gourmets."
        }

    ],
    currentmarker: {},
    errormessage: ""
};
//ViewModel for map
var mapViewModel = function() {
    var self = this;
    model.currentmarker = ko.observable();
    model.errormessage = ko.observable();
    self.mapView = ko.observable(model);
    self.markers = ko.observableArray(model.mapMarkers);
    self.keyword = ko.observable("");
    self.errormessage = model.errormessage;

    //Flicker images observable
    self.currentMarkerImgs = ko.computed(function () {
        var marker = model.currentmarker();
        if (marker === undefined || marker === null) {
            return null;
        }
        return marker.flickrimg;
    });

    //when map is sclicked after menu selection
    self.mapselected = function () {
        // hide the sidebar
        $('#sidebar').removeClass('active');
        // fade out the overlay
        $('.overlay').fadeOut();
    };

    //when  menu button is clicked
    self.menuselected = function () {
        $('#sidebar').addClass('active');
        // fade in the overlay
        $('.overlay').fadeIn();
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        $("#markerlist ul").show();
        $("#markerlist li").each(function () {
            marker = ko.dataFor(this);
            marker.markerobj.setVisible(true);
        });

    };

    //search function
    self.filterMarkerList = function () {
        var value = (self.keyword()).toLowerCase();
        if (value.length === 0) {
            $("#markerlist li").filter(function () {
                $(this).show();
            });
        }
        else {
            $("#markerlist li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        }
    };

    //animate marker when a marker is selected from the list
    self.animateMarker = function (data) {
        self.mapselected();
        self.keyword("");
        self.filterMarkerList();
        model.currentmarker(data);
        //self.currentMarkerImgs(data.flickrimg);
        data.markerobj.setAnimation(google.maps.Animation.DROP);
        new google.maps.event.trigger(data.markerobj, 'click');
    };

    //for partial word search where there ae more than 1 marker to show.
    self.showmultiplemarkers = function () {
        $("#markerlist li").each(function () {
            if ($(this).is(':visible')) {
                marker = ko.dataFor(this);
                marker.markerobj.setVisible(true);
                console.log(marker.markerobj);
            }
            else {
                marker = ko.dataFor(this);
                marker.markerobj.setVisible(false);
                console.log(marker.markerobj);
            }
        });
        self.mapselected();
        self.keyword("");
    };

    //Function calles get jaon method and populates the data for each marker

    self.loadflickrdata = function (url, marker) {
        try {
            $.getJSON(url,
                {
                    "text": marker.title
                }).done(function (data) {
                var currentmarker = marker;
                photoslist = data.photos.photo;
                for (var i = 0, len = photoslist.length; i < len; i++) {
                    currentmarker.flickrimg.push('https://farm' + photoslist[i].farm + '.staticflickr.com/' + photoslist[i].server + '/' + photoslist[i].id + '_' + photoslist[i].secret + '.jpg');
                }
            })
                .fail(function (e, textstatus, error) {
                    model.errormessage("Please check your internet OR refresh in some time.");
                });
        }
        catch (err) {
            model.errormessage("Please check your internet OR refresh in some time.");
            return;

        }
    }

    //get top 10 image url from flicker for each location
    //not computed array as the marker is not editable so needs to be computed only once.
    leng = model.mapMarkers.length;
    for (var index = 0; index < leng; index++) {
        marker = model.mapMarkers[index];
        url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&' +
            'api_key=45b5c4e7658a4c9fba59f026aa028a75&lat=' + marker.position.lat + '&lon=' +
            marker.position.lng + '&per_page=15&page=1&format=json&nojsoncallback=1';

        self.loadflickrdata(url, marker);


    }


};


/*
 * custom binding to bind the google map object
 * centers map and places markaers on the map
 */
    ko.bindingHandlers.map = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {


            var model = ko.utils.unwrapObservable(valueAccessor());
            var mapObj = model.maplocation;
            try {
                if (!google || !google.maps) {
                    console.log('Not loaded yet');
                }
            }
            catch (err) {
                model.errormessage("Please check your internet OR refresh in some time.");
                return;
            }


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
                    map: mapObj.googleMap

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
                    model.currentmarker(marker);
                });


            });

            google.maps.event.addListener(infowindow, 'closeclick', function () {
                //infowindow.close();
                model.currentmarker(null);
            });

        }
    };



var viewModel = new mapViewModel();



