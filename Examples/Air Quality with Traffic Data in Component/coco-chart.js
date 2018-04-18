class CoCoCharts {
  constructor(element) {
    this.element = element;

    const margin = { top: 20, right: 50, bottom: 70, left: 50 },
        width = this.element.clientWidth - margin.left - margin.right,
        height = this.element.clientHeight - margin.top - margin.bottom,
        dataL = 0,
        offset = 80;
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
  }

  loadInitialChartData() {
    d3.queue()
        .defer(d3.json, url + stationId + '/air_quality')
        .defer(d3.json, url + stationId + '/traffic')
        .await(initialChartData);
}

initialChartData(error, air_quality, traffic) {
    let airQualityData = removeDuplicates(air_quality.air_quality, 'aqi');
    let reverseTrafficData = traffic.traffic.reverse();
    let trafficData = reverseTrafficData.filter(d => {
        if (d.created_at) {
            return d;
        }
    });

    let initialCoCoPuffData = removeDuplicates(air_quality.air_quality, 'aqi');
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
    let last_seven_days = { }
    for(let item of dateByDate){
      last_seven_days[item] = {
        item,
        render(){ 
          d3.select(element).select('svg')
        }
      }
    }

    element.last_seven_days = last_seven_days

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
                    let currentDay = d.values[0].time.s.split(' ');
                    let trafficDayData = reverseTrafficData.filter(d => {
                        if (d.created_at) {
                            let currentTrafficDay = d.created_at.split('T');
                            if (currentDay[0] === currentTrafficDay[0]) {
                                return d;
                            }
                        }
                    });
                    createAirTrafficChart(d.values, trafficDayData, initialCoCoPuffData, 'pm10', 'steelblue'); 
                }
                if (d.values[0].iaqi.hasOwnProperty('pm25')) {
                    d3.select('svg#pm25-svg').remove();
                    let currentDay = d.values[0].time.s.split(' ');
                    let trafficDayData = reverseTrafficData.filter(d => {
                        if (d.created_at) {
                            let currentTrafficDay = d.created_at.split('T');
                            if (currentDay[0] === currentTrafficDay[0]) {
                                return d;
                            }
                        }
                    });
                    createAirTrafficChart(d.values, trafficDayData, initialCoCoPuffData, 'pm25', 'red');
                }
                if (d.values[0].iaqi.hasOwnProperty('no2')) {
                    d3.select('svg#no2-svg').remove();
                    let currentDay = d.values[0].time.s.split(' ');
                    let trafficDayData = reverseTrafficData.filter(d => {
                        if (d.created_at) {
                            let currentTrafficDay = d.created_at.split('T');
                            if (currentDay[0] === currentTrafficDay[0]) {
                                return d;
                            }
                        }
                    });
                    createAirTrafficChart(d.values, trafficDayData, initialCoCoPuffData, 'no2', 'green'); 
                }
                if (d.values[0].iaqi.hasOwnProperty('o3')) {
                    d3.select('svg#o3-svg').remove();
                    let currentDay = d.values[0].time.s.split(' ');
                    let trafficDayData = reverseTrafficData.filter(d => {
                        if (d.created_at) {
                            let currentTrafficDay = d.created_at.split('T');
                            if (currentDay[0] === currentTrafficDay[0]) {
                                return d;
                            }
                        }
                    });
                    createAirTrafficChart(d.values, trafficDayData, initialCoCoPuffData, 'o3', 'orange');
                }
            });

    var currentAirData = airQualityData.splice(0, 18);
    var currentTrafficData = trafficData.splice(0, 900);
    if (airQualityData[0].iaqi.hasOwnProperty('pm10')) 
        createAirTrafficChart(currentAirData, currentTrafficData, initialCoCoPuffData, 'pm10', 'steelblue');   
    if (initialCoCoPuffData[0].iaqi.hasOwnProperty('pm25'))
        createAirTrafficChart(currentAirData, currentTrafficData, initialCoCoPuffData, 'pm25', 'red');
    if (initialCoCoPuffData[0].iaqi.hasOwnProperty('no2'))
        createAirTrafficChart(currentAirData, currentTrafficData, initialCoCoPuffData, 'no2', 'green');
    if (initialCoCoPuffData[0].iaqi.hasOwnProperty('o3'))
        createAirTrafficChart(currentAirData, currentTrafficData, initialCoCoPuffData, 'o3', 'orange');
}

createAirTrafficChart(airData, trafficData, fullData, id, color) {
    let line1 = d3.line()
        .x((d) => { return x(d.dateTime); })
        .y((d) => {
            if (id == 'pm10') { return y(d.pm10); }
            else if (id == 'pm25') { return y(d.pm25); }
            else if (id == 'no2') { return y(d.no2); }
            else if (id == 'o3') { return y(d.o3); } 
        });

    let line2 = d3.line()
        .x((d) => { return x(d.dateTime); })
        .y((d) => {
            if (id == 'pm10') { return y(d.flowSegmentData.currentSpeed); }
            else if (id == 'pm25') { return y(d.flowSegmentData.currentSpeed); }
            else if (id == 'no2') { return y(d.flowSegmentData.currentSpeed); }
            else if (id == 'o3') { return y(d.flowSegmentData.currentSpeed); }
        });

    let svg = d3.select(element)
        .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('id', id + '-svg')
        .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    airData.forEach(d => {
        d.dateTime = timeFormat(d.time.s);
        if (id == 'pm10') { 
            if (d.iaqi.pm10) { d.pm10 = +d.iaqi.pm10.v; } 
            else { d.pm10 = +0; }
        }
        if (id == 'pm25') {
            if (d.iaqi.pm25) { d.pm25 = +d.iaqi.pm25.v; } 
            else { d.pm25 = +0; }
        }
        if (id == 'no2') { 
            if (d.iaqi.no2) { d.no2 = +d.iaqi.no2.v; } 
            else { d.no2 = +0; }
        }
        if (id == 'o3') { 
            if (d.iaqi.o3) { d.o3 = +d.iaqi.o3.v; } 
            else { d.o3 = +0; }
        }
    });
    
    trafficData.forEach(d => {
        let createdDate = d.created_at.split('T');
        let createdTime = createdDate[1].split('.');
        d.dateTime = timeFormat(createdDate[0] + ' ' + createdTime[0]);

        if (id == 'pm10' && d.flowSegmentData.currentSpeed) {
            if (d.flowSegmentData.currentSpeed < 0) { d.Essingeleden = +0; }
            else { d.flowSegmentData.currentSpeed = +d.flowSegmentData.currentSpeed; }
        }
        if (id == 'pm25' && d.flowSegmentData.currentSpeed) {
            if (d.flowSegmentData.currentSpeed < 0) { d.Essingeleden = +0; }
            else { d.flowSegmentData.currentSpeed = +d.flowSegmentData.currentSpeed; }
        }
        if (id == 'no2' && d.flowSegmentData.currentSpeed) {
            if (d.flowSegmentData.currentSpeed < 0) { d.Essingeleden = +0; }
            else { d.flowSegmentData.currentSpeed = +d.flowSegmentData.currentSpeed; }
        }
        if (id == 'o3' && d.flowSegmentData.currentSpeed) {
            if (d.flowSegmentData.currentSpeed < 0) { d.Essingeleden = +0; }
            else { d.flowSegmentData.currentSpeed = +d.flowSegmentData.currentSpeed; }
        }
    });

    x.domain(d3.extent(trafficData, (d) => { return d.dateTime; }));
    y.domain([0, d3.max(fullData, d => {
        let measurementArray = [];
        if (d.iaqi && d.pm10) {
            measurementArray.push(d.pm10);
        }
        if (d.created_at && d.flowSegmentData.currentSpeed) {
            measurementArray.push(d.flowSegmentData.currentSpeed);
        }
        if (id == 'pm10') { 
            return Math.max(...measurementArray); 
        }
        if (id == 'pm25') { 
            return Math.max(...measurementArray); 
        }
        if (id == 'no2') { 
            return Math.max(...measurementArray); 
        }
        if (id == 'o3') { 
            return Math.max(...measurementArray); 
        }
    })]);

    var sv = d3.select('svg#' + id + '-svg');
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
    
    if (id == 'pm10') {
        svg.selectAll('.heading')
            .data([airData])
            .enter().append('text')
            .attr('class', 'heading')
            .attr('transform', 'translate(' + (width / 2) + ', -10)')
            .style('text-anchor', 'middle').style('font-size', '12px').style('font-weight', 600)
            .text((d) => {
                return d[0].city.name + ' Station';
            });
    }

    svg.selectAll("dot")
        .data(airData)
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

    var legend2 = svg.selectAll('.legends2')
        .data(labels)
        .enter().append('g')
        .attr("class", "legends2")
        .attr('transform', 'translate(10, ' + (height + margin.top + 30) + ')');
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
            if (id == 'pm10') { return 'current traffic speed'; }
            else if (id == 'pm25') { return 'current traffic speed'; }
            else if (id == 'no2') { return 'current traffic speed'; }
            else if (id == 'o3') { return 'current traffic speed'; } 
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

  /**
   * Remove duplicates from the air quality json data
   * @param {*} arr 
   * @param {*} key 
   */
  _removeDuplicates(arr, key) {
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
  
  /**
   * Function to display time format
   * @param {*} date 
   */
  _displayTime(date) {
      let hours = new Date(date).getHours(),
          minutes = new Date(date).getMinutes(),
          ampm = '';
      if (hours < 12) { ampm = 'AM'; } 
      else { ampm = 'PM'; }
      if (hours < 10) hours = '0' + hours;
      if (minutes < 10) minutes = '0' + minutes;
      return hours + ':' + minutes + ' ' + ampm;
  }
  
  /**
   * Function to display date format
   * @param {*} d 
   */
  _displayDate(d) {
      let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let date = new Date(d).getDate();
      if (date < 10) { date = '0' + date; }
      let month = new Date(d).getMonth();
      let year = new Date(d).getFullYear();
      return date + ' ' + monthNames[month] + ', ' + year;
  }
  
  /**
   * Function to modify calender date ranges
   * @param {*} calenderFullDate 
   */
  _modifyCalenderDates(calenderFullDate) {
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