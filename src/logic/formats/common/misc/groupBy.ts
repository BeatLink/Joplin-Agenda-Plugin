    /** 
 * Takes an Array<V>, and a grouping function, and returns a Map of the array grouped by the grouping function.
 * Source: https://stackoverflow.com/a/38327540 
 * 
 * @param list      - Array of items to group
 * @param keyGetter - Function that should return the key for the group that the given item falls into
 * @returns         - Map of the array, grouped into keys by the results of the grouping function
 */
     function groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }