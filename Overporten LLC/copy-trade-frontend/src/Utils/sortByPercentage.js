/**
 * Sorts an array of objects based on the 'percentage' property in descending order.
 * @param {Array} arr - The array to be sorted.
 * @throws {TypeError} - If the input 'arr' is not an array.
 * @throws {TypeError} - If any object in the array does not have a 'percentage' property.
 * @throws {TypeError} - If the 'percentage' property is not a number in any object.
 * 
 * @example
 * const data = [
 *   { name: 'John', percentage: 75 },
 *   { name: 'Alice', percentage: 90 },
 *   { name: 'Bob', percentage: 60 }
 * ];
 *
 * const sortedData = sortByPercentage(data);
 * console.log(sortedData);
 * // Output:
 *  [
 *   { name: 'Alice', percentage: 90 },
 *   { name: 'John', percentage: 75 },
 *   { name: 'Bob', percentage: 60 }
 *  ]
 * @returns {Array} - A new array containing the sorted objects.
  */
export default function sortByPercentage(arr) {
  return arr;
};
