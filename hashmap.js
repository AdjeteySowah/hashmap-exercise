export function createHashMap() {
  let loadFactor = 0.75;
  let capacity = 16;
  let buckets = new Array(capacity).fill(null);
  let storedKeys = 0;
  let keyHashCodes = {};


  function setLoadFactor(lf) {
    if (typeof lf !== "number" || lf <= 0 || lf >= 1) {
      throw new Error("loadFactor must be between 0 and 1 (exclusive)");
    }
    loadFactor = lf;
  }

  function resize() {
    let size = storedKeys;
    if (size / capacity > loadFactor) {
      capacity *= 2;
      let newBuckets = new Array(capacity).fill(null);
      buckets.forEach((bucket, idx) => {
        if (bucket) {
          newBuckets[idx] = bucket;
        }
      });
      buckets = newBuckets;
    }
  }

  function displayBuckets() {
    return buckets;
  }

  function traverse(callback, head) {
    let current = head;
    let idx = 0;
    while (current !== null) {
      const result = callback(current, idx);
      if (result !== undefined) return result;
      current = current.next;
      idx += 1;
    }
    return undefined;
  }

  function hash(key) {
    if (key === null || key === undefined) key = '';
    let str = String(key);
    str = str.normalize('NFC');
    str = str.toLowerCase();

    let hashCode = 0;

    if (Object.hasOwn(keyHashCodes, str)) {
      hashCode = keyHashCodes[str];
    } else {
      const primeNumber = 31;
      for (const cha of str) {
        hashCode = (primeNumber * hashCode + cha.codePointAt(0)) % capacity;
      }
      keyHashCodes[str] = hashCode;
    }

    return hashCode;      
  }

  function set(key, value) {
    const bucket = { key, value, prev: null, next: null };
    const hashCode = hash(key);

    const head = buckets[hashCode];

    if (head && key === head.key) { // override in head
      buckets[hashCode].value = value;
    } else if (head) {
      const node = traverse((node) => { // override or set value in head or after head node
        return node.next === null || node.key === key ? node : undefined;
      }, head);
      if (node.key === key) { // override after head
        node.value = value;
      } else {  // set value after head(in tail, change tail.next)
        node.next = bucket;
        node.next.prev = node;
        storedKeys += 1;
      }
    } else {  // set value in head
      buckets[hashCode] = bucket;
      storedKeys += 1;
    }

    resize();
    return bucket;
  }

  function get(key) {
    const hashCode = hash(key);
    const head = buckets[hashCode];

    if (head && head.key === key) {
      return head.value;
    } else if (head && head.next !== null) {
      const value = traverse((node) => {
        return node.key === key ? node.value : undefined;
      }, head);
      return value;
    } else {
      return null;
    }
  }

  function has(key) {
    const hashCode = hash(key);
    const head = buckets[hashCode];

    if (head && head.key === key) {
      return true;
    } else if (head && head.next !== null) {
      const hasKey = traverse((node) => {
        return node.key === key ? true : false;
      }, head);
      return hasKey;
    } else {
      return false;
    }
  }

  function remove(key) {
    const hashCode = hash(key);
    const head = buckets[hashCode];

    if (head && head.key === key && head.next === null) { // removing standalone head, next = null
      buckets[hashCode] = null;
      storedKeys -= 1;
      return true;
    } else if (head && head.key === key && head.next !== null) { // non-head node(s) to take place of head
      buckets[hashCode] = head.next;
      head.next.prev = null;
      storedKeys -= 1;
      return true;
    } else if (head && head.next !== null) { // removing any node(in any position) after head
      const node = traverse((node) => {
        return node.key === key ? node : undefined;
      }, head);
      if (node && node.next) {  // removing node(s) in b/n
        node.prev.next = node.next;
        node.next.prev = node.prev;
        storedKeys -= 1;
        return true;
      } else if (node) {  // removing tail
        node.prev.next = null;
        storedKeys -= 1;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function length() {
    return storedKeys;
  }

  function clear() {
    buckets = new Array(capacity).fill(null);
    storedKeys = 0;
    return buckets;
  }

  function keys() {
    const nonNullBuckets = buckets.filter((bucket) => bucket !== null);
    const keys = nonNullBuckets.map((bucket) => {
      if (bucket.next === null) {
        return [bucket.key];
      } else {
        const nestedKeys = [];
        traverse((node) => {
          node ? nestedKeys.push(node.key) : undefined;
        }, bucket);
        return nestedKeys;
      }
    });
    return keys.flat();
  }

  function values() {
    const nonNullBuckets = buckets.filter((bucket) => bucket !== null);
    const values = nonNullBuckets.map((bucket) => {
      if (bucket.next === null) {
        return [bucket.value];
      } else {
        const nestedValues = [];
        traverse((node) => {
          node ? nestedValues.push(node.value) : undefined;
        }, bucket);
        return nestedValues;
      }
    });
    return values.flat();
  }

  function entries() {
    const nonNullBuckets = buckets.filter((bucket) => bucket !== null);
    const keyValuePairs = [];

    nonNullBuckets.forEach((bucket) => {
      if (bucket.next === null) {
        keyValuePairs.push([bucket.key, bucket.value]);
      } else {
        traverse((node) => {
          node ? keyValuePairs.push([node.key, node.value]) : undefined;
        }, bucket);
      }
    });
    return keyValuePairs;
  }

  return {
    setLoadFactor,
    displayBuckets,

    set,
    get,
    has,
    remove,
    length,
    clear,
    keys,
    values,
    entries,
  };
}