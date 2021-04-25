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
  console.log(`_setLineCount() newLineCount=${newLineCount}`)
  // Unhide newly-used line segments:
  for (let i = polyData.lineCount; i < newLineCount; i++)
    polyData.lineEls[i].style.display = 'inline';

  polyData.lineCount = newLineCount;
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
      // new point added to polygon, so join up ends:
      polyData.lineEls[index].x2 = polyData.lineEls[0].x1;
      polyData.lineEls[index].y2 = polyData.lineEls[0].y1;
      newLineCount++;
    }
    if (newLineCount > polyData.lineCount) _setLineCount(polyData, newLineCount);
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
        if (polyData.polygon) { // close the shape
          polyData.lineEls[lineCount].x2 = polyData.lineEls[0].x1;
          polyData.lineEls[lineCount].y2 = polyData.lineEls[0].y1;
          lineCount++;
        }
        _setLineCount(polyData, lineCount);
        break;
    }
  })
}

const constructPolyline = el => {
  const polyData = _constructPolyData(el);
  //const lineEls = el.getElementsByTagName('line');
  //let lineCount = 0;    // number of visible line segments

  /*const _setPoint = (index, x, y) => {
    // Doesn't update line display.
    if (index < lineEls.length) {
      lineEls[index].x1 = x; lineEls[index].y1 = y;
    }
    if (index) {
      lineEls[index-1].x2 = x; lineEls[index-1].y2 = y;
    }
  }*/

  /*const _setLineCount = newLineCount => {
    // Unhide newly-used line segments:
    for (let i = lineCount; i < newLineCount; i++)
      lineEls[i].style.display = 'inline';

    lineCount = newLineCount;
  }*/

  /*el.setPoint = (index, x, y) => {
    _setPoint(index, x, y);
    if (index > lineCount) _setLineCount(index);
  }*/

  /*Object.defineProperty(el, 'strokeWidth', {
    set: function(newValue) {
      lineEls.forEach(line => {line.style.strokeWidth = newValue;});
    }
  })*/

  ;(function() {       //initialisation IIFE
    _constructPoly(el, polyData);
    /*// Parse and process config attributes:
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
            _setPoint(pointIndex++, x, y);
          }
          _setLineCount(Math.floor(coords.length / 2) - 1);
          break;
      }
    })*/
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