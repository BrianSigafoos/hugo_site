---
title: Language Syntax Review
slug: syntax
date: 2020-07-16T20:21:41-04:00
summary: Quick review of basic syntax for Go, Javascript, and Ruby
---

Jump to [Go](#go) · [Javascript](#javascript) · [Ruby](#ruby)

---

### Go

#### Basics of Go

```go
var x int // Variable declaration. Variables must be declared before use.
x = 3     // Variable assignment.
// "Short" declarations use := to infer the type, declare, and assign.
y := 4
sum, prod := learnMultiple(x, y)        // Function returns two values.
fmt.Println("sum:", sum, "prod:", prod) // Simple output.

func learnMultiple(x, y int) (sum, prod int) {
  return x + y, x * y // Return two values.
}

 // Arrays have size fixed at compile time.
var a4 [4]int           // An array of 4 ints, initialized to all 0.
// An array initialized with a fixed size of five
// elements, with values 3, 1, 5, 10, and 100.
a5 := [...]int{3, 1, 5, 10, 100}

// Slices have dynamic size. Arrays and slices each have advantages
// but use cases for slices are much more common.
s3 := []int{4, 5, 9}    // Compare to a5. No ellipsis here.
s4 := make([]int, 4)    // Allocates slice of 4 ints, initialized to all 0.
var d2 [][]float64      // Declaration only, nothing allocated here.
bs := []byte("a slice") // Type conversion syntax.

// Slices (as well as maps and channels) have reference semantics.
s3_cpy := s3            // Both variables point to the same instance.
s3_cpy[0] = 0           // Which means both are updated.
fmt.Println(s3_cpy[0] == s3[0]) // true

// Because they are dynamic, slices can be appended to on-demand.
// To append elements to a slice, the built-in append() function is used.
// First argument is a slice to which we are appending. Commonly,
// the array variable is updated in place, as in example below.
s := []int{1, 2, 3}     // Result is a slice of length 3.
s = append(s, 4, 5, 6)  // Added 3 elements. Slice now has length of 6.
fmt.Println(s) // Updated slice is now [1 2 3 4 5 6]

// To append another slice, instead of list of atomic elements we can
// pass a reference to a slice or a slice literal like this, with a
// trailing ellipsis, meaning take a slice and unpack its elements,
// appending them to slice s.
s = append(s, []int{7, 8, 9}...) // Second argument is a slice literal.
fmt.Println(s)  // Updated slice is now [1 2 3 4 5 6 7 8 9]
```

#### Flow Control in Go

```go
// No parentheses for if / else
if x > y {
  // ...
} else {
  // ...
}

// Like if, for doesn't use parens either.
// Variables declared in for and if are local to their scope.
for x := 0; x < 3; x++ { // ++ is a statement.
  fmt.Println("iteration", x)
}

// You can use range to iterate over an array, a slice, a string, a map, or a channel.
// range returns one (channel) or two values (array, slice, string and map).
hashMap := map[string]int{"one": 1, "two": 2, "three": 3}
for key, value := range hashMap {
  // for each pair in the map, print key and value
  fmt.Printf("key=%s, value=%d\n", key, value)
}

// If you only need the value, use the underscore as the key
names := []string{"Bob", "Bill", "Joe"}
for _, name := range names {
  fmt.Printf("Hello, %s\n", name)
}

for { // Infinite loop.
  break    // Just kidding.
  continue // Unreached.
}
```

#### References for Go

- [Learn Go in Y Minutes](https://learnxinyminutes.com/docs/go/)
- [A Tour of Go](https://go.dev/tour)

Jump to [Go](#go) · [Javascript](#javascript) · [Ruby](#ruby)

---

### Javascript

#### Basics of Javascript

```javascript
// The "var" keyword, function scope aka hoisted to top.
var someVar = 5

// The "let" keyword allows you to define variables in a lexical scope (block),
// as opposed to a function scope like the var keyword does.
let name = 'Billy'
name = 'William' // Can do this

// The "const" keyword allows you to define a variable in a lexical scope
// like with let, but you cannot reassign the value once one has been assigned.
const pi = 3.14
pi = 4.13 // Can NOT do this

// There's shorthand for performing math operations on variables:
someVar += 5 // equivalent to someVar = someVar + 5; someVar is 10 now
someVar *= 10 // now someVar is 100

// and an even-shorter-hand for adding or subtracting 1
someVar++ // now someVar is 101
someVar-- // back to 100

// Strings
'hello'.length // 5
'hello'.charAt(0) // "h"
'hello, world'.replace('world', 'mars') // "hello, mars"
'hello'.toUpperCase() // "HELLO"

// Gotchas
//
3 / 2 // 1.5, not 1
Math.floor(3 / 2) // 1
0.1 + 0.2 == 0.30000000000000004 // Floats

// Avoid type coercion, use the triple-equals operator:
123 === '123' // false
1 === true // false
// vs
123 == '123' // true
1 == true // true
```

#### Flow Control in Javascript

```javascript
if (count === 3) {
  // evaluated if count is 3
} else if (count === 4) {
  // evaluated if count is 4
} else {
  // evaluated if it's not either 3 or 4
}

while (stack.length !== 0) {
  // ...
}

// Basic for loop
// initialization; continue condition; iteration.
for (let i = 0; i < 5; i++) {
  // will run 5 times
}

// The for/in statement allows iteration over properties of an object.
let description = ''
let person = { first: 'Paul', last: 'Ken', age: 18 }
for (let x in person) {
  description += person[x] + ' '
} // description = 'Paul Ken 18 '

// The for/of statement allows iteration over iterable objects (including the built-in String,
// Array, e.g. the Array-like arguments or NodeList objects, TypedArray, Map and Set,
// and user-defined iterables).
let myPets = ''
let pets = ['cat', 'dog', 'hamster', 'hedgehog']
for (let pet of pets) {
  myPets += pet + ' '
} // myPets = 'cat dog hamster hedgehog '
```

#### Hash Maps in Javascript

```javascript
const cache = new Map()

cache.set('a', 1) // Set key and value
cache.has('a') // Key exists?
cache.get('a') // Get value or `undefined`
cache.delete('a') // Delete element by key, returns true on success, or false if not found
```

#### Stacks and Queues in Javascript

```javascript
// Stacks (LIFO)
const stack = []
while (stack.length !== 0) {
  let a = stack.pop()
  // ...
  stack.push(b)
}

// Queues (FIFO)
const queue = []
while (queue.length !== 0) {
  let a = queue.shift()
  // ...
  queue.push(b)
}

// More
const queue2 = [1, 2]
queue2.unshift(0) // result of the call is 3, which is the new array length
// queue2 is [0, 1, 2]
```

#### ES6 Additions

```javascript
// There is a new syntax for functions in ES6 known as "lambda syntax".
// This allows functions to be defined in a lexical scope like with variables
// defined by const and let.
const isEven = (number) => {
  return number % 2 === 0
}

isEven(7) // false

// The "equivalent" of this function in the traditional syntax would look like this:
function isEven(number) {
  return number % 2 === 0
}
```

#### API Call and Parse JSON in Javascript

```javascript
// Using node-fetch since fetch() included in NodeJS 17.5+ only
import fetch from 'node-fetch'

let API_URL_WITH_PARAMS = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'

// Current approach - Fetch API
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
fetch(API_URL_WITH_PARAMS)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log(error))

// Old approach - XMLHttpRequest
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
//
// function reqListener() {
//   console.log(this.responseText)
// }

// var oReq = new XMLHttpRequest()
// oReq.addEventListener('load', reqListener)
// oReq.open('GET', API_URL_WITH_PARAMS)
// oReq.send()
```

#### References for Javascript

- [MDN Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [MDN Javascript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [A Re-introduction to Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
- [Learn Javascript in Y Minutes](https://learnxinyminutes.com/docs/javascript/)

---

### Ruby

#### Basics of Ruby

```ruby
# In Ruby, (almost) everything is an object.
# This includes numbers...
3.class #=> Integer

# Some basic arithmetic
1 + 1 #=> 2
8 - 1 #=> 7
10 * 2 #=> 20
35 / 5 #=> 7
2 ** 5 #=> 32
5 % 3 #=> 2

# Bitwise operators
3 & 5 #=> 1
3 | 5 #=> 7
3 ^ 5 #=> 6

# Create array with max distance
cache = Hash.new(0)
cache = Array.new(size, 0)

# Matrix m x n size, use rows and cols are the size of each, for clarity
rows = matrix.size
cols = matrix[0].size
output = Array.new(rows).map { Array.new(cols, 0) }
```

#### More Ruby

To quickly create a hash map in Ruby 2.7+ use the `#tally` method

```ruby
# Ruby 2.7+
cache = s.chars.tally

# vs
cache = s.chars.each_with_object(Hash.new(0)) { |v, h| h[v] += 1 }

# vs
cache = Hash.new(0)
s.chars.each { |c| cache[c] += 1 }
```

#### Flow Control in Ruby

```ruby
# The `do |variable| ... end` construct above is called a 'block'. Blocks are similar
# to lambdas, anonymous functions or closures in other programming languages. They can
# be passed around as objects, called, or attached as methods.
#
# The 'each' method of a range runs the block once for each element of the range.
# The block is passed a counter as a parameter.

# You can also surround blocks in curly brackets.
(1..5).each { |counter| puts "iteration #{counter}" }

# The contents of data structures can also be iterated using each.
array.each do |element|
  puts "#{element} is part of the array"
end
hash.each do |key, value|
  puts "#{key} is #{value}"
end

# If you still need an index you can use 'each_with_index' and define an index
# variable.
array.each_with_index do |element, index|
  puts "#{element} is number #{index} in the array"
end

counter = 1
while counter <= 5 do
  puts "iteration #{counter}"
  counter += 1
end
```

#### Hash Maps in Ruby

```ruby
# Hashes are Ruby's primary dictionary with key/value pairs.
# Hashes are denoted with curly braces.
cache = { }

cache['a'] = 1    # Set key and value
cache.key?('a')   # Key exists?
cache['a']        # Get value or `nil`
cache.delete('a') # Delete element by key, returns value on success or `nil` if  not found
```

#### Stacks and Queues in Ruby

```ruby
# Stacks (LIFO)
stack = []
until stack.empty?
  a = stack.pop
  # ...
  stack.append(b) # Alias for .push
end

# Queues (FIFO)
queue = []
until queue.empty?
  a = queue.shift
  # ...
  queue.append(b)
end

# More
queue.unshift(c) # Prepend to array (aliased as .prepend)
```

#### API Call and Parse JSON in Ruby

```ruby
# A simple review of Ruby's built in net/http, uri, and json libraries
# used to make API requests and parse the JSON response.
# require 'pry'
require 'uri'
require 'net/http'
require 'json'

# Option 1 - include params in GET request
# API_URL_WITH_PARAMS = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'
# uri = URI(API_URL_WITH_PARAMS)

# Option 2 - construct query with dynamic params
API_URL = 'https://api.nasa.gov/planetary/apod'
uri = URI(API_URL)
params = { api_key: 'DEMO_KEY' }
uri.query = URI.encode_www_form(params)

res = Net::HTTP.get_response(uri)
parsed = JSON.parse(res.body)
puts parsed
```

#### References for Ruby

- [Core Docs](https://ruby-doc.org/core-3.1.2/)
  - [Hash](https://ruby-doc.org/core-3.1.2/Hash.html)
  - [Array](https://ruby-doc.org/core-3.1.2/Array.html)
- [Learn Ruby in Y Minutes](https://learnxinyminutes.com/docs/ruby/)

Jump to [Go](#go) · [Javascript](#javascript) · [Ruby](#ruby)