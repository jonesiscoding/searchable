
/**
 * Searches the given selectors for the given text value, then performs the given 'result' callback on each selector.
 */
class DomSearch extends SearchInput {

  /** @type {NodeListOf<HTMLElement>} */
  targets;

  /**
   * @param {HTMLElement} el
   * @param {{ target: string, clear: function, result: function }} options
   */
  constructor( el, options ) {
    super( el, options );

    this.targets = document.querySelectorAll(options.target);
    this.callbacks.search = this.search;
    this.callbacks.clear = options.clear || this.callbacks.clear;
    this.callbacks.result =  options.result || function(node, found) {};
  };

  /**
   * Searches each node that matches target selector given at instatitation for the given query string and runs the
   * result callback given at instantiation indicating whether the
   *
   * @param {string} query
   */
  search(query) {
    let ds = this;
    let q = query.toLowerCase();
    this.targets.forEach(function(node) {
      let text = ds.text(node);
      let found = text && text.indexOf(q) >= 0;
      // noinspection JSUnresolvedVariable
      ds.callbacks.result.apply(node, [found])
    });
  }

  /**
   * Retrieves all text in the given HtmlElement
   * @param elem
   * @returns {string|null}
   */
  text(elem) {
    let text = (elem.textContent || elem.innerText || "").toLowerCase();
    return (text.length >= this.minCharacter) ? text : null;
  };
}