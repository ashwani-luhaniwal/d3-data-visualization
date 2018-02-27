let svgWidth = 800,
    svgHeight = 300,
    margin = { top: 30, right: 40, bottom: 50, left: 60 },
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom,
    originalCircle = { 'cx': -150, 'cy': -15, 'r': 20 };

let svgViewport = d3.select('body')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('background', 'red');

// create scale objects
let xAxisScale = d3.scaleLinear()
    .domain([-200, -100])
    .range([0, width]);

let yAxisScale = d3.scaleLinear()
    .domain([-10, -20])
    .range([height, 0]);

// create axis objects
let xAxis = d3.axisBottom(xAxisScale);
let yAxis = d3.axisLeft(yAxisScale);

// Zoom function 
let zoom = d3.zoom()
    .on('zoom', zoomFunction);

// Inner Drawing Space
let innerSpace = svgViewport.append('g')
    .attr('class', 'inner_space')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    .call(zoom);

// append some dummy data
let circles = innerSpace.append('circle')
    .attr('d', 'circles')
    .attr('cx', xAxisScale(originalCircle.cx))
    .attr('cy', yAxisScale(originalCircle.cy))
    .attr('r', originalCircle.r);

// Draw Axis
let gX = innerSpace.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxis);

let gY = innerSpace.append('g')
    .attr('class', 'axis axis--y')
    .call(yAxis);

// append zoom area
let view = innerSpace.append('rect')
    .attr('class', 'zoom')
    .attr('width', width)
    .attr('height', height)
    .call(zoom);

function zoomFunction() {
    // create new scale objects based on event
    let new_xScale = d3.event.transform.rescaleX(xAxisScale);
    let new_yScale = d3.event.transform.rescaleY(yAxisScale);
    console.log(d3.event.transform);

    // update the axes
    gX.call(xAxis.scale(new_xScale));
    gY.call(yAxis.scale(new_yScale));

    // update circle
    circles.attr('transform', d3.event.transform);
};