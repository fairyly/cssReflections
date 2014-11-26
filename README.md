CSS Reflections
==============

## Description

Photo carousel that can be either user or timer driven for convenience.

## Purpose

Provide a test application for improving the rendering performance of CSS3 box-reflections effects on developer platforms.

For example:

```
-webkit-box-reflect: below 5px -webkit-gradient(linear, 0% 0%, 0% 100%, from(transparent), color-stop(0.25, transparent), to(rgba(255, 255, 255, 0.6)));
```
## Availability

Standalone available here for device testing (note fixed nHD resolution):

[CSSReflections](http://www.papersnail.co.uk/portfolio/CSSReflections/ "Standalone")

Embedded in [testrig][1] available here:

[CSSReflections in test rig](http://www.papersnail.co.uk/sandbox/shell/index.html?http://www.papersnail.co.uk/portfolio/CSSReflections/?nHD "In test rig")


## Notes
* Designed using Fireworks initially (source png included in assets directory).
* Seems to be a bug in Chrome (report raised) where the reflection disappears after transitioning. Bug now fixed (26th Nov 2014)!
* Works as intended in Safari.

## Limitations
* Webkit only.

## Todo
* Would benefit from proper touch event handling.
* Add support for landscape orientation.

[1]: https://github.com/swervo/cssSandbox
