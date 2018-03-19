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
                        if (d.values[0].iaqi.hasOwnProperty('no2')) {
                            d3.select('svg#no2-svg').remove();
                            createChart(d.values, 'no2', 'green');
                        }
                        if (d.values[0].iaqi.hasOwnProperty('o3')) {
                            d3.select('svg#o3-svg').remove();
                            createChart(d.values, 'o3', 'orange');
                        }
                    });
            
            var initialData = data.splice(0, 18);
            if (data[0].iaqi.hasOwnProperty('pm10')) 
                createChart(initialData, 'pm10', 'steelblue');   
            if (data[0].iaqi.hasOwnProperty('pm25'))
                createChart(initialData, 'pm25', 'red');
            if (data[0].iaqi.hasOwnProperty('no2'))
                createChart(initialData, 'no2', 'green');
            if (data[0].iaqi.hasOwnProperty('o3'))
                createChart(initialData, 'o3', 'orange');
        });
    }, 1000);
}

function createChart(data, id, color) {
    let line = d3.line()
        .x((d) => { return x(d.dateTime); })
        .y((d) => {
            if (id == 'pm10') { return y(d.pm10); }
            else if (id == 'pm25') { return y(d.pm25); }
            else if (id == 'no2') { return y(d.no2); }
            else if (id == 'o3') { return y(d.o3); } 
        });

    let svg = d3.select('#' + id + 'Chart')
        .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('id', id + '-svg')
        .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    data.forEach((d) => {
        d.dateTime = timeFormat(d.time.s);
        if (id == 'pm10') { 
            if (d.iaqi.pm10) { d.pm10 = +d.iaqi.pm10.v;} 
            else { d.pm10 = +0; }
        } 
        else if (id == 'pm25') { 
            if (d.iaqi.pm25) { d.pm25 = +d.iaqi.pm25.v; } 
            else { d.pm25 = +0; }
        } 
        else if (id == 'no2') { 
            if (d.iaqi.no2) { d.no2 = +d.iaqi.no2.v; } 
            else { d.no2 = +0; }
        } 
        else if (id == 'o3') { 
            if (d.iaqi.o3) { d.o3 = +d.iaqi.o3.v; } 
            else { d.o3 = +0; }
        } else { 
            return false; 
        }
    });

    x.domain(d3.extent(data, (d) => { return d.dateTime; }));
    y.domain([0, d3.max(data, (d) => { 
        if (id == 'pm10') { return d.pm10; }
        else if (id == 'pm25') { return d.pm25; }
        else if (id == 'no2') { return d.no2; }
        else if (id == 'o3') { return d.o3; } 
    })]);

    var sv = d3.select('svg#' + id + '-svg');
    if (sv.empty()) {
        drawline.data([data])
            .attr('class', 'line')
            .style('stroke', color)
            .attr('d', line);
    } else {
        drawline = svg.append('path')
            .data([data])
            .attr('class', 'line')
            .style('stroke', color)
            .attr('d', line);
    }
    
    if (id == 'pm10') {
        svg.selectAll('.heading')
            .data([data])
            .enter().append('text')
            .attr('class', 'heading')
            .attr('transform', 'translate(' + (width / 2) + ', -10)')
            .style('text-anchor', 'middle').style('font-size', '12px').style('font-weight', 600)
            .text((d) => {
                return d[0].city.name + ' Station';
            });
    }

    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 2.5)
        .attr("cx", (d) => { return x(d.dateTime); })
        .attr("cy", (d) => { 
            if (id == 'pm10') { return y(d.pm10); }
            else if (id == 'pm25') { return y(d.pm25); }
            else if (id == 'no2') { return y(d.no2); }
            else if (id == 'o3') { return y(d.o3); } 
        })
        .style('fill', color)
        .on("mouseover", (d) => {
            if (id == 'pm10') { 
                div.transition()
                    .duration(100)
                    .style("opacity", 1);
                div.html(
                    '<p><b>pm<sub>10</sub> Level: </b>' + d.pm10 + ' ug/m<sup>3</sup></p>'
                    + '<p><b>Time: </b>' + displayTime(d.time.s) + '</p>'
                    + '<p><b>Date: </b>' + displayDate(d.time.s) + '</p>'
                )
                .style("left", (d3.event.pageX + 28) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
            }
            else if (id == 'pm25') { 
                div.transition()
                    .duration(100)
                    .style("opacity", 1);
                div.html(
                    '<p><b>pm<sub>25</sub> Level: </b>' + d.pm25 + ' ug/m<sup>3</sup></p>'
                    + '<p><b>Time: </b>' + displayTime(d.time.s) + '</p>'
                    + '<p><b>Date: </b>' + displayDate(d.time.s) + '</p>'
                )
                .style("left", (d3.event.pageX + 28) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
            }
            else if (id == 'no2') { 
                div.transition()
                    .duration(100)
                    .style("opacity", 1);
                div.html(
                    '<p><b>no<sub>2</sub> Level: </b>' + d.no2 + ' ug/m<sup>3</sup></p>'
                    + '<p><b>Time: </b>' + displayTime(d.time.s) + '</p>'
                    + '<p><b>Date: </b>' + displayDate(d.time.s) + '</p>'
                )
                .style("left", (d3.event.pageX + 28) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
            }
            else if (id == 'o3') {
                div.transition()
                    .duration(100)
                    .style("opacity", 1);
                div.html(
                    '<p><b>o<sub>3</sub> Level: </b>' + d.o3 + ' ug/m<sup>3</sup></p>'
                    + '<p><b>Time: </b>' + displayTime(d.time.s) + '</p>'
                    + '<p><b>Date: </b>' + displayDate(d.time.s) + '</p>'
                )
                .style("left", (d3.event.pageX + 28) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
            }
        })
        .on("mouseout", (d) => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    var legend = svg.selectAll('.legends')
        .data(labels)
        .enter().append('g')
        .attr("class", "legends")
        .attr('transform', 'translate(10, ' + (height + margin.top + 10) + ')');
    legend.append('rect')
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color);
    legend.append('text')
        .attr("x", 20)
        .attr("y", 10)
        .text((d, i) => {
            if (id == 'pm10') { return 'pm10 (Particulate Matter 10 micrometers)'; }
            else if (id == 'pm25') { return 'pm25 (Particulate Matter 2.5 micrometers)'; }
            else if (id == 'no2') { return 'no2 (Nitrogen Dioxide)'; }
            else if (id == 'o3') { return 'o3 (Ground Level Ozone)'; } 
        })
        .attr("class", "textselected")
        .style("text-anchor", "start")
        .style("font-size", 12)
        .style('font-weight', 400);

    svg.append('g')
        .attr('transform', 'translate(0, ' + height + ')')
        .attr('class', 'x axis')
        .call(d3.axisBottom(x).ticks(3));

    svg.append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(y).ticks(3));
    
}

function removeDuplicates(arr, key) {
    if (!(arr instanceof Array) || key && typeof key !== 'string')
        return false;
    if (key && typeof key === 'string') {
        return arr.filter((obj, index, arr) => {
            return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === index;
        });
    } else {
        return arr.filter((item, index, arr) => {
            return arr.indexOf(item) == index;
        });
    }
}

function displayTime(date) {
    let hours = new Date(date).getHours(),
        minutes = new Date(date).getMinutes(),
        ampm = '';
    if (hours < 12) { ampm = 'AM'; } 
    else { ampm = 'PM'; }
    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    return hours + ':' + minutes + ' ' + ampm;
}

function displayDate(d) {
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let date = new Date(d).getDate();
    if (date < 10) { date = '0' + date; }
    let month = new Date(d).getMonth();
    let year = new Date(d).getFullYear();
    return date + ' ' + monthNames[month] + ', ' + year;
}

function modifyCalenderDates(calenderFullDate) {
    let month, date, year, dateString;
    year = new Date(calenderFullDate).getFullYear();
    if (new Date(calenderFullDate).getMonth() < 10) {
        month= '0' + (new Date(calenderFullDate).getMonth() + 1);
    }
    else {
        month = (new Date(calenderFullDate).getMonth() + 1);
    }
    if (new Date(calenderFullDate).getDate() < 10) {
        date = '0' + new Date(calenderFullDate).getDate();
    }
    else {
        date = new Date(calenderFullDate).getDate();
    }
    dateString = year + '-' + month + '-' + date;
    return dateString;
}

function filterCSV() {
    d3.csv('historical-data/2015/2015PM2.5.csv', (error, data) => {
        if (error) throw error;

        let fetchCompareDates, compareDatesArr, compareStartFullDate, compareEndFullDate
        fetchCompareDates = document.getElementById('compare-daterange').value;
        compareDatesArr = fetchCompareDates.split(' - ');
        compareStartFullDate = compareDatesArr[0];
        compareEndFullDate = compareDatesArr[1];
        var startDateString = modifyCalenderDates(compareStartFullDate);
        var endDateString = modifyCalenderDates(compareEndFullDate);

        period = data.filter(function(d){
            // console.log(d.Datum);
            if (d.Datum >= startDateString && d.Datum <= endDateString) {
                // console.log(d);
            }
            // var dateNum = +d.Datum;
            // return startDateString <= dateNum && dateNum <= endDateString;
        });
        // console.log(period);
    });
}

function createComparisonChart(data, id, color) {
    let line = d3.line()
        .x((d) => { 
            return x(d.dateTime);
        })
        .y((d) => {
            // if (id == 'pm10') { return y(d.pm10); }
            if (id == 'pm25') { 
                return y(d.pm25);
            }
            // else if (id == 'no2') { return y(d.no2); }
            // else if (id == 'o3') { return y(d.o3); } 
        });

    let line2 = d3.line()
        .x((d) => { 
            return x(d.dateTime);
        })
        .y((d) => {
            /*if (id == 'pm10') { return y(c.pm10); }
            else if (id == 'pm25') { return y(d.pm25); }
            else if (id == 'no2') { return y(d.no2); }
            else if (id == 'o3') { return y(d.o3); } */
            if (id == 'pm25') { 
                return y(d.Essingeleden);
            }
        });

    let svg = d3.select('#' + id + 'Chart')
        .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('id', id + '-svg')
        .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    let line1Array = [], line2Array = [];
    data.forEach((d) => {
        if (d.iaqi) {
            line1Array.push(d);
        }
        else if (d.Datum) {
            line2Array.push(d);
        }
    });
    console.log(line2Array);

    line1Array.forEach((d) => {
        let timeArr = d.time.s.split(' ');
        let dateArr = timeArr[0].split('-');
        let newDate = dateArr[1] + '-' + dateArr[2];
        d.dateTime = hourTimeFormat(newDate + ' ' + timeArr[1]);

        if (id == 'pm25') {
            if (d.iaqi.pm25) { d.pm25 = +d.iaqi.pm25.v; } 
            else { d.pm25 = +0; }
        }

        line2Array.forEach((d) => {
            let datArr = d.Datum.split('-');
            let datTimString = datArr[1] + '-' + datArr[2];
            d.dateTime = hourTimeFormat(datTimString + ' ' + d.Kl + ':00');
    
            if (id == 'pm25') {
                if (d.Essingeleden < 0) {
                    d.Essingeleden = +0;
                }
                else {
                    d.Essingeleden = +d.Essingeleden;
                }

            }
            
        });
    });

    if (line1Array.length > line2Array.length) {
        x.domain(d3.extent(line1Array, (d) => { 
            return d.dateTime;
        }));
        y.domain([0, d3.max(line1Array, (d) => { 
            // if (id == 'pm10') { return d.pm10; }
            if (id == 'pm25') { 
                return d.pm25;
            }
            // else if (id == 'no2') { return d.no2; }
            // else if (id == 'o3') { return d.o3; } 
        })]);
    }
    if (line1Array.length < line2Array.length) {
        x.domain(d3.extent(line2Array, (d) => { 
            console.log(d.dateTime);
            return d.dateTime;
        }));
        y.domain([0, d3.max(line2Array, (d) => { 
            // if (id == 'pm10') { return d.pm10; }
            if (id == 'pm25') { 
                return Math.max(d.pm25, d.Essingeleden);
            }
            // else if (id == 'no2') { return d.no2; }
            // else if (id == 'o3') { return d.o3; } 
        })]);
    }

    /*data.forEach((d) => {
        if (d.iaqi) {
            
        }
        else if (d.Datum) {
            
        }
        
        if (id == 'pm10') { 
            if (d.iaqi.pm10) { d.pm10 = +d.iaqi.pm10.v; } 
            else { d.pm10 = +0; }
            c.Essingeleden = +c.Essingeleden;
        }
        if (id == 'pm25') {
            if (d.iaqi) {
                if (d.iaqi.pm25) { d.pm25 = +d.iaqi.pm25.v; } 
                else { d.pm25 = +0; }
            }
            else if (d.Datum) {
                d.Essingeleden = +d.Essingeleden;
            }
        } 
        else if (id == 'no2') { 
            if (d.iaqi.no2) { d.no2 = +d.iaqi.no2.v; } 
            else { d.no2 = +0; }
            c.Essingeleden = +c.Essingeleden;
        } 
        else if (id == 'o3') { 
            if (d.iaqi.o3) { d.o3 = +d.iaqi.o3.v; } 
            else { d.o3 = +0; }
            c.Essingeleden = +c.Essingeleden;
        } else { 
            return false; 
        }
    });*/

    

    var sv = d3.select('svg#' + id + '-svg');
    if (sv.empty()) {
        drawline.data([line1Array])
            .attr('class', 'line')
            .style('stroke', color)
            .attr('d', line);
        drawline2.data([line2Array])
            .attr('class', 'line')
            .style('stroke', 'steelblue')
            .attr('d', line2);
    } else {
        drawline = svg.append('path')
            .data([line1Array])
            .attr('class', 'line')
            .style('stroke', color)
            .attr('d', line);
        drawline2 = svg.append('path')
            .data([line2Array])
            .attr('class', 'line')
            .style('stroke', 'steelblue')
            .attr('d', line2);
    }
    
    if (id == 'pm10') {
        svg.selectAll('.heading')
            .data([data])
            .enter().append('text')
            .attr('class', 'heading')
            .attr('transform', 'translate(' + (width / 2) + ', -10)')
            .style('text-anchor', 'middle').style('font-size', '12px').style('font-weight', 600)
            .text((d) => {
                return d[0].city.name + ' Station';
            });
    }

    /*svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 2.5)
        .attr("cx", (d) => { return x(d.dateTime); })
        .attr("cy", (d) => { 
            if (id == 'pm10') { return y(d.pm10); }
            else if (id == 'pm25') { return y(d.pm25); }
            else if (id == 'no2') { return y(d.no2); }
            else if (id == 'o3') { return y(d.o3); } 
        })
        .style('fill', color)
        .on("mouseover", (d) => {
            if (id == 'pm10') { 
                div.transition()
                    .duration(100)
                    .style("opacity", 1);
                div.html(
                    '<p><b>pm<sub>10</sub> Level: </b>' + d.pm10 + ' ug/m<sup>3</sup></p>'
                    + '<p><b>Time: </b>' + displayTime(d.time.s) + '</p>'
                    + '<p><b>Date: </b>' + displayDate(d.time.s) + '</p>'
                )
                .style("left", (d3.event.pageX + 28) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
            }
            else if (id == 'pm25') { 
                div.transition()
                    .duration(100)
                    .style("opacity", 1);
                div.html(
                    '<p><b>pm<sub>25</sub> Level: </b>' + d.pm25 + ' ug/m<sup>3</sup></p>'
                    + '<p><b>Time: </b>' + displayTime(d.time.s) + '</p>'
                    + '<p><b>Date: </b>' + displayDate(d.time.s) + '</p>'
                )
                .style("left", (d3.event.pageX + 28) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
            }
            else if (id == 'no2') { 
                div.transition()
                    .duration(100)
                    .style("opacity", 1);
                div.html(
                    '<p><b>no<sub>2</sub> Level: </b>' + d.no2 + ' ug/m<sup>3</sup></p>'
                    + '<p><b>Time: </b>' + displayTime(d.time.s) + '</p>'
                    + '<p><b>Date: </b>' + displayDate(d.time.s) + '</p>'
                )
                .style("left", (d3.event.pageX + 28) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
            }
            else if (id == 'o3') {
                div.transition()
                    .duration(100)
                    .style("opacity", 1);
                div.html(
                    '<p><b>o<sub>3</sub> Level: </b>' + d.o3 + ' ug/m<sup>3</sup></p>'
                    + '<p><b>Time: </b>' + displayTime(d.time.s) + '</p>'
                    + '<p><b>Date: </b>' + displayDate(d.time.s) + '</p>'
                )
                .style("left", (d3.event.pageX + 28) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
            }
        })
        .on("mouseout", (d) => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    var legend = svg.selectAll('.legends')
        .data(labels)
        .enter().append('g')
        .attr("class", "legends")
        .attr('transform', 'translate(10, ' + (height + margin.top + 10) + ')');
    legend.append('rect')
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color);
    legend.append('text')
        .attr("x", 20)
        .attr("y", 10)
        .text((d, i) => {
            if (id == 'pm10') { return 'pm10 (Particulate Matter 10 micrometers)'; }
            else if (id == 'pm25') { return 'pm25 (Particulate Matter 2.5 micrometers)'; }
            else if (id == 'no2') { return 'no2 (Nitrogen Dioxide)'; }
            else if (id == 'o3') { return 'o3 (Ground Level Ozone)'; } 
        })
        .attr("class", "textselected")
        .style("text-anchor", "start")
        .style("font-size", 12)
        .style('font-weight', 400);*/

    svg.append('g')
        .attr('transform', 'translate(0, ' + height + ')')
        .attr('class', 'x axis')
        .call(d3.axisBottom(x).ticks(3));

    svg.append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(y).ticks(3));
    
}

function comparisonData() {
    showLoader();
    setTimeout(() => {
        d3.json(url + stationId + '/air_quality', (error, data) => {
            if (error) throw error;

            hideLoader();
            d3.select('.calenderView').style('display', 'block');
            let historicalData = removeDuplicates(data.air_quality, 'aqi');
            
            let fetchHistoricalDates, historicalDatesArr, historicalStartFullDate, historicalEndFullDate;
            fetchHistoricalDates = document.getElementById('historical-daterange').value;
            historicalDatesArr = fetchHistoricalDates.split(' - ');
            historicalStartFullDate = historicalDatesArr[0];
            historicalEndFullDate = historicalDatesArr[1];
            let historicalStartDate = modifyCalenderDates(historicalStartFullDate);
            var historicalEndDate = modifyCalenderDates(historicalEndFullDate);

            let fetchCompareDates, compareDatesArr, compareStartFullDate, compareEndFullDate
            fetchCompareDates = document.getElementById('compare-daterange').value;
            compareDatesArr = fetchCompareDates.split(' - ');
            compareStartFullDate = compareDatesArr[0];
            compareEndFullDate = compareDatesArr[1];
            let compareStartDate = modifyCalenderDates(compareStartFullDate);
            let compareEndDate = modifyCalenderDates(compareEndFullDate);

            let h = [];
            h = historicalData.filter((d) => {
                let dateTimeArray = d.time.s.split(' ');
                if (dateTimeArray[0] >= historicalStartDate && dateTimeArray[0] <= historicalEndDate) {
                    let pm25;
                    if (d.iaqi.pm25) { 
                        pm25 = d.iaqi.pm25.v; 
                    } 
                    else { 
                        pm25 = 0; 
                    }
                    var t = {
                        'Date': dateTimeArray[0],
                        'pm25': pm25
                    }
                    return t;
                }
            });

            /*let weekData = d3.nest()
                .key((d) => { 
                    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    let date = new Date(d.time.s).getDate();
                    if (date < 10) { date = '0' + date; }
                    let month = new Date(d.time.s).getMonth();
                    return date + ' ' + monthNames[month];
                })
                .entries(historicalData);*/

            /*if (h[0].iaqi.hasOwnProperty('pm10')) {
                d3.select('svg#pm10-svg').remove();
                // console.log(weekData[0].values);
                createComparisonChart(h, 'pm10', 'steelblue');
            }*/
            if (h[0].iaqi.hasOwnProperty('pm25')) {
                d3.select('svg#pm25-svg').remove();
                let c = [];
                d3.csv('historical-data/2015/2015PM2.5.csv', (error, data) => {
                    if (error) throw error;

                    c = data.filter((d) => {
                        let dateArray = d.Datum;
                        if (dateArray >= compareStartDate && dateArray <= compareEndDate) {
                            return h.push(d);
                        }
                    });
                    createComparisonChart(h, 'pm25', 'red');
                });
            }  
            /*if (h[0].iaqi.hasOwnProperty('no2')) {
                d3.select('svg#no2-svg').remove();
                createComparisonChart(h, 'no2', 'green');
            }  
            if (h[0].iaqi.hasOwnProperty('o3')) {
                d3.select('svg#o3-svg').remove();
                createComparisonChart(h, 'o3', 'orange');
            }*/
        });
    }, 1000);
}