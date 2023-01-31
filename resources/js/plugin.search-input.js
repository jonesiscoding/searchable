
/**
 * Configures the given element as a search field, performing the given callbacks on search & clear.
 *
 * @returns {jQuery}
 */
;(function($) {

  /**
   * @param   {object} options
   * @returns {jQuery}
   */
  $.fn.searchField = function(options) {
    return this.each(function() {
      if (undefined === $(this).data('search-input')) {
        let sf = new SearchInput(this, options);
        $(this).data('search-field', sf);
      }
    });
  }
})(jQuery);