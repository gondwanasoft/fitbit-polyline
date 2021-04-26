# fitbit-polyline
A simplistic set of widgets for Fitbit OS that displays polylines and polygons.
![example](screenshot.png#center)

There are four widget types:

* polyline4: up to four line segments forming an open shape
* polyline8: up to eight line segments forming an open shape
* polygon4: up to four line segments forming a closed shape
* polygon8: up to eight line segments forming a closed shape

There is no documentation. Study the example!

Points (hence line segments) can be moved at runtime via a JavaScript function (`setPoint`).

The API is incomplete (*eg*, there is no way to delete a point). `linecap` limitations mean that line segments may not necessarily connect with each other in the way you'd like.

This is largely untested, and the code is pretty ugly. The widget is probably lacking default attributes and may not respond to CSS.

Pull requests are welcome!