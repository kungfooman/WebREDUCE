# Install

Simply install this into your `htdocs`, doesn't matter if you use `lighttpd` or `Apache2` etc.

```
git clone https://github.com/kungfooman/WebREDUCE/
cd WebREDUCE
npm install
```

Then go to http://127.0.0.1/WebREDUCE/ and enter any code, for example:

```red
plot((x+y)**4);
```

Press Ctrl+Enter to execute it and see a fancy plot.




Testing mathlive / compute-engine:

```js
const mi = document.getElementById('mathinput');
json = JSON.parse(mi._mathfield.getValue("math-json"));
boxedFunction = ce.box(json);
boxedFunction.evaluate();
```

Example expressions:
 - $$ \pi\in\mathbb{N} $$
