# Example

```js
import VideoContext from 'videocontext'
import VideoContextVisualisation from 'visualise-videocontext'

const vc = new VideoContext(document.getElementById('canvas'))
const v1 = vc.video(bunny)
const eff = vc.effect(VideoContext.DEFINITIONS.MONOCHROME)
v1.connect(eff)
eff.connect(vc.destination)
v1.start(0)
vc.play()

const vis = new VideoContextVisualisation(document.getElementById('vis'))

vis.setValues(JSON.parse(VideoContext.exportToJSON(vc)))
vis.render()

setInterval(() => {
    vis.setValues(JSON.parse(VideoContext.exportToJSON(vc)))
    // No need to call render() a second time
}, 100)
```
