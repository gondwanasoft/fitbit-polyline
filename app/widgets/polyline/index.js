import { constructWidgets } from '../construct-widgets';

const construct = el => {
  const lineEls = el.getElementsByTagName('line');
  // Because the following attributes are set only when the widget is constructed, they won't respond to subsequent changes.

  el.redraw = () => {
    //lineEls[0].x1 = lineEls[0].y1 = 50; lineEls[0].x2= lineEls[0].y2 = 250;
  }

  Object.defineProperty(el, 'strokeWidth', {
    set: function(newValue) {
      lineEls.forEach(line => {line.style.strokeWidth = newValue;});
      el.redraw();
    }
  })

  const doConfig = configEl => {
    const attributes = configEl.text.split(';')
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
          const lineCount = Math.floor(coords.length / 2) - 1
          // TODO 9 should do some range-checking!
          console.log(`len=${coords.length} lineCount=${lineCount}`)
          let lineIndex = 0, x, y
          for (let i = 0; i < coords.length; i += 2) {
            x = Number(coords[i]); y = Number(coords[i + 1]);
            if (lineIndex < lineCount) {
              lineEls[lineIndex].x1 = x; lineEls[lineIndex].y1 = y;
            }
            if (lineIndex) {
              lineEls[lineIndex-1].x2 = x; lineEls[lineIndex-1].y2 = y;
            }
            lineIndex++;
          }
          // Hide unused line segments:
          for (let i = 0; i < lineEls.length; i++)
            lineEls[i].style.display = i < lineCount? 'inline' : 'none';

          break;
      }
    })
  }

  ;(function() {       //initialisation IIFE
    const configEl = el.getElementById('config');
    if (configEl) doConfig(configEl);

    el.redraw();
  })()
}

constructWidgets('polyline4', construct);
// TODO 2 try cap = butt