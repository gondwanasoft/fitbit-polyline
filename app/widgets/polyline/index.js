import { constructWidgets } from '../construct-widgets';

// POLYLINES

const createPolyline = (el, origProto) => {
  const polyline = {};

  // These members shouldn't be publicly accessible:
  polyline._closure = Object.create(origProto);  // this will contain the public members and be linked into prototype chain
  polyline._lineEls = el.getElementsByTagName('line');
  polyline._lineCount = 0;    // number of visible line segments

  polyline._setPointCoords = (index, x, y) => {
    // Doesn't update line style.display or lineCount.
    if (index < polyline._lineEls.length) {     // make sure it fits
      polyline._lineEls[index].x1 = x; polyline._lineEls[index].y1 = y;
      if (index) {    // join the dots
        polyline._lineEls[index-1].x2 = x; polyline._lineEls[index-1].y2 = y;
      }
    }
  }

  polyline._setLineCount = newLineCount => {
    // Unhide newly-used line segments and update _lineCount.
    for (let i = polyline._lineCount; i < newLineCount; i++)
      polyline._lineEls[i].style.display = 'inline';

    polyline._lineCount = newLineCount;
  }

  // These members will be publicly accessible, because they're in the closure which is linked into the prototype chain:
  Object.defineProperty(polyline._closure, 'strokeWidth', {
    set: function(newValue) {
      polyline._lineEls.forEach(line => {line.style.strokeWidth = newValue;});
    },
    enumerable: true
  });

  polyline._closure.setPoint = (index, x, y) => {
    polyline._setPointCoords(index, x, y);
    if (index > polyline._lineCount) polyline._setLineCount(index);
  }

  //polyline._closure.IAmAPolyline = true    // This isn't needed; it just shows up in dumpProperties()

  // Parse and process SVG config attributes:
  const attributes = el.getElementById('config').text.split(';')
  attributes.forEach(attribute => {
    const colonIndex = attribute.indexOf(':')
    const attributeName = attribute.substring(0, colonIndex).trim();
    const attributeValue = attribute.substring(colonIndex+1).trim();

    switch(attributeName) {
      case 'stroke-width':
        polyline._closure.strokeWidth = Number(attributeValue);
        break;
      case 'points':
        const coords = attributeValue.split(/[ ,]/);
        // TODO 9 should do some range-checking!
        let pointIndex = 0, x, y
        for (let coordIndex = 0; coordIndex < coords.length; coordIndex += 2) {
          x = Number(coords[coordIndex]); y = Number(coords[coordIndex + 1]);
          polyline._setPointCoords(pointIndex++, x, y);
        }
        let lineCount = Math.floor(coords.length / 2) - 1;
        polyline._setLineCount(lineCount);
        break;
    }
  });

  return polyline;
}

const constructPolyline = el => {
  // Create new polyline object and splice its closure into el's prototype chain:
  const origProto = Object.getPrototypeOf(el);
  const polyline = createPolyline(el, origProto);
  Object.setPrototypeOf(el,polyline._closure);
}

constructWidgets('polyline4', constructPolyline);
constructWidgets('polyline8', constructPolyline);

// POLYGONS

// TODO 3.5 put polygon in separate file/module?

const createPolygon = _polyline => {
  const polygon = {};

  // These members shouldn't be publicly accessible:
  polygon._closure = Object.create(_polyline._closure);  // this will contain the public members and be linked into prototype chain

  polygon._incLineCount = () => {
    _polyline._setLineCount(_polyline._lineCount+1);
  }

  polygon._closePoly = () => {
    // Make the last line connect to the first line.
    _polyline._lineEls[_polyline._lineCount - 1].x2 = _polyline._lineEls[0].x1;
    _polyline._lineEls[_polyline._lineCount - 1].y2 = _polyline._lineEls[0].y1;
  }

  // These members will be publicly accessible, because they're in the closure which is linked into the prototype chain:
  polygon._closure.setPoint = (index, x, y) => {
    _polyline._closure.setPoint(index, x, y);   // it would be more general to use `super`, but `super` doesn't work here

    if (index >= _polyline._lineCount) polygon._incLineCount();    // a new point has been added

    if (!index || index===_polyline._lineCount-1) polygon._closePoly();
  }

  //polygon._closure.IAmAPolygon = true  // This isn't needed; it just shows up in dumpProperties()

  // Finish up after initial construction from SVG config:
  if (_polyline._lineCount) {  // some points were specified in SVG; need to close shape
    polygon._incLineCount();
    polygon._closePoly();
  }

  return polygon;
}

const constructPolygon = el => {
  // Create new polygon object and splice its closure into el's prototype chain:
  const origProto = Object.getPrototypeOf(el);
  const polyline = createPolyline(el, origProto);
  const polygon = createPolygon(polyline);
  Object.setPrototypeOf(el,polygon._closure);
}

constructWidgets('polygon4', constructPolygon);
constructWidgets('polygon8', constructPolygon);