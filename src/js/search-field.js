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

    var plugin = this;
    var $input = $(el);

    plugin.settings = {};

    plugin.init = function() {

      plugin.settings = $.extend({}, defaults, options);
      plugin.currentValue = $input.val();
      plugin.onChangeInterval = {};

      // Remove autocomplete attribute to prevent native suggestions
      $input.attr('autocomplete', 'off');
      // Fix android and iOS annoyances that conflict with proper names
      if($('html').hasClass('touch')) {
        $input.attr( {'spellcheck': 'false', 'autocorrect': 'off','autocapitalize': 'off'} );
      }

      // React to Input on the Input
      $input
          .on('keyup', function (e) { plugin.onKeyUp(e); })
          .on('keydown', function (e) { plugin.onKeyDown(e); })
          .on('blur', function () { if( plugin.currentValue !== $input.val() ) {  plugin.doCallback(); } })
          .on('change', function () { if( plugin.currentValue !== $input.val() ) {  plugin.doCallback(); } })
      ;
    };

    plugin.onKeyDown = function(e) {
      var keyPressed = e.which;

      switch (keyPressed) {
        case keys.ESC:
          $input.val('').trigger('change');
          return;
        case keys.TAB:
          if( plugin.currentValue !== $input.val() ) {  plugin.doCallback(); }
          return;
        case keys.RETURN:
          if( plugin.currentValue !== $input.val() ) {  plugin.doCallback(); }
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
    plugin.onKeyUp = function(e) {
      var keyPressed = e.which;

      // We don't want to do anything for special keys
      if(plugin.isSpecialKey(keyPressed)) { return; }

      clearInterval(plugin.onChangeInterval);

      // If any other key, perform the lookup
      if (plugin.currentValue !== $input.val()) {
        if (plugin.settings.deferRequestBy > 0) {
          // Defer lookup in case when value changes very quickly:
          plugin.onChangeInterval = setInterval(function () {
            plugin.doCallback();
          }, plugin.settings.deferRequestBy);
        } else {
          plugin.doCallback();
        }
      }
    };

    plugin.isSpecialKey = function(keyPressed) {
      var retval = false;
      $.each( keys, function( key, value ) {
        retval = retval || (value === keyPressed);
      });

      return retval;
    };

    plugin.doCallback = function() {
      clearInterval(plugin.onChangeInterval);
      plugin.currentValue = $input.val();
      if(plugin.currentValue.length >= plugin.settings.minCharacter) {
        clearInterval(plugin.onChangeInterval);
        plugin.settings.search(plugin.currentValue);

      } else if(plugin.currentValue.length === 0) {
        plugin.settings.clear();
      }
    };

    // call the "constructor" method
    plugin.init();

  };

  /**
   * Add Plugin to jQuery.fn object, attach plugin to each element.
   * @param options
   * @returns {*}
   */
  $.fn.searchField = function(options) {
    return this.each(function() {
      if (undefined === $(this).data('search-field')) {
        var plugin = new $.searchField(this, options);
        $(this).data('search-field', plugin);
      }
    });
  }
})(jQuery);
