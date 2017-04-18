import VideoContextVisualisation from '../../dist/visualise-videocontext.bundle.js'
import VideoContext from 'videocontext'
import bunny from 'file-loader!./big_buck_bunny.mp4'

const vc = new VideoContext(document.getElementById('canvas'))
const v1 = vc.video(bunny)
const v2 = vc.video(bunny)
const comp = vc.compositor(VideoContext.DEFINITIONS.COMBINE)

v1.connect(comp)
v2.connect(comp)
comp.connect(vc.destination)
v2.start(3)
v1.start(0)
vc.play()

const json = JSON.parse(VideoContext.exportToJSON(vc))

const canvas = document.getElementById('vis')
const vis = new VideoContextVisualisation(canvas)
vis.setValues(json)
vis.render()
