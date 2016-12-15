/**
 * Created by jefferson.wu on 11/30/16.
 */

// ======================
// EXPORT FUNCTIONS =====

/**
 * Get Sanitized string from a dirty string input.
 * @param dirtyString   Dirty string input.
 * @returns {string|XML}    Sanitized string output.
 */

module.exports.getSanitizedString = sanitizeString2;


// ======================
// INTERNAL FUNCTIONS ===

/**
 * Sanitize string version 2.0
 * @param dirtyString   Input for the dirty string.
 * @returns {string|void|XML}   Returns the clean string.
 */
function sanitizeString2 (dirtyString) {

    //TODO: make less verbose for output.
    // strip the numbers
    var cleanString = dirtyString.replace(/[0-9]/g, '');

    // strip special characters
    cleanString = cleanString.replace(/[~`!@#$%^&*()_+-=<>?,./;':"]/g, '');

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

    //TODO:

    //TODO: RETURN object with string as well as filename
        // if less than array.length, elem + '_'
        // else '.mp4';


}





//TODO: REFERENCE
// replaces commas,
//dirtyString.replace(/[,./]/g, '').replace(/\s\s+/g, ' ').replace(/^\s/g, '').replace(/\s$/g, '');

// replaces backslashes
//filterString = filterString.replace(/\\/g, '');

// replace brackets
//filterString = filterString.replace(/\{\}/g, '');


