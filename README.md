# Gaiman Engine

![Gaiman Text based advanture games engine](assets/banner.svg)

[Storytelling Text Based Game Engine](https://github.com/jcubic/gaiman)

Main part of Gaiman is a minimalistic language that generate Text Advanture Games.

## Examples

This is basic Gaiman DLS example:

```ruby
def ask_email(message)
   set reply = ask message
   if reply ~= /y|yes/i then
      echo "OK"
   else if reply ~= /n|no/i then
      echo "FAIL"
   else
      global(message)
   end
end

def global(command)
   if command ~= /help/ then
      echo "available commands help"
   else if command ~= /ls/
      echo get "/exec?command=ls"
   else
      echo "wrong command"
   end
end

if cookie.visited then
  if cookie.USER_NAME then
    echo "hello $user"
  else if cookie.EMAIL then
    echo "Will contact with with any updates"
  else
    echo "Do you want me to contact you with updates?"
    set confirm = ask "yes/no: "
    if confirm ~= /y|yes/i then
      echo "what is your name?"
      set command = ask "name: "
      if command then
        set user = command
        set cookie.user = command
        set response = post "/register" { name: user, email: email }
        if response then
          echo "Welcome $user. You're successfully registered"
        end
      end
    end
  end
end
```

## TODO
- [ ] Parser
  - [x] variables
    - [x] strings
    - [x] regexes
    - [ ] arrays
    - [ ] booleans
    - [ ] integers
    - [ ] floats
  - [x] property access
    - [ ] nested property access
  - [ ] Here docs - for figlet ASCII art
  - [ ] array indexing
  - [ ] dicts/structs for data
  - [x] `if/else` statements
  - [ ] loop
    - [ ] `for`..`in`
    - [ ] `while`
  - [ ] `do`..`end` blocks
  - [ ] comments with `#`
  - [x] Functions
    - [ ] Functions `return` keyword
    - [ ] Functions return functions
    - [ ] Lambda
    - [ ] Implementation of `map`/`reduce`/`filter` using gaiman
    - [ ] standard library
      - [ ] Array methods `join`/`push`/`pop` (maybe allow all JS methods)
      - [ ] String methods `split`/`replace`
      - [ ] `ord`/`chr`
  - [x] Commands (restricted names)
    - [x] `ask` - set prompt
    - [x] `echo` - print message
    - [x] `get` - send HTTP GET request
    - [x] `post` - send HTTP POST request
    - [x] `set` - save expression or command into variable
    - [ ] `exists` ... `in` - check if item is in array
    - [ ] `parse` - parse string to number, boolean or regex

    - [ ] `split` - to create array with string or regex separator
    - [ ] `join` - return string from array
    - [ ] `push` - item into array
    - [ ] `pop` - remote item from
  - [ ] Not operator inside if statements
  - [ ] Expressions
    - [x] regex match `~=`
    - [ ] `$1` variables
    - [ ] comparators `==`/`<=`/`>=`/`<`/`>`
    - [ ] parentheses for grouping
    - [ ] `-=`, `+=`, `/=`, `*=` operators ????
    - [ ] `-`, `+`, `/`, `*` and `%` operators
- [ ] compiler functions to JavaScript code [escodegen](https://github.com/estools/escodegen).
- [ ] Compile everything to JavaScript
- [ ] Interpreter
- [ ] Unit tests
- [ ] jQuery Terminal integration
- [ ] Async Adapters for Web and next for Terminal
- [ ] XML like syntax for colors `<bold><red>hello</red></bold>`
- [ ] Hooks to embed JS code ???

TODO: syntax example

```ruby

echo <<GREET
   ____       _
  / ___| __ _(_)_ __ ___   __ _ _ __
 | |  _ / _` | | '_ ` _ \ / _` | '_ \
 | |_| | (_| | | | | | | | (_| | | | |
  \____|\__,_|_|_| |_| |_|\__,_|_| |_|

Gaiman Engine
Copyright (C) 2021 Jakub Jankiewicz <https://jcubic.pl/me>
Released under GPLv3 license
GREET

var env = []

var items = ["bottle", "flower"]

set command = ask "? "
if command ~= /pick (.+)/ then
   if $1 then
      if exists $1 in items then
          env.push($1)
          pop items
       else
          echo "invalid item"
       end
    else
       echo "What do you want topick"
    end
end


var stop = false
var count = 0
while not stop do
    var command = ask "? "
    if command ~= /exit/
        stop = true
        echo "goodby"
    else if command ~= /add ([0-9]+)/ then
        count += parse $1
        echo "corrent count $count"
    else
        echo "your command $command"
    end
end

def once(fn)
    var result = null
    return lambda(...args)
        if result == null then
           result = fn(...args)
        end
        return result
    end
end

def map(fn, array)
    var result = []
    for item in array do
        result.push(fn(item))
    end
    return result
end
```

To consider
* do we need `set` maybe `foo = ??` is enough
* scope for variales (php with global is not good idea)
* methods
* standard library (e.g.: `push`/`pop`/`split`/`join`)
* functions should be compiled to JavaScript, use 

```
command = ask "? "
```

should be compile to:

```
var command = await term.read('? ')
```

Compile:
```
do
    var x = 10
    echo x + x
end
x # throw exception x is not defined
```

to
```javascript
{
    let x = 10
    term.echo(x + x);
}
x
```


## Adapter API

```javascript
class Adapter {
    constructor() { }
    async ask(message) { }
    echo(string) { }
    async get(url) { }
    async post(url, data) { }
    start() { }
}

functon is_node() {
    return typeof process !== 'undefined' &&
        process.release.name === 'node';
}

var term;
if (is_node()) {
  term = new NodeAdapter();
} else {
  term = new WebAdapter();
}
term.start()
```


## Name

Name came from [Neil Gaiman](https://en.wikipedia.org/wiki/Neil_Gaiman),
Author of novels, comic books, graphic novels and films. Great storyteller.

## Acknowledge

Logo use:

* Font [Calling Heart](https://www.dafont.com/calling-heart.font)
  by [Lettersiro Studio](https://www.dafont.com/lettersiro-studio.d7440)
* Clipart [Book with bookmarks](https://openclipart.org/detail/280709/book-with-bookmarks)
  by [Kevin David Pointon](https://openclipart.org/artist/Firkin)

## License

Released under GPLv3 license<br/>
Copyright (c) 2021 [Jakub T. Jankiewicz](https://jcubic.pl/me)
