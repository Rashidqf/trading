/**
 * Formats a given date into a localized string representation.
 *
 * @param {Date|number|string} date - The date object or date string to be formatted.
 * @returns {string} - The formatted date string.
 * @throws {TypeError} - If the input 'date' is not a valid date object, number, or string.
 *
 * @example
 * const myDate = new Date();
 * const formattedDate = formatDate(myDate);
 * console.log(formattedDate);
 * // Output: May 24, 2023, 1:30 PM
 */
export default function formatDate(date) {
    const dateStr = new Date(date);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    return dateStr.toLocaleString('en-US', options);
};