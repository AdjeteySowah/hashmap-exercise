import { createHashMap } from "./hashmap.js";

const test = createHashMap();
test.setLoadFactor(0.75);

test.set('apple', 'red');
test.set('banana', 'yellow');
test.set('carrot', 'orange');
test.set('dog', 'brown');
test.set('elephant', 'gray');
test.set('frog', 'green');
test.set('grape', 'purple');
test.set('hat', 'black');
test.set('ice cream', 'white');
test.set('jacket', 'blue');
test.set('kite', 'pink');
test.set('lion', 'golden');

  // overwrite keys
test.set('ice cream', 'whitish-cream');
test.set('hat', 'blue-black');
test.set('frog', 'dark-green');

  // add key-value pair number 13 that triggers growth of hashmap
test.set('moon', 'silver');

  // overwrite keys again after expansion
test.set('apple', 'light-green');
test.set('dog', 'black and white');
test.set('jacket', 'blue and white');

console.log(test.length());

  // re-test methods
// console.log(test.get('moon'));
// console.log(test.has('dog'));
// console.log(test.keys());
// console.log(test.values());
// console.log(test.entries());
// console.log(test.remove('moon'));
// console.log(test.length());
console.log(test.entries());

