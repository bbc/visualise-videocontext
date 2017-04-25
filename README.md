# Example

```js
import VideoContext from 'videocontext'
import VideoContextVisualisation from '@bbc/visualise-videocontext'

// 1. Set up VideoContext graph
const vc = new VideoContext(document.getElementById('canvas'))
const v1 = vc.video('http://somewebsite.com/some-video.mp4')
v1.start(0)
const eff = vc.effect(VideoContext.DEFINITIONS.MONOCHROME)
v1.connect(eff)
eff.connect(vc.destination)
vc.play()

// 2. Visualise VideoContext graph

const div = document.getElementById('vis')
// eg <div id="vis"></div> with width and height set in css.

const vis = new VideoContextVisualisation(div)

vis.setValues(JSON.parse(VideoContext.exportToJSON(vc)))
vis.render()

// Update regularly - could also use VideoContext's built-in callbacks to trigger this.
setInterval(() => {
    vis.setValues(JSON.parse(VideoContext.exportToJSON(vc)))
    // No need to call render() a second time
}, 100)
```
