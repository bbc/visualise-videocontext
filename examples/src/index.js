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

const mono = vc.effect(VideoContext.DEFINITIONS.MONOCHROME)
const translucent = vc.effect(VideoContext.DEFINITIONS.OPACITY)

video.connect(mono)
video.connect(translucent)
mono.connect(transition)
translucent.connect(transition)
transition.connect(vc.destination)

vc.play()

const json = JSON.parse(VideoContext.exportToJSON(vc))

const canvas = document.getElementById('vis')
const vis = new VideoContextVisualisation(canvas)

vis.setData(json)
vis.render()

setInterval(() => {
    const json = JSON.parse(VideoContext.exportToJSON(vc))
    vis.setData(json)
}, 100)
