import VideoContextVisualisation from '../../dist/visualise-videocontext.bundle.js'
import VideoContext from 'videocontext'
import bunny from 'file-loader!./big_buck_bunny.mp4'

const vc = new VideoContext(document.getElementById('canvas'))
const v1 = vc.video(bunny)
const v2 = vc.video(bunny)
const comp = vc.compositor(VideoContext.DEFINITIONS.COMBINE)
const transition = vc.transition(VideoContext.DEFINITIONS.CROSSFADE)
const img = vc.image('http://qasci')

v2.connect(comp)
v1.connect(transition)
img.connect(comp)
const eff = vc.effect(VideoContext.DEFINITIONS.MONOCHROME)
comp.connect(eff)
eff.connect(transition)
transition.connect(vc.destination)
v2.start(3)
v1.start(0)
transition.transition(0, 0, 0, 1, 'mix')
transition.transition(5, 8, 1, 0, 'mix')
vc.play()

const json = JSON.parse(VideoContext.exportToJSON(vc))

const canvas = document.getElementById('vis')
const vis = new VideoContextVisualisation(canvas)

v1.stop(20)
v2.stop(20)

vis.setValues(json)
vis.render()

setInterval(() => {
    const json = JSON.parse(VideoContext.exportToJSON(vc))
    vis.setValues(json)
}, 100)
