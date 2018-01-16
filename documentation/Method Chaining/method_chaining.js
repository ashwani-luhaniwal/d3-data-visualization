/**
 * ----------------------
 * Method Chaining in D3
 * ----------------------
 * In the previous sections, we wrote D3 functions 'connected' to each other with dots. Does that make you 
 * curious? This is called "chain syntax". If you are familiar with JQuery, you might be familiar with the 
 * following.
 */
$("#myDiv").text("Some text").attr("style", "color:red")
    
// D3 uses a similar technique where methods are chained together using a period.
d3.select("body").append("p").text("Hello World!");
    
// The output of the first method is passed as an input to the next method in the chain. Think of it as a 
// filtered channel. The first method filters out content and provides a reference to the filtered content 
// to the next method, the next method further filters and passes on the reference to the next method and 
// so on.
// Now, we could have written our D3 code without using chaining as below.
var bodyElement = d3.select("body");
var paragraph = bodyElement.append("p");
paragraph.text("Hello World!");

// But the method chaining is a shorter and cleaner way of achieving this.
d3.select("body").append("p").text("Hello World!");