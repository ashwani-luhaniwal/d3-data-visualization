class CoCoCharts {

    constructor(element) {

        this.element = element;
    
        this.margin = { top: 20, right: 50, bottom: 70, left: 50 };
        this.width = this.element.clientWidth - this.margin.left - this.margin.right;
        this.height = this.element.clientHeight - this.margin.top - this.margin.bottom;
        this.dataL = 0;
        this.offset = 80;

        this.x = d3.scaleTime().range([0, this.width]);
        this.y = d3.scaleLinear().range([this.height, 0]);

        this.labels = ["pm10", "pm25", "no2", "o3"]
        // this.color = ['steelblue', 'red', 'green', 'orange']
        this.formatDay = d3.timeFormat('%d');
        this.formatMonth = d3.timeFormat('%B');
        this.formatYear = d3.timeFormat('%Y');
        this.timeFormat = d3.timeParse('%Y-%m-%d %H:%M:%S');
        this.hourTimeFormat = d3.timeParse('%m-%d %H:%M:%S');

        // this.drawline; 
        // this.drawline2;
        this.url = 'http://cocopuff.va11y.com/station/data/'; 
        this.stationId = '5a5b9886c9310903066bfaa4';

    }
  
    loadInitialChartData() {
      d3.queue()
          .defer(d3.json, this.url + this.stationId + '/air_quality')
          .defer(d3.json, this.url + this.stationId + '/traffic')
          .defer(d3.csv, 'historical-data/2015/2015PM2.5.csv')
          .await((error, air_quality, traffic, historical_2015_pm25) => {
                let that = this;
                that.globalAirQuality = air_quality;
                that.globalTrafficData = traffic;
                that.globalHistorical_2015_pm25 = historical_2015_pm25;

                let airQualityData = that.removeDuplicates(that.globalAirQuality.air_quality, 'aqi');
                let reverseTrafficData = that.globalTrafficData.traffic.reverse();
                let trafficData = reverseTrafficData.filter(d => {
                    if (d.created_at) {
                        return d;
                    }
                });
        
                let initialCoCoPuffData = that.removeDuplicates(that.globalAirQuality.air_quality, 'aqi');
                reverseTrafficData.filter(d => {
                    if (d.created_at) {
                        initialCoCoPuffData.push(d);
                    }
                });

                var dataByDate = d3.nest()
                    .key(function(d) { 
                        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        let date, month;
                        date = new Date(d.time.s).getDate();
                        if (date < 10) { date = '0' + date; }
                        month = new Date(d.time.s).getMonth();
                        return date + ' ' + monthNames[month];
                    })
                    .entries(airQualityData);

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

                            const charts = Array.from(document.querySelectorAll('.chart'))
                            for(const element of charts){
                                const chart_element = element.querySelector('.chartSvg')
                                that.element = chart_element;
                                if (d.values[0].iaqi.hasOwnProperty('pm10') && that.element.getAttribute('label') == 'pm10') {
                                    d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
                                    let currentDay = d.values[0].time.s.split(' ');
                                    let trafficDayData = reverseTrafficData.filter(d => {
                                        if (d.created_at) {
                                            let currentTrafficDay = d.created_at.split('T');
                                            if (currentDay[0] === currentTrafficDay[0]) {
                                                return d;
                                            }
                                        }
                                    });
                                    that.createAirTrafficChart(d.values, trafficDayData, initialCoCoPuffData, that.element);
                                }
                                if (d.values[0].iaqi.hasOwnProperty('pm25') && that.element.getAttribute('label') == 'pm25') {
                                    d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
                                    let currentDay = d.values[0].time.s.split(' ');
                                    let trafficDayData = reverseTrafficData.filter(d => {
                                        if (d.created_at) {
                                            let currentTrafficDay = d.created_at.split('T');
                                            if (currentDay[0] === currentTrafficDay[0]) {
                                                return d;
                                            }
                                        }
                                    });
                                    that.createAirTrafficChart(d.values, trafficDayData, initialCoCoPuffData, that.element);
                                }
                                if (d.values[0].iaqi.hasOwnProperty('no2') && that.element.getAttribute('label') == 'no2') {
                                    d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
                                    let currentDay = d.values[0].time.s.split(' ');
                                    let trafficDayData = reverseTrafficData.filter(d => {
                                        if (d.created_at) {
                                            let currentTrafficDay = d.created_at.split('T');
                                            if (currentDay[0] === currentTrafficDay[0]) {
                                                return d;
                                            }
                                        }
                                    });
                                    that.createAirTrafficChart(d.values, trafficDayData, initialCoCoPuffData, that.element);
                                }
                                if (d.values[0].iaqi.hasOwnProperty('o3') && that.element.getAttribute('label') == 'o3') {
                                    d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
                                    let currentDay = d.values[0].time.s.split(' ');
                                    let trafficDayData = reverseTrafficData.filter(d => {
                                        if (d.created_at) {
                                            let currentTrafficDay = d.created_at.split('T');
                                            if (currentDay[0] === currentTrafficDay[0]) {
                                                return d;
                                            }
                                        }
                                    });
                                    that.createAirTrafficChart(d.values, trafficDayData, initialCoCoPuffData, that.element);
                                }
                            }
                        });

                var currentAirData = airQualityData.splice(0, 18);
                var currentTrafficData = trafficData.splice(0, 900);

                if (currentAirData[0].iaqi.hasOwnProperty('pm10') && that.element.getAttribute('label') == 'pm10') {
                    d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
                    that.createAirTrafficChart(currentAirData, currentTrafficData, initialCoCoPuffData, that.element); 
                }     
                if (currentAirData[0].iaqi.hasOwnProperty('pm25') && that.element.getAttribute('label') == 'pm25') {
                    d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
                    that.createAirTrafficChart(currentAirData, currentTrafficData, initialCoCoPuffData, that.element);
                }   
                if (currentAirData[0].iaqi.hasOwnProperty('no2') && that.element.getAttribute('label') == 'no2') {
                    d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
                    that.createAirTrafficChart(currentAirData, currentTrafficData, initialCoCoPuffData, that.element);
                } 
                if (currentAirData[0].iaqi.hasOwnProperty('o3') && that.element.getAttribute('label') == 'o3') {
                    d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
                    that.createAirTrafficChart(currentAirData, currentTrafficData, initialCoCoPuffData, that.element);
                } 
                // that.createAirTrafficChart(currentAirData, currentTrafficData, initialCoCoPuffData, that.element);

            });
    }
  
    createAirTrafficChart(airData, trafficData, fullData, element) {
        let that = this;
        let color, drawline1, drawline2;

        if (that.element.getAttribute('label') == 'pm10') {
            color = 'steelblue';
        }
        else if (that.element.getAttribute('label') == 'pm25') {
            color = 'red';
        }
        else if (that.element.getAttribute('label') == 'no2') {
            color = 'green';
        }
        else if (that.element.getAttribute('label') == 'o3') {
            color = 'orange';
        }

        let line1 = d3.line()
            .x((d) => { return that.x(d.dateTime); })
            .y((d) => {
                if (element.getAttribute('label') == 'pm10') { return that.y(d.pm10); }
                else if (element.getAttribute('label') == 'pm25') { return that.y(d.pm25); }
                else if (element.getAttribute('label') == 'no2') { return that.y(d.no2); }
                else if (element.getAttribute('label') == 'o3') { return that.y(d.o3); } 
            });
    
        let line2 = d3.line()
            .x((d) => { return that.x(d.dateTime); })
            .y((d) => {
                if (element.getAttribute('label') == 'pm10') { return that.y(d.flowSegmentData.currentSpeed); }
                else if (element.getAttribute('label') == 'pm25') { return that.y(d.flowSegmentData.currentSpeed); }
                else if (element.getAttribute('label') == 'no2') { return that.y(d.flowSegmentData.currentSpeed); }
                else if (element.getAttribute('label') == 'o3') { return that.y(d.flowSegmentData.currentSpeed); }
            });
    
        let svg = d3.select(element)
            .append('svg')
                .attr('width', that.width + that.margin.left + that.margin.right)
                .attr('height', that.height + that.margin.top + that.margin.bottom)
                .attr('id', element.getAttribute('label') + '-svg')
            .append('g')
                .attr('transform', 'translate(' + that.margin.left + ', ' + that.margin.top + ')');
    
        var div = d3.select("body").append("div")   
            .attr("class", "tooltip")               
            .style("opacity", 0);
    
        airData.forEach(d => {
            d.dateTime = that.timeFormat(d.time.s);
            if (element.getAttribute('label') == 'pm10') { 
                if (d.iaqi.pm10) { d.pm10 = +d.iaqi.pm10.v; } 
                else { d.pm10 = +0; }
            }
            if (element.getAttribute('label') == 'pm25') {
                if (d.iaqi.pm25) { d.pm25 = +d.iaqi.pm25.v; } 
                else { d.pm25 = +0; }
            }
            if (element.getAttribute('label') == 'no2') { 
                if (d.iaqi.no2) { d.no2 = +d.iaqi.no2.v; } 
                else { d.no2 = +0; }
            }
            if (element.getAttribute('label') == 'o3') { 
                if (d.iaqi.o3) { d.o3 = +d.iaqi.o3.v; } 
                else { d.o3 = +0; }
            }
        });
        
        trafficData.forEach(d => {
            let createdDate = d.created_at.split('T');
            let createdTime = createdDate[1].split('.');
            d.dateTime = that.timeFormat(createdDate[0] + ' ' + createdTime[0]);
    
            if (element.getAttribute('label') == 'pm10' && d.flowSegmentData.currentSpeed) {
                if (d.flowSegmentData.currentSpeed < 0) { d.Essingeleden = +0; }
                else { d.flowSegmentData.currentSpeed = +d.flowSegmentData.currentSpeed; }
            }
            if (element.getAttribute('label') == 'pm25' && d.flowSegmentData.currentSpeed) {
                if (d.flowSegmentData.currentSpeed < 0) { d.Essingeleden = +0; }
                else { d.flowSegmentData.currentSpeed = +d.flowSegmentData.currentSpeed; }
            }
            if (element.getAttribute('label') == 'no2' && d.flowSegmentData.currentSpeed) {
                if (d.flowSegmentData.currentSpeed < 0) { d.Essingeleden = +0; }
                else { d.flowSegmentData.currentSpeed = +d.flowSegmentData.currentSpeed; }
            }
            if (element.getAttribute('label') == 'o3' && d.flowSegmentData.currentSpeed) {
                if (d.flowSegmentData.currentSpeed < 0) { d.Essingeleden = +0; }
                else { d.flowSegmentData.currentSpeed = +d.flowSegmentData.currentSpeed; }
            }
        });
    
        that.x.domain(d3.extent(trafficData, (d) => { return d.dateTime; }));
        that.y.domain([0, d3.max(fullData, d => {
            let measurementArray = [];
            if (d.iaqi && d.pm10) {
                measurementArray.push(d.pm10);
            }
            if (d.created_at && d.flowSegmentData.currentSpeed) {
                measurementArray.push(d.flowSegmentData.currentSpeed);
            }
            if (element.getAttribute('label') == 'pm10') { 
                return Math.max(...measurementArray); 
            }
            if (element.getAttribute('label') == 'pm25') { 
                return Math.max(...measurementArray); 
            }
            if (element.getAttribute('label') == 'no2') { 
                return Math.max(...measurementArray); 
            }
            if (element.getAttribute('label') == 'o3') { 
                return Math.max(...measurementArray); 
            }
        })]);
    
        var sv = d3.select('svg#' + element.getAttribute('label') + '-svg');
        if (sv.empty()) {
            drawline1.data([airData])
                .attr('class', 'line')
                .style('stroke', color)
                .attr('d', line1);
            drawline2.data([trafficData])
                .attr('class', 'line')
                .style('stroke', 'grey')
                .attr('d', line2);
        } else {
            drawline1 = svg.append('path')
                .data([airData])
                .attr('class', 'line')
                .style('stroke', color)
                .attr('d', line1);
            drawline2 = svg.append('path')
                .data([trafficData])
                .attr('class', 'line')
                .style('stroke', 'grey')
                .attr('d', line2);
        }
        
        if (element.getAttribute('label') == 'pm10') {
            svg.selectAll('.heading')
                .data([airData])
                .enter().append('text')
                .attr('class', 'heading')
                .attr('transform', 'translate(' + (that.width / 2) + ', -10)')
                .style('text-anchor', 'middle').style('font-size', '12px').style('font-weight', 600)
                .text((d) => {
                    return d[0].city.name + ' Station';
                });
        }
    
        svg.selectAll("dot")
            .data(airData)
            .enter().append("circle")
            .attr("r", 2.5)
            .attr("cx", (d) => { return that.x(d.dateTime); })
            .attr("cy", (d) => { 
                if (element.getAttribute('label') == 'pm10') { return that.y(d.pm10); }
                else if (element.getAttribute('label') == 'pm25') { return that.y(d.pm25); }
                else if (element.getAttribute('label') == 'no2') { return that.y(d.no2); }
                else if (element.getAttribute('label') == 'o3') { return that.y(d.o3); } 
            })
            .style('fill', color)
            .on("mouseover", (d) => {
                if (element.getAttribute('label') == 'pm10') { 
                    div.transition()
                        .duration(100)
                        .style("opacity", 1);
                    div.html(
                        '<p><b>pm<sub>10</sub> Level: </b>' + d.pm10 + ' ug/m<sup>3</sup></p>'
                        + '<p><b>Time: </b>' + that.displayTime(d.time.s) + '</p>'
                        + '<p><b>Date: </b>' + that.displayDate(d.time.s) + '</p>'
                    )
                    .style("left", (d3.event.pageX + 28) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
                }
                else if (element.getAttribute('label') == 'pm25') { 
                    div.transition()
                        .duration(100)
                        .style("opacity", 1);
                    div.html(
                        '<p><b>pm<sub>25</sub> Level: </b>' + d.pm25 + ' ug/m<sup>3</sup></p>'
                        + '<p><b>Time: </b>' + that.displayTime(d.time.s) + '</p>'
                        + '<p><b>Date: </b>' + that.displayDate(d.time.s) + '</p>'
                    )
                    .style("left", (d3.event.pageX + 28) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
                }
                else if (element.getAttribute('label') == 'no2') { 
                    div.transition()
                        .duration(100)
                        .style("opacity", 1);
                    div.html(
                        '<p><b>no<sub>2</sub> Level: </b>' + d.no2 + ' ug/m<sup>3</sup></p>'
                        + '<p><b>Time: </b>' + that.displayTime(d.time.s) + '</p>'
                        + '<p><b>Date: </b>' + that.displayDate(d.time.s) + '</p>'
                    )
                    .style("left", (d3.event.pageX + 28) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
                }
                else if (element.getAttribute('label') == 'o3') {
                    div.transition()
                        .duration(100)
                        .style("opacity", 1);
                    div.html(
                        '<p><b>o<sub>3</sub> Level: </b>' + d.o3 + ' ug/m<sup>3</sup></p>'
                        + '<p><b>Time: </b>' + that.displayTime(d.time.s) + '</p>'
                        + '<p><b>Date: </b>' + that.displayDate(d.time.s) + '</p>'
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
            .data(that.labels)
            .enter().append('g')
            .attr("class", "legends")
            .attr('transform', 'translate(10, ' + (that.height + that.margin.top + 10) + ')');
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
                if (element.getAttribute('label') == 'pm10') { return 'pm10 (Particulate Matter 10 micrometers)'; }
                else if (element.getAttribute('label') == 'pm25') { return 'pm25 (Particulate Matter 2.5 micrometers)'; }
                else if (element.getAttribute('label') == 'no2') { return 'no2 (Nitrogen Dioxide)'; }
                else if (element.getAttribute('label') == 'o3') { return 'o3 (Ground Level Ozone)'; } 
            })
            .attr("class", "textselected")
            .style("text-anchor", "start")
            .style("font-size", 12)
            .style('font-weight', 400);
    
        var legend2 = svg.selectAll('.legends2')
            .data(that.labels)
            .enter().append('g')
            .attr("class", "legends2")
            .attr('transform', 'translate(10, ' + (that.height + that.margin.top + 30) + ')');
        legend2.append('rect')
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", 'grey');
        legend2.append('text')
            .attr("x", 20)
            .attr("y", 10)
            .text((d, i) => {
                if (element.getAttribute('label') == 'pm10') { return 'current traffic speed'; }
                else if (element.getAttribute('label') == 'pm25') { return 'current traffic speed'; }
                else if (element.getAttribute('label') == 'no2') { return 'current traffic speed'; }
                else if (element.getAttribute('label') == 'o3') { return 'current traffic speed'; } 
            })
            .attr("class", "textselected")
            .style("text-anchor", "start")
            .style("font-size", 12)
            .style('font-weight', 400);
    
        svg.append('g')
            .attr('transform', 'translate(0, ' + that.height + ')')
            .attr('class', 'x axis')
            .call(d3.axisBottom(that.x).ticks(3));
    
        svg.append('g')
            .attr('class', 'y axis')
            .call(d3.axisLeft(that.y).ticks(3));
    }

    realTimeData(element) {
        let that = this;
        that.element = element;
        let airQualityData = that.removeDuplicates(that.globalAirQuality.air_quality, 'aqi');
        let reverseTrafficData = that.globalTrafficData.traffic.reverse();
        let trafficData = reverseTrafficData.filter(d => {
            if (d.created_at) {
                return d;
            }
        });
    
        let CoCoPuffData = that.removeDuplicates(that.globalAirQuality.air_quality, 'aqi');
        reverseTrafficData.filter(d => {
            if (d.created_at) {
                CoCoPuffData.push(d);
            }
        });
    
        var currentAirData = airQualityData.splice(0, 18);
        var currentTrafficData = trafficData.splice(0, 900);

        if (airQualityData[0].iaqi.hasOwnProperty('pm10') && that.element.getAttribute('label') == 'pm10') {
            d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
            that.createAirTrafficChart(currentAirData, currentTrafficData, CoCoPuffData, that.element); 
        }     
        if (airQualityData[0].iaqi.hasOwnProperty('pm25') && that.element.getAttribute('label') == 'pm25') {
            d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
            that.createAirTrafficChart(currentAirData, currentTrafficData, CoCoPuffData, that.element);
        }   
        if (airQualityData[0].iaqi.hasOwnProperty('no2') && that.element.getAttribute('label') == 'no2') {
            d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
            that.createAirTrafficChart(currentAirData, currentTrafficData, CoCoPuffData, that.element);
        } 
        if (airQualityData[0].iaqi.hasOwnProperty('o3') && that.element.getAttribute('label') == 'o3') {
            d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
            that.createAirTrafficChart(currentAirData, currentTrafficData, CoCoPuffData, that.element);
        }  
    }

    getWeeklyData(element) {
        let that = this;
        that.element = element;
        let airQualityData = that.removeDuplicates(that.globalAirQuality.air_quality, 'aqi');
        let reverseTrafficData = that.globalTrafficData.traffic.reverse();
        let trafficData = reverseTrafficData.filter(d => {
            if (d.created_at) {
                return d;
            }
        });
    
        let CoCoPuffData = that.removeDuplicates(that.globalAirQuality.air_quality, 'aqi');
        reverseTrafficData.filter(d => {
            if (d.created_at) {
                CoCoPuffData.push(d);
            }
        });
    
        let weekData = d3.nest()
            .key((d) => { 
                let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let date = new Date(d.time.s).getDate();
                if (date < 10) { date = '0' + date; }
                let month = new Date(d.time.s).getMonth();
                return date + ' ' + monthNames[month];
            })
            .entries(airQualityData);
    
        if (!d3.select('#current-day').classed('active')) {
            d3.select(".active").classed("active", false);
            d3.select('#current-day').classed('active', true);
        }

        
    
        if (weekData[0].values[0].iaqi.hasOwnProperty('pm10') && that.element.getAttribute('label') == 'pm10') {
            d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
            let currentDay = weekData[0].values[0].time.s.split(' ');
            let trafficDayData = trafficData.filter(d => {
                if (d.created_at) {
                    let currentTrafficDay = d.created_at.split('T');
                    if (currentDay[0] === currentTrafficDay[0]) {
                        return d;
                    }
                }
            });
            that.createAirTrafficChart(weekData[0].values, trafficDayData, CoCoPuffData, that.element);
        }
        if (weekData[0].values[0].iaqi.hasOwnProperty('pm25') && that.element.getAttribute('label') == 'pm25') {
            d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
            let currentDay = weekData[0].values[0].time.s.split(' ');
            let trafficDayData = trafficData.filter(d => {
                if (d.created_at) {
                    let currentTrafficDay = d.created_at.split('T');
                    if (currentDay[0] === currentTrafficDay[0]) {
                        return d;
                    }
                }
            });
            that.createAirTrafficChart(weekData[0].values, trafficDayData, CoCoPuffData, that.element);
        }   
        if (weekData[0].values[0].iaqi.hasOwnProperty('no2') && that.element.getAttribute('label') == 'no2') {
            d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
            let currentDay = weekData[0].values[0].time.s.split(' ');
            let trafficDayData = trafficData.filter(d => {
                if (d.created_at) {
                    let currentTrafficDay = d.created_at.split('T');
                    if (currentDay[0] === currentTrafficDay[0]) {
                        return d;
                    }
                }
            });
            that.createAirTrafficChart(weekData[0].values, trafficDayData, CoCoPuffData, that.element);
        }  
        if (weekData[0].values[0].iaqi.hasOwnProperty('o3') && that.element.getAttribute('label') == 'o3') {
            d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
            let currentDay = weekData[0].values[0].time.s.split(' ');
            let trafficDayData = trafficData.filter(d => {
                if (d.created_at) {
                    let currentTrafficDay = d.created_at.split('T');
                    if (currentDay[0] === currentTrafficDay[0]) {
                        return d;
                    }
                }
            });
            that.createAirTrafficChart(weekData[0].values, trafficDayData, CoCoPuffData, that.element);
        }
    }

    comparisonCharts(airQuality, trafficData, historicalData, cocopuffData, element) {

        let that = this;
        let color, drawline, drawline2, drawline3;

        if (element.getAttribute('label') == 'pm10') {
            color = 'steelblue';
        }
        else if (element.getAttribute('label') == 'pm25') {
            color = 'red';
        }
        else if (element.getAttribute('label') == 'no2') {
            color = 'green';
        }
        else if (element.getAttribute('label') == 'o3') {
            color = 'orange';
        }

        let line = d3.line()
            .x((d) => { return that.x(d.dateTime); })
            .y((d) => {
                if (element.getAttribute('label') == 'pm10') { return that.y(d.pm10); }
                if (element.getAttribute('label') == 'pm25') { return that.y(d.pm25); }
                if (element.getAttribute('label') == 'no2') { return that.y(d.no2); }
                if (element.getAttribute('label') == 'o3') { return that.y(d.o3); } 
            });
    
        let line2 = d3.line()
            .x((d) => { return that.x(d.dateTime); })
            .y((d) => {
                if (element.getAttribute('label') == 'pm10') { return that.y(d.Essingeleden); }
                if (element.getAttribute('label') == 'pm25') { return that.y(d.Essingeleden); }
                if (element.getAttribute('label') == 'no2') { return that.y(d.Essingeleden); }
                if (element.getAttribute('label') == 'o3' && d.Essingeleden) { return that.y(d.Essingeleden); }
            });
    
        let line3 = d3.line()
            .x((d) => { return that.x(d.dateTime); })
            .y((d) => {
                if (element.getAttribute('label') == 'pm10') { return that.y(d.flowSegmentData.currentSpeed); }
                if (element.getAttribute('label') == 'pm25') { return that.y(d.flowSegmentData.currentSpeed); }
                if (element.getAttribute('label') == 'no2') { return that.y(d.flowSegmentData.currentSpeed); }
                if (element.getAttribute('label') == 'o3') { return that.y(d.flowSegmentData.currentSpeed); }
            });
    
        let svg = d3.select(element)
            .append('svg')
                .attr('width', that.width + that.margin.left + that.margin.right)
                .attr('height', that.height + that.margin.top + that.margin.bottom)
                .attr('id', element.getAttribute('label') + '-svg')
            .append('g')
                .attr('transform', 'translate(' + that.margin.left + ', ' + that.margin.top + ')');
    
        var div = d3.select("body").append("div")   
            .attr("class", "tooltip")               
            .style("opacity", 0);
    
        airQuality.forEach(d => {
            let timeArr = d.time.s.split(' ');
            let dateArr = timeArr[0].split('-');
            let newDate = dateArr[1] + '-' + dateArr[2];
            d.dateTime = that.hourTimeFormat(newDate + ' ' + timeArr[1]);
    
            if (element.getAttribute('label') == 'pm10') { 
                if (d.iaqi.pm10) { d.pm10 = +d.iaqi.pm10.v; } 
                else { d.pm10 = +0; }
            }
            if (element.getAttribute('label') == 'pm25') {
                if (d.iaqi.pm25) { d.pm25 = +d.iaqi.pm25.v; } 
                else { d.pm25 = +0; }
            }
            if (element.getAttribute('label') == 'no2') { 
                if (d.iaqi.no2) { d.no2 = +d.iaqi.no2.v; } 
                else { d.no2 = +0; }
            }
            if (element.getAttribute('label') == 'o3') { 
                if (d.iaqi.o3) { d.o3 = +d.iaqi.o3.v; } 
                else { d.o3 = +0; }
            }
        });
    
        trafficData.forEach(d => {
            let timeArr = d.created_at.split('T');
            let dateArr = timeArr[0].split('-');
            let newDate = dateArr[1] + '-' + dateArr[2];
            let createdTime = timeArr[1].split('.');
            d.dateTime = that.hourTimeFormat(newDate + ' ' + createdTime[0]);
    
            if (element.getAttribute('label') == 'pm10' && d.flowSegmentData.currentSpeed) {
                if (d.flowSegmentData.currentSpeed < 0) { d.flowSegmentData.currentSpeed = +0; }
                else { d.flowSegmentData.currentSpeed = +d.flowSegmentData.currentSpeed; }
            }
            if (element.getAttribute('label') == 'pm25' && d.flowSegmentData.currentSpeed) {
                if (d.flowSegmentData.currentSpeed < 0) { d.flowSegmentData.currentSpeed = +0; }
                else { d.flowSegmentData.currentSpeed = +d.flowSegmentData.currentSpeed; }
            }
            if (element.getAttribute('label') == 'no2' && d.flowSegmentData.currentSpeed) {
                if (d.flowSegmentData.currentSpeed < 0) { d.flowSegmentData.currentSpeed = +0; }
                else { d.flowSegmentData.currentSpeed = +d.flowSegmentData.currentSpeed; }
            }
            if (element.getAttribute('label') == 'o3' && d.flowSegmentData.currentSpeed) {
                if (d.flowSegmentData.currentSpeed < 0) { d.flowSegmentData.currentSpeed = +0; }
                else { d.flowSegmentData.currentSpeed = +d.flowSegmentData.currentSpeed; }
            }
        });
    
        historicalData.forEach(d => {
            let datArr = d.Datum.split('-');
            let datTimString = datArr[1] + '-' + datArr[2];
            d.dateTime = that.hourTimeFormat(datTimString + ' ' + d.Kl + ':00');
    
            if (element.getAttribute('label') == 'pm10' && d.Essingeleden) {
                if (d.Essingeleden < 0) { d.Essingeleden = +0; }
                else { d.Essingeleden = +d.Essingeleden; }
            }
            if (element.getAttribute('label') == 'pm25' && d.Essingeleden) {
                if (d.Essingeleden < 0) { d.Essingeleden = +0; }
                else { d.Essingeleden = +d.Essingeleden; }
            }
            if (element.getAttribute('label') == 'no2' && d.Essingeleden) {
                if (d.Essingeleden < 0) { d.Essingeleden = +0; }
                else { d.Essingeleden = +d.Essingeleden; }
            }
            if (element.getAttribute('label') == 'o3' && d.Essingeleden) {
                if (d.Essingeleden < 0) { d.Essingeleden = +0; }
                else { d.Essingeleden = +d.Essingeleden; }
            }
        });
    
        that.x.domain(d3.extent(trafficData, (d) => { 
            return d.dateTime;
        }));
    
        that.y.domain([0, d3.max(cocopuffData, d => {
            let measurementArray = [];
            if (d.iaqi && d.pm10) {
                measurementArray.push(d.pm10);
            }
            if (d.created_at && d.flowSegmentData.currentSpeed) {
                measurementArray.push(d.flowSegmentData.currentSpeed);
            }
            if (d.Datum && d.Essingeleden) {
                measurementArray.push(d.Essingeleden);
            }
            if (element.getAttribute('label') == 'pm10') { 
                return Math.max(...measurementArray); 
            }
            if (element.getAttribute('label') == 'pm25') { 
                return Math.max(...measurementArray); 
            }
            if (element.getAttribute('label') == 'no2') { 
                return Math.max(...measurementArray); 
            }
            if (element.getAttribute('label') == 'o3') { 
                return Math.max(...measurementArray); 
            }
        })]);
    
        var sv = d3.select('svg#' + element.getAttribute('label') + '-svg');
        if (sv.empty()) {
            drawline.data([airQuality])
                .attr('class', 'line')
                .style('stroke', color)
                .attr('d', line);
            drawline2.data([historicalData])
                .attr('class', 'line')
                .style('stroke', 'darkkhaki')
                .attr('d', line2);
            drawline3.data([trafficData])
                .attr('class', 'line')
                .style('stroke', 'grey')
                .attr('d', line3);
        } else {
            drawline = svg.append('path')
                .data([airQuality])
                .attr('class', 'line')
                .style('stroke', color)
                .attr('d', line);
            drawline2 = svg.append('path')
                .data([historicalData])
                .attr('class', 'line')
                .style('stroke', 'darkkhaki')
                .attr('d', line2);
            drawline3 = svg.append('path')
                .data([trafficData])
                .attr('class', 'line')
                .style('stroke', 'grey')
                .attr('d', line3);
        }
    
        let legend = svg.selectAll('.legends')
            .data(that.labels)
            .enter().append('g')
            .attr("class", "legends")
            .attr('transform', 'translate(10, ' + (that.height + that.margin.top + 10) + ')');
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
                if (element.getAttribute('label') == 'pm10') { return 'pm10 (Particulate Matter 10 micrometers)'; }
                else if (element.getAttribute('label') == 'pm25') { return 'pm25 (Particulate Matter 2.5 micrometers)'; }
                else if (element.getAttribute('label') == 'no2') { return 'no2 (Nitrogen Dioxide)'; }
                else if (element.getAttribute('label') == 'o3') { return 'o3 (Ground Level Ozone)'; } 
            })
            .attr("class", "textselected")
            .style("text-anchor", "start")
            .style("font-size", 12)
            .style('font-weight', 400);
    
        let legend2 = svg.selectAll('.legends2')
            .data(that.labels)
            .enter().append('g')
            .attr("class", "legends2")
            .attr('transform', 'translate(10, ' + (that.height + that.margin.top + 30) + ')');
        legend2.append('rect')
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", 'grey');
        legend2.append('text')
            .attr("x", 20)
            .attr("y", 10)
            .text((d, i) => {
                if (element.getAttribute('label') == 'pm10') { return 'current traffic speed'; }
                else if (element.getAttribute('label') == 'pm25') { return 'current traffic speed'; }
                else if (element.getAttribute('label') == 'no2') { return 'current traffic speed'; }
                else if (element.getAttribute('label') == 'o3') { return 'current traffic speed'; } 
            })
            .attr("class", "textselected")
            .style("text-anchor", "start")
            .style("font-size", 12)
            .style('font-weight', 400);
    
        svg.append('g')
            .attr('transform', 'translate(0, ' + that.height + ')')
            .attr('class', 'x axis')
            .call(d3.axisBottom(that.x).ticks(3));
    
        svg.append('g')
            .attr('class', 'y axis')
            .call(d3.axisLeft(that.y).ticks(3));
    }

    createComparisonCharts(element) {
        let that = this;
        let airQualityData = that.removeDuplicates(that.globalAirQuality.air_quality, 'aqi');
                
        let fetchHistoricalDates, historicalDatesArr, historicalStartFullDate, historicalEndFullDate;
        fetchHistoricalDates = document.getElementById('historical-daterange').value;
        historicalDatesArr = fetchHistoricalDates.split(' - ');
        historicalStartFullDate = historicalDatesArr[0];
        historicalEndFullDate = historicalDatesArr[1];
        let historicalStartDate = that.modifyCalenderDates(historicalStartFullDate);
        var historicalEndDate = that.modifyCalenderDates(historicalEndFullDate);
        var historicalTimeDiff = Math.abs(new Date(historicalEndFullDate).getTime() - new Date(historicalStartFullDate).getTime());
        var historicalDiffDays = Math.ceil(historicalTimeDiff / (1000 * 3600 * 24)); 
    
        let fetchCompareDates, compareDatesArr, compareStartFullDate, compareEndFullDate
        fetchCompareDates = document.getElementById('compare-daterange').value;
        compareDatesArr = fetchCompareDates.split(' - ');
        compareStartFullDate = compareDatesArr[0];
        compareEndFullDate = compareDatesArr[1];
        let compareStartDate = that.modifyCalenderDates(compareStartFullDate);
        let compareEndDate = that.modifyCalenderDates(compareEndFullDate);
        var compareTimeDiff = Math.abs(new Date(compareEndFullDate).getTime() - new Date(compareStartFullDate).getTime());
        var compareDiffDays = Math.ceil(compareTimeDiff / (1000 * 3600 * 24));
    
        let airQualityFilter = airQualityData.filter((d) => {
            let dateTimeArray = d.time.s.split(' ');
            if (dateTimeArray[0] >= historicalStartDate && dateTimeArray[0] <= historicalEndDate) {
                return d;
            }
        });
        let historicalFilter = that.globalHistorical_2015_pm25.filter((d) => {
            let dateArray = d.Datum;
            if (dateArray >= compareStartDate && dateArray <= compareEndDate) {
                return d;
            }
        });
        let trafficFilter = that.globalTrafficData.traffic.filter(d => {
            if (d.created_at) {
                let createdDate = d.created_at.split('T');
                if (createdDate[0] >= historicalStartDate && createdDate[0] <= historicalEndDate) {
                    return d;
                }
            }
        });
    
        let filteredCoCoPuffData = airQualityData.filter((d) => {
            let dateTimeArray = d.time.s.split(' ');
            if (dateTimeArray[0] >= historicalStartDate && dateTimeArray[0] <= historicalEndDate) {
                return d;
            }
        });
        that.globalTrafficData.traffic.filter(d => {
            if (d.created_at) {
                let createdDate = d.created_at.split('T');
                if (createdDate[0] >= historicalStartDate && createdDate[0] <= historicalEndDate) {
                    filteredCoCoPuffData.push(d);
                }
            }
        });
        that.globalHistorical_2015_pm25.filter((d) => {
            let dateArray = d.Datum;
            if (dateArray >= compareStartDate && dateArray <= compareEndDate) {
                filteredCoCoPuffData.push(d);
            }
        });
    
        if (airQualityData[0].iaqi.hasOwnProperty('pm10') && element.getAttribute('label') == 'pm10') {
            d3.select('svg#' + element.getAttribute('label') + '-svg').remove();
            that.comparisonCharts(airQualityFilter, trafficFilter, historicalFilter, filteredCoCoPuffData, element);
        }
        if (airQualityData[0].iaqi.hasOwnProperty('pm25') && element.getAttribute('label') == 'pm25') {
            d3.select('svg#' + element.getAttribute('label') + '-svg').remove();
            that.comparisonCharts(airQualityFilter, trafficFilter, historicalFilter, filteredCoCoPuffData, element);
        }
        if (airQualityData[0].iaqi.hasOwnProperty('no2') && element.getAttribute('label') == 'no2') {
            d3.select('svg#' + element.getAttribute('label') + '-svg').remove();
            that.comparisonCharts(airQualityFilter, trafficFilter, historicalFilter, filteredCoCoPuffData, element);
        }
        if (airQualityData[0].iaqi.hasOwnProperty('o3') && element.getAttribute('label') == 'o3') {
            d3.select('svg#' + element.getAttribute('label') + '-svg').remove();
            that.comparisonCharts(airQualityFilter, trafficFilter, historicalFilter, filteredCoCoPuffData, element);
        }
    }
  
    removeDuplicates(arr, key) {
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

    displayTime(date) {
        let hours = new Date(date).getHours(),
            minutes = new Date(date).getMinutes(),
            ampm = '';
        if (hours < 12) { ampm = 'AM'; } 
        else { ampm = 'PM'; }
        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;
        return hours + ':' + minutes + ' ' + ampm;
    }

    displayDate(d) {
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date = new Date(d).getDate();
        if (date < 10) { date = '0' + date; }
        let month = new Date(d).getMonth();
        let year = new Date(d).getFullYear();
        return date + ' ' + monthNames[month] + ', ' + year;
    }
    
    modifyCalenderDates(calenderFullDate) {
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
    
  }