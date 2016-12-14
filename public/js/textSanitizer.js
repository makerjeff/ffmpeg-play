/**
 * Created by jefferson.wu on 11/30/16.
 */

var textSanitizer = {

    /**
     * Get Sanitized String from a dirty string input.
     * @param dirtyString  Durrrty input string.
     * @returns {string|XML}    Cleaned output string.
     */
    getSanitizedString: function(dirtyString){
        //TODO: make less verbose for output.
        // strip the numbers
        var cleanString = dirtyString.replace(/[0-9]/g, '');

        // strip special characters
        cleanString = cleanString.replace(/[~`!@#$%^&*()_+-=<>?,./]/g, '');

        // strip backslashes
        cleanString = cleanString.replace(/\\/g, '');

        // replace backslashes
        cleanString = cleanString.replace(/\{\}/g, '');

        // replace multi-spaces with single space
        cleanString = cleanString.replace(/\s\s+/g, ' ');

        // strip trailing spaces
        cleanString = cleanString.replace(/\s$/g, '');

        // strip leading spaces
        cleanString = cleanString.replace(/^\s/g, '');

        return cleanString;
    }
};

