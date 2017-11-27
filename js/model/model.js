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


$(function () {
    //Function calles get json method and populates the data for each marker

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
                    model.errormessage("Please check your internet OR refresh in some time.Could not load from flickr");
                });
        }
        catch (err) {
            model.errormessage("Please check your internet OR refresh in some time.Could not load from flickr");
            return;

        }
    };

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
});