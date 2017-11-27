var model = model || {};

$(document).ready(function () {

    ko.applyBindings(viewModel);

});


//ViewModel for map
var mapViewModel = function () {
    var self = this;
    model.currentmarker = ko.observable();
    model.errormessage = ko.observable();
    self.mapView = ko.observable(model);
    //self.markers = ko.observableArray(model.mapMarkers);
    self.keyword = ko.observable("");
    self.errormessage = model.errormessage;
    self.showsidebar = ko.observable(false);

    //Flicker images observable
    self.currentMarkerImgs = ko.computed(function () {
        var marker = model.currentmarker();
        if (marker === undefined || marker === null) {
            return null;
        }
        return marker.flickrimg;
    });


    // replacement function for depricated ko.utils.stringStartsWith
    self.stringStartsWith = function (string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length) {
            return false;
        }
        else {
            return string.substring(0, startsWith.length) === startsWith;
        }

    };

    self.filterMarkerList = ko.computed(function () {
        var filter = self.keyword().toLowerCase();
        if (!filter) {
            return model.mapMarkers;
        } else {
            return ko.utils.arrayFilter(model.mapMarkers, function (marker) {
                return self.stringStartsWith(marker.title.toLowerCase(), filter);
            });
        }

    });

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

    //for displaying markers on search
    self.showmultiplemarkers = ko.computed(function () {
        var visibleMarkers = self.filterMarkerList();
        model.mapMarkers.forEach(function (marker) {
            if (marker.markerobj !== null) {
                marker.markerobj.setVisible(false);
            }
        });
        visibleMarkers.forEach(function (marker) {
            if (marker.markerobj !== null) {
                marker.markerobj.setVisible(true);
            }
        });

    });

    self.menuselected = function () {
        self.showsidebar(true);
        //$('.overlay').fadeIn();
    };

    self.mapselected = function () {
        self.showsidebar(false);
        //$('.overlay').fadeOut();
    };

    self.sidebar = ko.pureComputed(function () {
        if (self.showsidebar()) {
            return "active";
        }
        else {
            return "inactive";
        }

    });

};


// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function (element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
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
            model.errormessage("Please check your internet OR refresh in some time. Could not load map");
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
                map: mapObj.googleMap,
                //animation: google.maps.Animation.DROP,
            });

            model.mapMarkers[index].markerobj = mapObj.marker;

            mapObj.marker.addListener('click', function () {
                //creating a info window
                infowindow.setOptions({
                    content: '<div> <h3>' + marker.title + '</h3><p>' + marker.info + '</p></div>',
                    position: marker.position,
                    maxWidth: 200,

                });
                marker.markerobj.setAnimation(google.maps.Animation.DROP);
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

/**
 * Error callback for GMap API request
 */
mapError = function () {
    model.errormessage("Please check your internet OR refresh in some time. Could not load map");
};

var viewModel = new mapViewModel();



