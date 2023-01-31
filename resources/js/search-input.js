/**
 * Configures the given element as a search field, performing the given callbacks on search & clear.
 *
 * @returns {jQuery}
 */
;(function($) {

  $.searchField = function(el, options) {

    var defaults = {
      minCharacter: 3,
      deferRequestBy: 500,
      search: function(search) {},
      clear: function() {}
    };

    var keys = {
      ESC:    27,
      TAB:    9,
      RETURN: 13,
      LEFT:   37,
      UP:     38,
      RIGHT:  39,
      DOWN:   40
    };

    var sf     = this;
    var $input = $(el);

    sf.settings = {};

    sf.init = function() {

      sf.settings = $.extend({}, defaults, options);
      sf.currentValue = $input.val();
      sf.onChangeInterval = {};

      // Remove autocomplete attribute to prevent native suggestions
      // Prevent iOS/Android/Win10 annoyances that alter search terms
      var attr = { autocomplete: 'off', spellcheck: 'false', autocorrect: 'off', autocapitalize: 'off' };
      $input.attr(attr);

      // React to Input on the Input
      $input
          .on('keyup', function (e) { sf.onKeyUp(e); })
          .on('keydown', function (e) { sf.onKeyDown(e); })
          .on('blur', function () { if( sf.currentValue !== $input.val() ) {  sf.doCallback(); } })
          .on('change', function () { if( sf.currentValue !== $input.val() ) {  sf.doCallback(); } })
      ;
    };

    sf.onKeyDown = function(e) {
      var keyPressed = e.which;

      switch (keyPressed) {
        case keys.ESC:
          $input.val('').trigger('change');
          return;
        case keys.TAB:
          if( sf.currentValue !== $input.val() ) {  sf.doCallback(); }
          return;
        case keys.RETURN:
          if( sf.currentValue !== $input.val() ) {  sf.doCallback(); }
          break;
        default:
          return;
      }

      // Cancel event if function did not return:
      e.stopImmediatePropagation();
      e.preventDefault();
    };

    /**
     * Called when a key is released while the search box is in focus.
     *
     * @param e       The event that triggered this.
     */
    sf.onKeyUp = function(e) {
      var keyPressed = e.which;

      // We don't want to do anything for special keys
      if(sf.isSpecialKey(keyPressed)) { return; }

      clearInterval(sf.onChangeInterval);

      // If any other key, perform the lookup
      if (sf.currentValue !== $input.val()) {
        if (sf.settings.deferRequestBy > 0) {
          // Defer lookup in case when value changes very quickly:
          sf.onChangeInterval = setInterval(function () {
            sf.doCallback();
          }, sf.settings.deferRequestBy);
        } else {
          sf.doCallback();
        }
      }
    };

    sf.isSpecialKey = function(keyPressed) {
      var retval = false;
      $.each( keys, function( key, value ) {
        retval = retval || (value === keyPressed);
      });

      return retval;
    };

    sf.doCallback = function() {
      clearInterval(sf.onChangeInterval);
      sf.currentValue = $input.val();
      if(sf.currentValue.length >= sf.settings.minCharacter) {
        clearInterval(sf.onChangeInterval);
        sf.settings.search(sf.currentValue);

      } else if(sf.currentValue.length === 0) {
        sf.settings.clear();
      }
    };

    sf.init();

  };

  /**
   * @param   {object} options
   * @returns {jQuery}
   */
  $.fn.searchField = function(options) {
    return this.each(function() {
      if (undefined === $(this).data('search-field')) {
        var sf = new $.searchField(this, options);
        $(this).data('search-field', sf);
      }
    });
  }
})(jQuery);
