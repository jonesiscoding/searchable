/**
 * Configures the given element as a search field, performing the given callbacks on search & clear.
 *
 * @returns {jQuery}
 */
;(function($) {

  class SearchInput {

    /**
     * @typedef CallbackConfig
     * @param {function(*)} search
     * @param {function()} clear
     */

    /** @type HTMLInputElement */
    el;
    /** @type {CallbackConfig|object} */
    callbacks = { search: search => {}, clear: () => {} }
    /** @type string */
    currentValue;
    /** @type int */
    deferRequestBy = 500;
    /** @type int */
    minCharacter = 3;
    /** @type number */
    onChangeInterval;

    /** @type {{*: string, ESC: string, TAB: string, LEFT: string, ENTER: string, RIGHT: string, UP: string}} */
    static keys = {
      ESC:   'Escape',
      TAB:   'Tab',
      ENTER: 'Enter',
      LEFT:  'ArrowLeft',
      UP:    'ArrowUp',
      RIGHT: 'ArrowRight',
      DOWN:  'ArrowDown'
    };

    constructor( el, options ) {

      let si = this;

      si.el = el;
      si.deferRequestBy = options.deferRequestBy || si.deferRequestBy;
      si.minCharacter = options.minCharacter || si.minCharacter;
      si.callbacks.search = options.search || si.callbacks.search;
      si.callbacks.clear = options.clear || si.callbacks.clear;

      // Remove autocomplete attribute to prevent native suggestions
      // Prevent iOS/Android/Win10 annoyances that alter search terms
      let attr = { autocomplete: 'off', spellcheck: 'false', autocorrect: 'off', autocapitalize: 'off' };
      for (let key in attr) {
        si.el.setAttribute(key, attr[key]);
      }

      // React to Input on the Input
      el.addEventListener('keyup', e => si.onKeyUp(e));
      el.addEventListener('keydown', e => si.onKeyDown(e));
      el.addEventListener('blur', e => { if(si.currentValue !== el.value) { si.doCallback(); }});
    };

    get id() {
      return this.el.id;
    }

    /**
     * @param {KeyboardEvent} e
     */
    onKeyDown(e) {
      switch (e.key) {
        case SearchInput.keys.ESC:
          this.el.dispatchEvent( 'change' );
          return;
        case SearchInput.keys.TAB:
          if( this.currentValue !== this.el.value ) {  this.callback(); }
          return;
        case SearchInput.keys.ENTER:
          if( this.currentValue !== this.el.value ) {  this.callback(); }
          break;
        default:
          return;
      }

      // Cancel event if function did not return:
      e.stopImmediatePropagation();
      e.preventDefault();
    };

    /**
     * @param {KeyboardEvent} e
     */
    onKeyUp(e) {
      let si = this;

      // We don't want to do anything for special keys
      if(si.isSpecialKey(e.key)) { return; }

      clearInterval(si.onChangeInterval);

      // If any other key, perform the lookup
      if (si.currentValue !== si.el.value) {
        if (si.deferRequestBy > 0) {
          // Defer lookup in case when value changes very quickly:
          si.onChangeInterval = setInterval(() => si.doCallback(), this.deferRequestBy);
        } else {
          si.doCallback();
        }
      }
    };

    /**
     * @param {string} keyPressed
     * @returns {boolean}
     */
    isSpecialKey(keyPressed) {
      for(let key in SearchInput.keys) {
        if ( key === keyPressed ) {
          return true;
        }
      }
    };

    doCallback() {
      clearInterval(this.onChangeInterval);
      this.currentValue = this.el.value;
      if(this.currentValue.length >= this.minCharacter) {
        clearInterval(this.onChangeInterval);
        this.callbacks.search.apply(this, [this.currentValue]);
      } else if(this.currentValue.length === 0) {
        this.callbacks.clear.apply(this);
      }
    };
  }

  /**
   * @param   {object} options
   * @returns {jQuery}
   */
  $.fn.searchField = function(options) {
    return this.each(function() {
      if (undefined === $(this).data('search-field')) {
        let sf = new SearchInput(this, options);
        $(this).data('search-field', sf);
      }
    });
  }
})(jQuery);
