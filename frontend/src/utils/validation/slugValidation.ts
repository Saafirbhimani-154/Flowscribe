/**
 * Converts string to URL-friendly slug
 * @param {string} text 
 * @returns {string}
 */
export const generateSlug = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')   // Remove all non-word chars
        .replace(/--+/g, '-');     // Replace multiple - with single -
};

/**
 * Validates if string is a valid slug
 * @param {string} slug 
 * @returns {boolean}
 */
export const validateSlug = (slug: string): boolean => {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};
