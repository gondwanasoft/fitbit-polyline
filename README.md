# fitbit-polyline
A simplistic pair of widgets for Fitbit OS that displays polylines and polygons.
![example](screenshot.png#center)

There are four widget types:

* polyline4: up to four line segments forming an open shape
* polyline8: up to eight line segments forming an open shape
* polygon4: up to four line segments forming a closed shape
* polygon8: up to eight line segments forming a closed shape

Points (hence line segments) can be moved at runtime via a JavaScript function (`setPoint()`).

Implementation Features
-

The SVG `<use> <set href="#config">` syntax borrows from the [SVG style attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/style) and the [SVG points attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/points), but is implemented in the manner required by Fitbit's SVG. This allows unsupported attributes (such as `points`) to be specified in SVG.

An object-oriented approach is attempted. A polygon is considered to be a subclass of a polyline (_ie_, polygon `extends` polyline), with the additional characteristic that the shape is automatically closed. To implement this, one or two objects are spliced into the prototype chain of the `<use>` object returned by `getElementById()` (the variable `el`). The resulting prototype chain looks like this:

![Objects](objects.png#center)

Features of this approach include:

* So that only public members (such as `setPoint()`) are exposed, closures are used within the polygon and polyline objects. Only the closures are linked into the prototype chain. Members that are declared outside of the closure (_eg_, `_lineEls`) are not accessible through the prototype chain.

* Code duplication is avoided because the polygon's closure automatically inherits members implemented in the polyline's closure (_eg_, `setPoint()`). This is a consequence of JavaScript's prototype system.

* To achieve the equivalent of `protected` members (_ie_, members that can be accessed by subclasses but not publicly), the polygon object uses a reference (`_polyline`) to the polyline object. This allows polygon to access members such as `_polyline._lineEls`.

* Other than having its prototype changed, the original object (`el`) is not modified; neither is any other Fitbit API object modified.

A function called `dumpProperties()` is used to list enumerable members in the prototype chain of a polygon element. The output (with object and interface names added manually) is:


```
Members (level 0):                    (instance)
  ---------------
Members (level 1):                    polygon
  setPoint (function)
  ---------------
Members (level 2):                    polyline
  strokeWidth (undefined)
  setPoint (function)
  ---------------
Members (level 3):                    GraphicsElement
  constructor (function)
  text (string)                       Element
  image (string)                      Element
  value (undefined)                   Element
  mode (number)                       Element
  state (undefined)                   Element
  highlight (INACCESSIBLE)            —
  style (object)                      Styled
  x (number)                          Bounded
  y (number)                          Bounded
  width (undefined)                   Bounded
  height (undefined)                  Bounded
  ---------------
Members (level 4):                    GraphicsElement
  constructor (function)
  getBBox (function)                  GraphicsElement
  ---------------
Members (level 5):
  constructor (function)
  parent (object)                     Element
  nextSibling (object)                Element
  firstChild (object)                 Element
  children (object)                   Element
  text (string)                       Element
  textContent (INACCESSIBLE)          TextElement?
  innerText (INACCESSIBLE)            —
  getElementById (function)           ElementSearch
  getElementsByClassName (function)   ElementSearch
  getElementsByTypeName (function)    ElementSearch
  getElementsByTagName (function)     ElementSearch
  sendEvent (function)                Element
  appendChild (function)              Element???
  animate (function)                  Element
  id (string)                         Element
  class (string)                      Element
  type (string)                       Element
  layer (undefined)                   Element
  ---------------
Members (level 6):
  constructor (function)
  addEventListener (function)         EventTarget
  removeEventListener (function)      EventTarget
  dispatchEvent (function)            EventTarget
  ---------------
Members (level 7):
  ---------------
```

Limitations
-

* There is no documentation. Study the example!

* The API is incomplete (*eg*, there is no way to delete a point).

* There is no validation of input data (*eg*, `points`).

* `linecap` limitations mean that line segments may not necessarily connect with each other nicely.

* The widgets may lack sensible default attributes.

* The widgets may not respond to CSS.

* This is largely untested.

Pull requests are welcome!