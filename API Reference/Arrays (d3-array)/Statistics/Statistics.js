/**
 * Array manipulation, ordering, searching, summarizing, etc.
 */

/**
 * -----------
 * Statistics
 * -----------
 * Methods for computing basic summary statistics.
 *      d3.min - compute the minimum value in an array.
 *      d3.max - compute the maximum value in an array.
 *      d3.extent - compute the minimum and maximum value in an array.
 *      d3.sum - compute the sum of an array of numbers.
 *      d3.mean - compute the arithmetic mean of an array of numbers.
 *      d3.median - compute the median of an array of numbers (the 0.5-quantile).
 *      d3.quantile - compute a quantile for a sorted array of numbers.
 *      d3.variance - compute the variance of an array of numbers.
 *      d3.deviation - compute the standard deviation of an array of numbers.
 * 
 * --------------------------
 * d3.min(array[, accessor])
 * --------------------------
 * Returns the minimum value in the given array using natural order. If the array is empty, returns 
 * undefined. An optional accessor function may be specified, which is equivalent to calling 
 * array.map(accessor) before computing the minimum value.
 * Unlike the built-in Math.min, this method ignores undefined, null and NaN values; this is useful for 
 * ignoring missing data. In addition, elements are compared using natural order rather than numeric 
 * order. For example, the minimum of the strings [“20”, “3”] is “20”, while the minimum of the 
 * numbers [20, 3] is 3.
 * 
 * --------------------------
 * d3.max(array[, accessor])
 * --------------------------
 * Returns the maximum value in the given array using natural order. If the array is empty, returns 
 * undefined. An optional accessor function may be specified, which is equivalent to calling 
 * array.map(accessor) before computing the maximum value.
 * Unlike the built-in Math.max, this method ignores undefined values; this is useful for ignoring missing 
 * data. In addition, elements are compared using natural order rather than numeric order. For example, 
 * the maximum of the strings [“20”, “3”] is “3”, while the maximum of the numbers [20, 3] is 20.
 * 
 * -----------------------------
 * d3.extent(array[, accessor])
 * -----------------------------
 * Returns the minimum and maximum value in the given array using natural order. If the array is empty, 
 * returns [undefined, undefined]. An optional accessor function may be specified, which is equivalent 
 * to calling array.map(accessor) before computing the extent.
 * 
 * --------------------------
 * d3.sum(array[, accessor])
 * --------------------------
 * Returns the sum of the given array of numbers. If the array is empty, returns 0. An optional accessor 
 * function may be specified, which is equivalent to calling array.map(accessor) before computing the 
 * sum. This method ignores undefined and NaN values; this is useful for ignoring missing data.
 * 
 * ---------------------------
 * d3.mean(array[, accessor])
 * ---------------------------
 * Returns the mean of the given array of numbers. If the array is empty, returns undefined. An optional 
 * accessor function may be specified, which is equivalent to calling array.map(accessor) before 
 * computing the mean. This method ignores undefined and NaN values; this is useful for ignoring missing 
 * data.
 * 
 * -----------------------------
 * d3.median(array[, accessor])
 * -----------------------------
 * Returns the median of the given array of numbers using the R-7 method. If the array is empty, returns 
 * undefined. An optional accessor function may be specified, which is equivalent to calling 
 * array.map(accessor) before computing the median. This method ignores undefined and NaN values; this 
 * is useful for ignoring missing data.
 * 
 * ----------------------------------
 * d3.quantile(array, p[, accessor])
 * ----------------------------------
 * Returns the p-quantile of the given sorted array of numbers, where p is a number in the range [0, 1]. 
 * For example, the median can be computed using p = 0.5, the first quartile at p = 0.25, and the third 
 * quartile at p = 0.75. This particular implementation uses the R-7 method, which is the default for 
 * the R programming language and Excel. For example:
 *      var a = [0, 10, 30];
 *      d3.quantile(a, 0); // 0
 *      d3.quantile(a, 0.5); // 10
 *      d3.quantile(a, 1); // 30
 *      d3.quantile(a, 0.25); // 5
 *      d3.quantile(a, 0.75); // 20
 *      d3.quantile(a, 0.1); // 2
 * An optional accessor function may be specified, which is equivalent to calling array.map(accessor) 
 * before computing the quantile.
 * 
 * -------------------------------
 * d3.variance(array[, accessor])
 * -------------------------------
 * Returns an unbiased estimator of the population variance of the given array of numbers. If the array 
 * has fewer than two values, returns undefined. An optional accessor function may be specified, which 
 * is equivalent to calling array.map(accessor) before computing the variance. This method ignores 
 * undefined and NaN values; this is useful for ignoring missing data.
 * 
 * --------------------------------
 * d3.deviation(array[, accessor])
 * --------------------------------
 * Returns the standard deviation, defined as the square root of the bias-corrected variance, of the 
 * given array of numbers. If the array has fewer than two values, returns undefined. An optional 
 * accessor function may be specified, which is equivalent to calling array.map(accessor) before 
 * computing the standard deviation. This method ignores undefined and NaN values; this is useful for 
 * ignoring missing data.
 */