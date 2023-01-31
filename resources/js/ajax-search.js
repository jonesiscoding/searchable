
class AjaxSearch extends SearchInput {

  /**
   * @typedef CallbackConfig
   * @param {function(*)} search
   * @param {function()} clear
   * @param {function(*)} results
   * @param {function()} reset
   */

  cachedResults = {};
  ajaxUrl;
  method;

  search(val) {
    // Hide Suggestions
    // Reveal Results
    if ( typeof this.cachedResults[this.currentValue] !== 'undefined') {
      // Use the cached results
    } else {
      // Retrieve New Results
      this.retrieve(this.ajaxUrl, { query: val, method: this.method, callback: this.callbacks.results })
    }
  }

  clear() {
    clearInterval(this.onChangeInterval);
    this.el.value = '';
    this.callbacks.reset.apply(this);
  }

  /**
   *
   * @param url
   * @param {{ method: string, query: string, callback: function, body: object} }} options
   */
  retrieve( url, options ) {
    let defaults = { headers: { 'Content-Type': 'application/json' }, method: 'get' }
    Object.assign(defaults, options);
    if(options.query) {
      if(options.method == 'post') {
        options.body = JSON.stringify({ query: options.query });
      } else {
        url = url + '?query=' + options.query;
      }
    }
    fetch( url, options )
        .then( ( response ) => response.json() )
        .then((data) => options.callback.apply(this, [data]))
    ;
  }

  constructor( el, options ) {
    super( el, options );

    this.ajaxUrl = this.el.form.action;
    this.method = this.el.form.method;
    this.callbacks.search = this.search;
    this.callbacks.clear = this.clear;
  }
}
