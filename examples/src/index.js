import VideoContextVisualisation from '../../dist/visualise-videocontext.bundle.js'
import VideoContext from 'videocontext'
import bunny from 'file-loader!./big_buck_bunny.mp4'
import jinglebells from 'file-loader!./jbshort.mp3'

const vc = new VideoContext(document.getElementById('canvas'))

const video = vc.video(bunny)
video.start(0)
video.stop(20)

const transition = vc.transition(VideoContext.DEFINITIONS.CROSSFADE)
transition.transition(0, 0.085567945679567, 0, 1, 'mix')
transition.transition(5, 8, 1, 0, 'mix')

const mono = vc.effect(VideoContext.DEFINITIONS.MONOCHROME)
const translucent = vc.effect(VideoContext.DEFINITIONS.OPACITY)

video.connect(mono)
video.connect(translucent)
mono.connect(transition)
translucent.connect(transition)
transition.connect(vc.destination)

const audio = vc.audio(jinglebells)
audio.start(5)
audio.stop(10)

audio.connect(vc.destination)

vc.play()

const json = vc.snapshot()

const canvas = document.getElementById('vis')

const colours = {
    active: '#51F3AC',
    inactive: '#33986B',
    error: '#F3516C',
    processing: '#F35198',
    destination: '#000',
}

const vis = new VideoContextVisualisation(canvas, colours)
vis.setData(json)

vis.render()

setInterval(() => {
    const json = vc.snapshot()
    vis.setData(json)
    vis.render()
}, 100)
