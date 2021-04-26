# fitbit-polyline
A simplistic set of widgets for Fitbit OS that displays polylines and polygons.
![example](screenshot.png#center)

There are four widget types:

* polyline4: up to four line segments forming an open shape
* polyline8: up to eight line segments forming an open shape
* polygon4: up to four line segments forming a closed shape
* polygon8: up to eight line segments forming a closed shape

Points (hence line segments) can be moved at runtime via a JavaScript function (`setPoint`).

Implementation Features
-

* The SVG `<use> <set>` syntax borrows from the [SVG style attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/style) and the [SVG points attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/points), but is implemented in the manner required by Fitbit's SVG. This allows unsupported attributes (such as `points`) to be used.

* Although the features of polyline and polygon are very similar, code duplication is minimised by calling through to common functions. Ideally, this should be implemented via subclassing.

Limitations
-

* There is no documentation. Study the example!

* The API is incomplete (*eg*, there is no way to delete a point).

* There is no validation of input data (*eg*, `points`).

* `linecap` limitations mean that line segments may not necessarily connect with each other in the way you'd like.

* The widgets may lack sensible default attributes

* The widgets may not respond to CSS.

* The code is ugly.

* This is largely untested.

Pull requests are welcome!