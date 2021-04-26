import { constructWidgets } from '../construct-widgets';

const _constructPolyData = el => {
  return {
    lineEls: el.getElementsByTagName('line'),
    lineCount: 0    // number of visible line segments
  }
}

const _setPoint = (polyData, index, x, y) => {
  // Doesn't update line display.
  if (index < polyData.lineEls.length) {
    polyData.lineEls[index].x1 = x; polyData.lineEls[index].y1 = y;
  }
  if (index) {
    polyData.lineEls[index-1].x2 = x; polyData.lineEls[index-1].y2 = y;
  }
}

const _setLineCount = (polyData, newLineCount) => {
  //console.log(`_setLineCount() newLineCount=${newLineCount}`)
  // Unhide newly-used line segments:
  for (let i = polyData.lineCount; i < newLineCount; i++)
    polyData.lineEls[i].style.display = 'inline';

  polyData.lineCount = newLineCount;
}

const _closePoly = polyData => {
  // Make the last line connect to the first line.
  polyData.lineEls[polyData.lineCount - 1].x2 = polyData.lineEls[0].x1;
  polyData.lineEls[polyData.lineCount - 1].y2 = polyData.lineEls[0].y1;
}

const _constructPoly = (el, polyData) => {
  // Construction code common to polylines and polygons.

  Object.defineProperty(el, 'strokeWidth', {
    set: function(newValue) {
      polyData.lineEls.forEach(line => {line.style.strokeWidth = newValue;});
    }
  })

  el.setPoint = (index, x, y) => {
    _setPoint(polyData, index, x, y);
    let newLineCount = index;
    if (polyData.polygon && index >= polyData.lineCount) {
      newLineCount++;   // new point added to polygon
    }

    if (newLineCount > polyData.lineCount) _setLineCount(polyData, newLineCount);

    if (polyData.polygon && (!index || index === polyData.lineCount-1)) _closePoly(polyData);
  }

  // Parse and process config attributes:
  //console.log(`constructPoly() arg=${polyData} (${typeof polyData})`);
  const attributes = el.getElementById('config').text.split(';')
  //console.log(`config=${attributes}`)
  attributes.forEach(attribute => {
    const colonIndex = attribute.indexOf(':')
    const attributeName = attribute.substring(0, colonIndex).trim()
    const attributeValue = attribute.substring(colonIndex+1).trim()
    //console.log(`"${attributeName}"="${attributeValue}"`)

    switch(attributeName) {
      case 'stroke-width':
        el.strokeWidth = Number(attributeValue);
        break;
      case 'points':
        const coords = attributeValue.split(/[ ,]/);
        // TODO 9 should do some range-checking!
        let pointIndex = 0, x, y
        for (let coordIndex = 0; coordIndex < coords.length; coordIndex += 2) {
          x = Number(coords[coordIndex]); y = Number(coords[coordIndex + 1]);
          _setPoint(polyData, pointIndex++, x, y);
        }
        let lineCount = Math.floor(coords.length / 2) - 1;
        if (polyData.polygon) {   // shape needs closing, which will require another line
          lineCount++;
        }
        _setLineCount(polyData, lineCount);
        if (polyData.polygon) _closePoly(polyData);
        break;
    }
  })
}

const constructPolyline = el => {
  const polyData = _constructPolyData(el);

  ;(function() {       //initialisation IIFE
    _constructPoly(el, polyData);
  })()
}

const constructPolygon = el => {
  const polyData = _constructPolyData(el);
  polyData.polygon = true;

  ;(function() {       //initialisation IIFE
    _constructPoly(el, polyData);
  })()
}

constructWidgets('polyline4', constructPolyline);
constructWidgets('polyline8', constructPolyline);
constructWidgets('polygon4', constructPolygon);
constructWidgets('polygon8', constructPolygon);