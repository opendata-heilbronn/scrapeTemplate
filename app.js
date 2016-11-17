var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');
var moment  = require('moment');

var url = "https://www.heise.de/newsticker/meldung/Spielkonsolenklassiker-in-4K-3488926.html";
var channelId = "582dc224e4b0069e4fc67503";

request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

        var $       = cheerio.load(body);
        var article = $('article');
        var header  = article.find('.article-header');
        var text    = article.find('.meldung_wrapper');

        var title   = header.find('.news_headline').text();
        var publish = header.find('.publish-info');
        var uhrzeit = moment(publish.find('time').text().replace(' Uhr', ''), "DD.MM.YYYY HH:mm").format();
        var author  = publish.find('.author').text();

        //Links absolut machen
        text.find('a').each(function () {
            var link = $(this);
            if(link.attr('href').charAt(0) == "/" && link.attr('href').charAt(1) != "/"){
                link.attr('href', "https://heise.de" + link.attr('href'));
            }
        });
        text.find('a').each(function () {
            var img = $(this);
            if(img.attr('href').charAt(0) == "/" && img.attr('href').charAt(1) != "/"){
                img.attr('href', "https://heise.de" + img.attr('href'));
            }
        });

        var send = {
            "channelId" : channelId,
            "title" : title,
            "link" : url,
            "pubDate" : published,
            "content" : text.html()
        }

        request.post({'url':'https://api.grundid.de/rss/item', 'json':send},
            function(error, response, body){
                console.log(body);
            }
        );

    }else{
        console.log("could not connect to the host");
    }
})