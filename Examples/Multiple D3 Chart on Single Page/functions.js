function showLoader() {
    d3.select('.spinner').style('display', 'block');
    d3.select('#data-btns').style('display', 'none');
    d3.select('#pm10Chart').style('display', 'none');
    d3.select('#pm25Chart').style('display', 'none');
    d3.select('#no2Chart').style('display', 'none');
    d3.select('#o3Chart').style('display', 'none');
}

function hideLoader() {
    d3.select('.spinner').style('display', 'none');
    d3.select('#data-btns').style('display', 'block');
    d3.select('#pm10Chart').style('display', 'block');
    d3.select('#pm25Chart').style('display', 'block');
    d3.select('#no2Chart').style('display', 'block');
    d3.select('#o3Chart').style('display', 'block');
}

function realTimeData() {
    showLoader();
    setTimeout(() => {
        d3.json(url + stationId + '/air_quality', (error, data) => {
            if (error) throw error;

            hideLoader();
            let realTimeData = removeDuplicates(data.air_quality, 'aqi');
            let recentData = realTimeData.splice(0, 18);
            if (realTimeData[0].iaqi.hasOwnProperty('pm10')) {
                d3.select('svg#pm10-svg').remove();
                createChart(recentData, 'pm10', 'steelblue');
            }
            if (realTimeData[0].iaqi.hasOwnProperty('pm25')) {
                d3.select('svg#pm25-svg').remove();
                createChart(recentData, 'pm25', 'red');
            }   
            if (realTimeData[0].iaqi.hasOwnProperty('no2')) {
                d3.select('svg#no2-svg').remove();
                createChart(recentData, 'no2', 'green');
            }  
            if (realTimeData[0].iaqi.hasOwnProperty('o3')) {
                d3.select('svg#o3-svg').remove();
                createChart(recentData, 'o3', 'orange');
            }   
        });
    }, 1000);
}

function historialData() {
    showLoader();
    d3.select('#weekdays').style('display', 'none');
    setTimeout(() => {
        d3.json(url + stationId + '/air_quality', (error, data) => {
            if (error) throw error;

            hideLoader();
            d3.select('.current-date').style('display', 'block');
            let historicalData = removeDuplicates(data.air_quality, 'aqi');
            let weekData = d3.nest()
                .key((d) => { 
                    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    let date = new Date(d.time.s).getDate();
                    if (date < 10) { date = '0' + date; }
                    let month = new Date(d.time.s).getMonth();
                    return date + ' ' + monthNames[month];
                })
                .entries(historicalData);

            if (!d3.select('#current-day').classed('active')) {
                d3.select(".active").classed("active", false);
                d3.select('#current-day').classed('active', true);
            }

            if (weekData[0].values[0].iaqi.hasOwnProperty('pm10')) {
                d3.select('svg#pm10-svg').remove();
                createChart(weekData[0].values, 'pm10', 'steelblue');
            }
            if (weekData[0].values[0].iaqi.hasOwnProperty('pm25')) {
                d3.select('svg#pm25-svg').remove();
                createChart(weekData[0].values, 'pm25', 'red');
            }   
            if (weekData[0].values[0].iaqi.hasOwnProperty('no2')) {
                d3.select('svg#no2-svg').remove();
                createChart(weekData[0].values, 'no2', 'green');
            }  
            if (weekData[0].values[0].iaqi.hasOwnProperty('o3')) {
                d3.select('svg#o3-svg').remove();
                createChart(weekData[0].values, 'o3', 'orange');
            }
        });
    }, 1000);
}

function initialChart() {
    showLoader();
    setTimeout(() => {
        d3.json(url + stationId + '/air_quality', (error, data) => {
            if (error) throw error;

            hideLoader();

            var data = removeDuplicates(data.air_quality, 'aqi');
            var dataByDate = d3.nest()
                .key(function(d) { 
                    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    let date = new Date(d.time.s).getDate();
                    if (date < 10) { date = '0' + date; }
                    let month = new Date(d.time.s).getMonth();
                    return date + ' ' + monthNames[month];
                })
                .entries(data);

            let weekArray = [];
            let button = d3.select(".current-date").selectAll("button")
                .data(dataByDate.splice(0, 7))
                .enter()  
                .append("button")
                    .attr("class", function (d) {
                        weekArray.push(d.key);
                        if ( d.key === weekArray[0] ) { return 'active'; }
                        else { return 'not-active'; }
                    })
                    .attr('id', function(d) {
                        if (d.key === weekArray[0]) { return 'current-day'; }
                    })
                    .text(function(d) { return d.key; })
                    .on("click", function(d) {
                        d3.select(".active").classed("active", false);
                        d3.select(this).classed("active", true);
                        if (d.values[0].iaqi.hasOwnProperty('pm10')) {
                            d3.select('svg#pm10-svg').remove();
                            createChart(d.values, 'pm10', 'steelblue'); 
                        }
                        if (d.values[0].iaqi.hasOwnProperty('pm25')) {
                            d3.select('svg#pm25-svg').remove();
                            createChart(d.values, 'pm25', 'red');
                        }
                        if (data[0].iaqi.hasOwnProperty('no2')) {
                            d3.select('svg#no2-svg').remove();
                            createChart(d.values, 'no2', 'green');
                        }
                        if (data[0].iaqi.hasOwnProperty('o3')) {
                            d3.select('svg#o3-svg').remove();
                            createChart(d.values, 'o3', 'orange');
                        }
                    });
            
            if (data[0].iaqi.hasOwnProperty('pm10')) 
                createChart(data, 'pm10', 'steelblue');
            if (data[0].iaqi.hasOwnProperty('pm25'))
                createChart(data, 'pm25', 'red');
            if (data[0].iaqi.hasOwnProperty('no2'))
                createChart(data, 'no2', 'green');
            if (data[0].iaqi.hasOwnProperty('o3'))
                createChart(data, 'o3', 'orange');
        });
    }, 1000);
}