const { default: axios } = require('axios');
const { Console } = require('console');
var https = require('https');
const cron = require("node-cron");

var player = require('play-sound')(opts = {})


format = function date2str(x, y) {
    var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2)
    });

    return y.replace(/(y+)/g, function (v) {
        return x.getFullYear().toString().slice(-v.length)
    });
}

axios.defaults.headers = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
};

function getVaccine(distId) {
    const todate = new Date();
    let vDate = format(todate, 'dd-MM-yyyy');
    var url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=" + distId + "&date=" + vDate + "&t=" + Math.random(1);
    console.log(todate);
    axios.get(url)
        .then((response) => {
            if (response.status == 200) {
                let body = response.data;
                try {
                    let centersJson = body;
                    centersJson.centers.forEach(function (center, i) {
                        center.sessions.forEach(function (session, j) {
                            if (session.min_age_limit == 18 && session.available_capacity > 0) {
                                console.log("******************************");
                                console.log("Center Name : " + center.name);
                                console.log("Center Address : " + center.address);
                                console.log("Date : " + session.date);
                                console.log("Availability : " + session.available_capacity);
                                console.log("Slot : " + session.slots);
                                console.log("Vaccine Type : " + session.vaccine);
                                player.play('./assets/assets_test.mp3', function (err) {
                                    if (err) throw err
                                });
                            }
                        })
                    });
                } catch (error) {
                    console.error(error);
                };
            }
        }).catch(error => {
            console.log(error)
        })
}

cron.schedule("*/60 * * * * *", function () {
    getVaccine(770);
    Object.keys(require.cache).forEach(function (key) { delete require.cache[key] })
});