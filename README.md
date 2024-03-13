# Usage

 - Shift+Enter = Add a new cell under current one
 - Ctrl+Enter = Run code of current cell

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

If you want to rotate it, add this to the config: `set view 45, 15*9`.

More:
 - http://lowrank.net/gnuplot/plot2-e.html#5.8
 - http://lowrank.net/gnuplot/plot3d-e.html

Testing mathlive / compute-engine:

```js
const mi = document.getElementById('mathinput');
json = JSON.parse(mi._mathfield.getValue("math-json"));
boxedFunction = ce.box(json);
boxedFunction.evaluate();
```

Example expressions:
 - `$$ \pi\in\mathbb{N} $$`
 - `$$ \prod_{i=0}^{n-1}{\frac{1}{\sqrt{1+2^{-2i}}}} $$`
 - `$$ \int_0^5\!-0.5x+4dx $$`
 - `$$ f(x)=-0.5x+4 $$` (TODO convert to REDUCE code like `f:=((-0.5 * x) + 4);`)

Plots:
 - plot (cos sqrt(x^2 + y^2), x=(-3 .. 3), y=(-3 .. 3), hidden3d);
 - plot(x^3 + y^3 - 3*x*y = {0,1,2,3,4,5,6,7}, x=(-2.5 .. 2), y=(-5 .. 5));

If an expression iteratively becomes more pronounced, one can plot the iteration count like this:

```red
rets := for n := 1 : 100 collect {
  n,
  for i := 0 : (n - 1) product (1 / Sqrt(((2 ** (-2 * i)) + 1)))
};
plot(rets);
```

# Integrals

https://significantstatistics.com/index.php/Lecture_2._B%29_Leibniz_Rule
https://significantstatistics.com/index.php/Lecture_2._B)_Leibniz_Rule_II


https://www.khanacademy.org/math/multivariable-calculus/integrating-multivariable-functions/double-integrals-a/a/double-integrals
plot(x+sin y+1, x=(-5 .. 5));

```red
f := -0.5x+4$
num_int(f, x=(0 .. 5));
```
