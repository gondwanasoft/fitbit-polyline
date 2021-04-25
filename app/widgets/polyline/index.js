import { constructWidgets } from '../construct-widgets';

const construct = el => {
  const lineEls = el.getElementsByTagName('line');
  let lineCount = 0;    // number of visible line segments
  // Because the following attributes are set only when the widget is constructed, they won't respond to subsequent changes.

  const _setPoint = (index, x, y) => {
    // Doesn't update line display.
    if (index < lineEls.length) {
      lineEls[index].x1 = x; lineEls[index].y1 = y;
    }
    if (index) {
      lineEls[index-1].x2 = x; lineEls[index-1].y2 = y;
    }
  }

  const _setLineCount = newLineCount => {
    //console.log(`lineCount=${lineCount}`)
    // Unhide newly-used line segments:
    for (let i = lineCount; i < newLineCount; i++)
      lineEls[i].style.display = 'inline';

    lineCount = newLineCount;
  }

  el.setPoint = (index, x, y) => {
    _setPoint(index, x, y);
    if (index > lineCount) _setLineCount(index);
  }

  Object.defineProperty(el, 'strokeWidth', {
    set: function(newValue) {
      lineEls.forEach(line => {line.style.strokeWidth = newValue;});
    }
  })

  ;(function() {       //initialisation IIFE
    // Parse and process config attributes:
    const attributes = el.getElementById('config').text.split(';')
    console.log(`config=${attributes}`)
    attributes.forEach(attribute => {
      const colonIndex = attribute.indexOf(':')
      const attributeName = attribute.substring(0, colonIndex).trim()
      const attributeValue = attribute.substring(colonIndex+1).trim()
      console.log(`"${attributeName}"="${attributeValue}"`)

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
    })
  })()
}

constructWidgets('polyline4', construct);