import document from 'document'
import './widgets/polyline'

const myPolyline4El = document.getElementById('myPolyline4')
myPolyline4El.setPoint(3, 50, 50)
myPolyline4El.setPoint(4, 0, 50)

const myPolygon8El = document.getElementById('myPolygon8')
myPolygon8El.setPoint(3, 50, 50)
myPolygon8El.setPoint(4, 0, 0)
myPolygon8El.setPoint(5, 30, 70)
