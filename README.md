# Introduction

This project provides a visualisation of the graph, showing vertices and edges, from a programmatic configuration of [VideoContext](https://github.com/bbc/videocontext).

`visualise-videocontext` is currently receiving maintenance updates but not under active development.

# Example

```js
import VideoContext from 'videocontext'
import VideoContextVisualisation from 'visualise-videocontext'

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

vis.setData(VideoContext.snapshot(vc))
vis.render()

// Update regularly - could also use VideoContext's built-in callbacks to trigger this.
setInterval(() => {
    vis.setData(VideoContext.snapshot(vc))
    // No need to call render() a second time
}, 100)
```

# Development
Do not use yarn! When you run `yarn` it seems to install dependencies incorrectly. I'm not sure what's causing this, but just use npm, at least for installing dependencies.

However it *is* totally fine to use yarn in projects that include `visualise-videocontext` as a dependency.
