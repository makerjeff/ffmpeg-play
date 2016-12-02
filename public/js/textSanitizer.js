/**
 * Created by jefferson.wu on 11/30/16.
 */

var textSanitizer = {

    /**
     * Get Sanitized String from a dirty string input.
     * @param inputStr  Durrrty input string.
     * @returns {string|XML}    Cleaned output string.
     */
    getSanitizedString: function(inputStr){
        // basic chars, multi-spaces, brackets, trailing spaces, leading spaces
        return inputStr.replace(/[0123456789!@#$%^&*()_+{}]/g, '').replace(/\[.*?\]/g,"").replace(/\s\s+/g, ' ').replace(/[ ]+$/g, '').replace(/^[ ]/g, '');
    }
};

