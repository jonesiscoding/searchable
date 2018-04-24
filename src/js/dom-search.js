/**
 * Searches the given selector for the given text value, then performs the given callback.
 *
 * @returns {jQuery}
 */
jQuery.fn.extend( {
  domSearch: function ( sel, value, callback ) {
    var ds = this;

    ds.value    = value;
    ds.settings = { minCharacter: 2 };

    ds.hasSearch = function(elem) {
      var retval = false;
      $(elem).contents().each(function() {
        var text = ds.getText(this);
        if(text && text.indexOf(ds.value.toLowerCase()) >= 0) {
          retval = true;
        }
      });

      return retval;
    };

    ds.getText = function(elem) {
      var text = (elem.textContent || elem.innerText || $(elem).text() || "").toLowerCase();
      return (text.length >= ds.settings.minCharacter) ? text : null;
    };

    $(sel).each(function() {
      callback(this,ds.hasSearch(this));
    });
  }
} );