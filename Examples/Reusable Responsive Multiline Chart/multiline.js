function makeLineChart(dataset, xName, yObjs, axisLables) {
    var chartObj = {};
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    chartObj.xAxisLable = axisLables.xAxis;
    chartObj.yAxisLable = axisLables.yAxis;
    chartObj.data = dataset;
    chartObj.margin = {top: 15, right: 60, bottom: 30, left: 50};
    chartObj.width = 650 - chartObj.margin.left - chartObj.margin.right;
    chartObj.height = 480 - chartObj.margin.top - chartObj.margin.bottom;

    // so we can pass the x and y as strings when creating the function
    chartObj.xFunct = function(d) { 
        return d[xName]; 
    };

    // For each yObjs argument, create a yFunction
    function getYFn(column) {
        return function(d) {
            return d[column];
        };
    }

    // Object instead of array
    chartObj.yFuncts = [];
    for (var y in yObjs) {
        yObjs[y].name = y;
        yObjs[y].yFunct = getYFn(yObjs[y].column);  // Need this list for the ymax function
        chartObj.yFuncts.push(yObjs[y].yFunct);
    }

    // Formatter functions for the axes
    chartObj.formatAsNumber = d3.format('.0f');
    chartObj.formatAsDecimal = d3.format('.2f');
    chartObj.formatAsCurrency = d3.format('$.2f');
    chartObj.formatAsFloat = function(d) {
        if (d % 1 !== 0) {
            return d3.format('.2f')(d);
        } else {
            return d3.format('.0f')(d);
        }
    };

    
}