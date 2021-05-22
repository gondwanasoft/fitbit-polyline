import document from 'document'
import './widgets/polyline'

const myPolyline4El = document.getElementById('myPolyline4')
myPolyline4El.setPoint(3, 50, 50)   // add a new point
myPolyline4El.setPoint(4, 0, 50)    // add a new point
myPolyline4El.strokeWidth = 2

const myPolygon8El = document.getElementById('myPolygon8')
myPolygon8El.setPoint(2, 80, 0)     // change an extant point
myPolygon8El.setPoint(3, 50, 50)    // add a new point
myPolygon8El.setPoint(4, 0, 0)      // add a new point
myPolygon8El.setPoint(5, 30, 70)    // add a new point
myPolygon8El.strokeWidth = 2

dumpProperties(document.getElementById('myPolygon8'))

function dumpProperties(obj) {  // This isn't needed; it's just to show how everything links together
  let proto = obj
  let level = 0
  let type
  do {
    console.log(`Members (level ${level++}):`)
    for(const memberName in proto) {
      if (proto.hasOwnProperty(memberName)) {
        try {
          const member = obj[memberName]  // get member from top-level obj rather than proto, as the latter crashes if not a function
          type = typeof member
        } catch(e) {
          type = 'INACCESSIBLE'
        }
        console.log(`  ${memberName} (${type})`)
      }
    }
    proto = Object.getPrototypeOf(proto)
    console.log('  ---------------')
  } while (proto)
}

