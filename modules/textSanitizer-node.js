/**
 * Created by jefferson.wu on 11/30/16.
 */

/**
 * Get Sanitized string from a dirty string input.
 * @param dirtyString   Dirty string input.
 * @returns {string|XML}    Sanitized string output.
 */
module.exports.getSanitizedString = function(dirtyString) {
    return dirtyString.replace(/[0123456789!@#$%^&*()_+{}]/g, '').replace(/\s\s+/g, ' ').replace(/[ ]+$/g, '').replace(/^[ ]/g, '');
};

