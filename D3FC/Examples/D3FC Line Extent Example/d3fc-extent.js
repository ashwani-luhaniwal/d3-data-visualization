/**
 * ------------
 * d3fc-extent
 * ------------
 * Extends the D3 extent functionality (found in d3-array) to allow padding, multiple accessors and 
 * date support
 * 
 * --------------
 * Linear Extent
 * --------------
 * Calculates the extent of an array of data which can be used to set the range on a scale. Can also 
 * optionally pad the data in various ways as described below. Internally makes use of d3-array's min 
 * and max methods.
 */
import extentLinear from 'd3fc-extent';

const data = [{x: 1}, {x: 2}, {x: 4}, {x: 8}, {x: 16}];

const extent = extentLinear()
    .accessors([d => d.x])
    .pad([1, 4])
    .padUnit('domain');

extent(data);

/**
 * ------------
 * Date Extent
 * ------------
 * Calculates the extent of an array of data which can be used to set the range on a scale. Can also 
 * optionally pad the data in various ways as described below. Equivalent in functionality to linear 
 * but for Date values.
 */
import extentDate from 'd3fc-extent';

const data = [{x: new Date(2016, 0, 1)}, {x: new Date(2016, 0, 11)}];

const extent = extentDate()
    .accessors([d => d.x])
    .pad([0, 0.2]);

extent(data);