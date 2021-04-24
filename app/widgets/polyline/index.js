import { constructWidgets } from '../construct-widgets';

const construct = el => {
  const lineEls = el.getElementsByTagName('line');
  // Because the following attributes are set only when the widget is constructed, they won't respond to subsequent changes.

  el.redraw = () => {
    lineEls[0].x1 = lineEls[0].y1 = 50; lineEls[0].x2= lineEls[0].y2 = 250;
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
          console.log(`stroke-width=${attributeValue}`)
          el.strokeWidth = Number(attributeValue);
          break;
        case 'points':
          console.log(`points=${attributeValue}`)
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