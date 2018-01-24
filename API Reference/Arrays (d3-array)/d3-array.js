/**
 * ---------
 * d3-array
 * ---------
 * Data in JavaScript is often represented by an array, and so one tends to manipulate arrays when 
 * visualizing or analyzing data. Some common forms of manipulation include taking a contiguous slice 
 * (subset) of an array, filtering an array using a predicate function, and mapping an array to a 
 * parallel set of values using a transform function. Before looking at the set of utilities that this 
 * module provides, familiarize yourself with the powerful array methods built-in to JavaScript.
 * 
 * ----------------
 * Mutation Methos
 * ----------------
 * JavaScript includes mutation methods that modify the array:
 *      array.pop - Remove the last element from the array.
 *      array.push - Add one or more elements to the end of the array.
 *      array.reverse - Reverse the order of the elements of the array.
 *      array.shift - Remove the first element from the array.
 *      array.sort - Sort the elements of the array.
 *      array.splice - Add or remove elements from the array.
 *      array.unshift - Add one or more elements to the front of the array.
 * 
 * ---------------
 * Access Methods
 * ---------------
 * There are also access methods that return some representation of the array:
 *      array.concat - Join the array with other array(s) or value(s).
 *      array.join - Join all elements of the array into a string.
 *      array.slice - Extract a section of the array.
 *      array.indexOf - Find the first occurrence of a value within the array.
 *      array.lastIndexOf - Find the last occurrence of a value within the array.
 * 
 * ------------------
 * Iteration Methods
 * ------------------
 * iteration methods that apply functions to elements in the array:
 *      array.filter - Create a new array with only the elements for which a predicate is true.
 *      array.forEach - Call a function for each element in the array.
 *      array.every - See if every element in the array satisfies a predicate.
 *      array.map - Create a new array with the result of calling a function on every element in the array.
 *      array.some - See if at least one element in the array satisfies a predicate.
 *      array.reduce - Apply a function to reduce the array to a single value (from left-to-right).
 *      array.reduceRight - Apply a function to reduce the array to a single value (from right-to-left).
 */
