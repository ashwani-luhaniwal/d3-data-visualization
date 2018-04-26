class CoCoCharts {
  constructor(element) {
    this.element = element;
    this.host = 'http://cocopuff.org';
    this.stationId = '5a5b9886c9310903066bfaa4';
    this.timeFormat = d3.timeParse('%Y-%m-%d %H:%M:%S');
    
    this.margin = { top: 20, right: 50, bottom: 70, left: 50 };
    this.width = this.element.clientWidth - this.margin.left - this.margin.right;
    this.height = this.element.clientHeight - this.margin.top - this.margin.bottom;

    this.x = d3.scaleTime().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);

    // this.formatDay = d3.timeFormat('%d');
    // this.formatMonth = d3.timeFormat('%B');
    // this.formatYear = d3.timeFormat('%Y');
    
    // this.hourTimeFormat = d3.timeParse('%m-%d %H:%M:%S');
  }
  
  displayChart() {
    d3.queue()
      .defer(d3.json, this.host + '/station/data/' + this.stationId + '/air_quality')
      .defer(d3.json, this.host + '/station/data/' + this.stationId + '/traffic')
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

        let initialCoCoPuffData = airQualityData;
        reverseTrafficData.filter(d => {
            if (d.created_at) {
                initialCoCoPuffData.push(d);
            }
        });

        var currentAirData = airQualityData.splice(0, 18);
        var currentTrafficData = trafficData.splice(0, 900);

        if (currentAirData[0].iaqi.hasOwnProperty('pm10') && that.element.getAttribute('label') == 'pm10') {
          d3.select(that.element.childNodes).remove()
          // d3.select('svg#' + that.element.getAttribute('label') + '-svg').remove();
          that.createChart(currentAirData, that.element, 'steelblue'); 
        }     
        if (currentAirData[0].iaqi.hasOwnProperty('pm25') && that.element.getAttribute('label') == 'pm25') {
          d3.select(that.element.childNodes).remove()
          that.createChart(currentAirData, that.element, 'red');
        }   
        if (currentAirData[0].iaqi.hasOwnProperty('no2') && that.element.getAttribute('label') == 'no2') {
          d3.select(that.element.childNodes).remove()
          that.createChart(currentAirData, that.element, 'green');
        } 
        if (currentAirData[0].iaqi.hasOwnProperty('o3') && that.element.getAttribute('label') == 'o3') {
          d3.select(that.element.childNodes).remove()
          that.createChart(currentAirData, that.element, 'orange');
        }
        if (that.element.getAttribute('label') == 'traffic') {
          d3.select(that.element.childNodes).remove()
          that.createChart(currentTrafficData, that.element, 'grey');
        }
    });
  }
  
  createChart(chartData, element, color) {
    let that = this, 
      drawline,
      bisectDate = d3.bisector(function(d) { return d.date; }).left;

    let line = d3.line()
      .x((d) => { return that.x(d.dateTime); })
      .y((d) => {
        if (element.getAttribute('label') == 'pm10') { return that.y(d.pm10); }
        else if (element.getAttribute('label') == 'pm25') { return that.y(d.pm25); }
        else if (element.getAttribute('label') == 'no2') { return that.y(d.no2); }
        else if (element.getAttribute('label') == 'o3') { return that.y(d.o3); }
        else if (element.getAttribute('label') == 'traffic') { return that.y(d.flowSegmentData.currentSpeed); }
      });
    
    let svg = d3.select(element)
      .append('svg')
        .attr('width', that.width + that.margin.left + that.margin.right)
        .attr('height', that.height + that.margin.top + that.margin.bottom)
        .attr('id', element.getAttribute('label'))
      .append('g')
        .attr('transform', 'translate(' + that.margin.left + ', ' + that.margin.top + ')');
    
    var div = d3.select("body").append("div")   
      .attr("class", "tooltip")               
      .style("opacity", 0);
    
    chartData.forEach(d => {
      if (d.iaqi) {
        d.dateTime = that.timeFormat(d.time.s);
      }
      else if (d.created_at) {
        let createdDate = d.created_at.split('T');
        let createdTime = createdDate[1].split('.');
        d.dateTime = that.timeFormat(createdDate[0] + ' ' + createdTime[0]);
      }   
      if (element.getAttribute('label') == 'pm10' && d.iaqi.pm10) { 
          if (d.iaqi.pm10) { d.pm10 = +d.iaqi.pm10.v; } 
          else { d.pm10 = +0; }
      }
      if (element.getAttribute('label') == 'pm25' && d.iaqi.pm25) {
          if (d.iaqi.pm25) { d.pm25 = +d.iaqi.pm25.v; } 
          else { d.pm25 = +0; }
      }
      if (element.getAttribute('label') == 'no2' && d.iaqi.no2) { 
          if (d.iaqi.no2) { d.no2 = +d.iaqi.no2.v; } 
          else { d.no2 = +0; }
      }
      if (element.getAttribute('label') == 'o3' && d.iaqi.o3) { 
          if (d.iaqi.o3) { d.o3 = +d.iaqi.o3.v; } 
          else { d.o3 = +0; }
      }
      if (element.getAttribute('label') == 'traffic' && d.flowSegmentData.currentSpeed) {
        if (d.flowSegmentData.currentSpeed < 0) { d.flowSegmentData.currentSpeed = +0; }
        else { d.flowSegmentData.currentSpeed = +d.flowSegmentData.currentSpeed; }
      }
    });
    
    that.x.domain(d3.extent(chartData, (d) => { return d.dateTime }));
    that.y.domain([0, d3.max(chartData, (d) => { 
      if (element.getAttribute('label') == 'pm10' && d.iaqi && d.pm10) { return d.pm10 + 10 }
      else if (element.getAttribute('label') == 'pm25' && d.iaqi && d.pm25) { return d.pm25 + 10 }
      else if (element.getAttribute('label') == 'no2' && d.iaqi && d.no2) { return d.no2 + 10 }
      else if (element.getAttribute('label') == 'o3' && d.iaqi && d.o3) { return d.o3 + 10 }
      else if (element.getAttribute('label') == 'traffic' && d.created_at && d.flowSegmentData.currentSpeed) { return d.flowSegmentData.currentSpeed + 10 }
    })]);
    
    var sv = d3.select('svg#' + element.getAttribute('label'));
    if (sv.empty()) {
      drawline.data([chartData])
        .attr('class', 'line')
        .style('stroke', color)
        .attr('d', line);
    } else {
      drawline = svg.append('path')
        .data([chartData])
        .attr('class', 'line')
        .style('stroke', color)
        .attr('d', line);
    }

    var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("circle")
      .attr("r", 4.5);

    focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

    svg.append("rect")
      .attr("class", "overlay")
      .attr("width", that.width)
      .attr("height", that.height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

    function mousemove() {
      var x0 = that.x.invert(d3.mouse(this)[0]),
          i = bisectDate(chartData, x0, 1),
          d0 = chartData[i - 1],
          d1 = chartData[i];
          console.log(i);
          console.log(d0);
          // d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      // focus.attr("transform", "translate(" + that.x(d.date) + "," + that.y(d.close) + ")");
      // focus.select("text").text(formatCurrency(d.close));
    }
    
    /*svg.selectAll("dot")
      .data(chartData)
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
      });*/
    
    svg.append('g')
      .attr('transform', 'translate(0, ' + that.height + ')')
      .attr('class', 'x axis')
      .call(d3.axisBottom(that.x).ticks(4));
  
    svg.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(that.y).ticks(6));
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
}