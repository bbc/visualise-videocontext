import visualise from '../../dist/visualise-videocontext.bundle.js'
import VideoContext from 'videocontext'
import bunny from 'file-loader!./big_buck_bunny.mp4'

console.log(visualise)
const vc = new VideoContext(document.getElementById('canvas'))
const v1 = vc.video(bunny)
v1.connect(vc.destination)
v1.start(0)
vc.play()
