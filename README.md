# dot-querystring

dot notation version of [node-querystring](https://github.com/visionmedia/node-querystring).

## Examples

### strinfigy / parse

```js
dotQs.stringify({a :{ b : 2}})
// -> 'a.b=2'

dotQs.stringify({a :[1,2,3,4,5]})
// -> 'a.0=1&a.1=2&a.2=3&a.3=4&a.4=5'

dotQs.parse('a.b.c=1&a.b.d=2')
// -> { a: { b: { c: '1', d: '2' } } }

dotQs.parse('a.0=hoge&a.1=fuga')
// -> { a: [ 'hoge', 'fuga' ] }
```

### flatten

```js
dotQs.flatten({name : 'john', emails : ['john@example.com', 'john2@example.com']})
// ->  { name: 'john',
//     'emails.0': 'john@example.com',
//     'emails.1': 'john2@example.com' }
```

## License

The MIT License (MIT)
Copyright (c) 2012 tutuming  &lt;tutuming@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.