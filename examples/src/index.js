import VideoContextVisualisation from '../../dist/visualise-videocontext.bundle.js'
import VideoContext from 'videocontext'
import bunny from 'file-loader!./big_buck_bunny.mp4'

const vc = new VideoContext(document.getElementById('canvas'))

const video = vc.video(bunny)
video.start(0)
video.stop(20)

const transition = vc.transition(VideoContext.DEFINITIONS.CROSSFADE)
transition.transition(0, 0, 0, 1, 'mix')
transition.transition(5, 8, 1, 0, 'mix')

const eff = vc.effect(VideoContext.DEFINITIONS.MONOCHROME)

const comp = vc.compositor(VideoContext.DEFINITIONS.COMBINE)

video.connect(eff)
video.connect(comp)
eff.connect(transition)
comp.connect(transition)
transition.connect(vc.destination)

vc.play()

const json = JSON.parse(VideoContext.exportToJSON(vc))

const canvas = document.getElementById('vis')
const vis = new VideoContextVisualisation(canvas)

vis.setValues(json)
vis.render()

setInterval(() => {
    const json = JSON.parse(VideoContext.exportToJSON(vc))
    vis.setValues(json)
}, 100)
