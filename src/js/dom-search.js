/**
 * Searches the given selector for the given text value, then performs the given callback.
 *
 * @returns {jQuery}
 */
jQuery.fn.extend( {
  domSearch: function ( sel, value, callback ) {
    var plugin = this;
    plugin.value = value;
    plugin.settings = { minCharacter: 2 };

    plugin.hasSearch = function(elem) {
      var retval = false;
      $(elem).contents().each(function() {
        var text = plugin.getText(this);
        if(text && text.indexOf(plugin.value.toLowerCase()) >= 0) {
          retval = true;
        }
      });

      return retval;
    };

    plugin.getText = function(elem) {
      var text = (elem.textContent || elem.innerText || $(elem).text() || "").toLowerCase();
      return (text.length >= plugin.settings.minCharacter) ? text : null;
    };

    $(sel).each(function() {
      callback(this,plugin.hasSearch(this));
    });
  }
} );