# searchable
Vanilla JS classes for search field callbacks, searching dom elements, and ajax queries.

## SearchInput Usage

Normally, this class is used with either `DomSearch` or `AjaxSearch`, however it may also be used independently using the syntax given below:

    let el = document.getElementById('<id of search input>');
    let searchCallback = function(query) { console.log('you searched for' +  query); };
    let clearCallback = function() { console.log('you cleared your search.'; };
    let _ = new SearchInput(el, { search: searchCallback, clear: clearCallback });
    
## DomSearch Usage

Given this HTML:

    <input type="search" id="searchWithMe">
    <table id="content">
      <tbody>
        <tr><td>things</td></tr>
        <tr><td>things and stuff</td></tr>
        <tr><td>stuff</td></tr>
      </tbody>
    </table>

This Javascript would use the class to filter rows based on the entry into the `#searchWithMe` input:

    let si = document.getElementById('searchWithMe');
    let fn = function(isFound) { this.toggleAttribute('hidden', !isFound); }
    let _ = new DomSearch(si, { target: '#content tr', result: fn });

## AjaxSearch Usage

The code below is an example of how the `AjaxSearch` class could be used:

    let si = document.getElementById('searchWithMe');
    let fnResults = function(data) { <your code to do something with the result data> };
    let fnReset = function() { <your code to reset the dom to the pre-search state> };
    let _ = new AjaxSearch(si, { results: fnResults, reset: fnReset });