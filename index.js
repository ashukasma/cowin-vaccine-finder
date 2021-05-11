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

function getVaccine(distId) {
    const today = new Date();
    console.log(today);
    const todate = new Date();
    for (let daystart = 0; daystart < 7; daystart++) {
        todate.setDate(today.getDate() + daystart);
        let vDate = format(todate, 'dd-MM-yyyy');
        var url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=" + distId + "&date=" + vDate;
        https.get(url, (res) => {
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", () => {
                try {
                    let centersJson = JSON.parse(body);
                    centersJson.centers.forEach(function (center, i) {
                        center.sessions.forEach(function (session, j) {
                            if (session.min_age_limit == 18 && session.available_capacity != 0) {
                                console.log("Center Name : " + center.name);
                                console.log("Date : " + session.date);
                                console.log("Availability: " + session.available_capacity);
                                console.log("Slot: " + session.slots);
                                player.play('./assets/assets_test.mp3', function (err) {
                                    if (err) throw err
                                });
                            }
                        })
                    });
                } catch (error) {
                    console.error(error.message);
                };
            });

        }).on("error", (error) => {
            console.error(error.message);
        });
    }
}

// getVaccine(770);
cron.schedule("*/20 * * * * *", function () {
    getVaccine(770);
});