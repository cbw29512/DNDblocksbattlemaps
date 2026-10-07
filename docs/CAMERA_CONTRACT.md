# Camera and View Contract

> Status: Stage 0 product contract.
>
> Goal: make the 3D block map easy to understand and impossible to "lose" through complicated camera movement.

## Default View

The default camera uses a tabletop-style angled view.

**Default elevation: approximately 30° above the board plane.**

This is intentionally not a mathematically exact isometric camera requirement.

A mathematically exact isometric elevation is roughly 35.3°, but the product goal is readability, not geometric purity.

The implementation may tune the exact value slightly during visual testing, but the user experience should remain a low, readable tabletop angle near 30°.

## Vertical Angle Is Locked for MVP

The user does not freely tilt the camera up/down in MVP.

The camera stays above the board at the chosen tabletop elevation.

This prevents:

- upside-down views
- looking underneath the map
- confusing extreme angles
- additional camera controls a child has to learn

If later testing proves a second elevation useful, it should be added as a simple preset rather than unconstrained free-flight camera control.

## Horizontal Orbit

The camera can orbit horizontally around the current focus point.

This is a full horizontal rotation around the board/focus point while preserving the fixed elevation.

Conceptually:

- elevation stays near 30°
- yaw/orbit angle changes
- the board remains the focus

This lets the DM inspect any side of walls, rooms, creatures, and stacked blocks.

Object rotation is still unnecessary because the camera can move around the map and object art is designed to be readable from useful sides.

## Pan

Pan moves the camera's focus point across the board without changing the camera's viewing angle.

The DM can shift attention from one room/area to another.

Pan does not move any map object.

## Zoom

Zoom moves the camera closer to or farther from the board while retaining the same general viewing angle.

Set reasonable minimum and maximum zoom limits so the user cannot:

- move inside solid blocks accidentally
- zoom so far out that the map becomes useless
- lose the board entirely

## Reset View

There should be one obvious **Reset View / Home** control.

It returns the camera to a known useful position and angle.

This is required for the kid-simple usability goal.

A user should always have an obvious way to recover the view.

## Camera Controls

The product should provide visible, simple camera controls rather than relying only on hidden mouse gestures.

Candidate on-screen controls:

- rotate left
- rotate right
- pan up
- pan down
- pan left
- pan right
- zoom in
- zoom out
- reset/home

These can be compact and visually obvious.

Mouse/touch shortcuts may exist as convenience controls, but the product must remain usable without memorizing them.

## Mouse Convenience Controls

Current candidate behavior:

- mouse wheel = zoom
- right-drag = horizontal orbit
- right-click without meaningful drag = DM BUILD-mode remove
- middle-drag = pan, if supported by the browser/device

Important:

Right-click remove and right-drag orbit must be distinguished by a movement threshold so orbiting does not accidentally delete a block.

Because hidden mouse conventions can be difficult for children, visible camera buttons remain the authoritative discoverable controls.

## Touch/Tablet

The product is web-first and should not make desktop-only input assumptions.

At minimum, visible camera controls must make the camera usable on a touch device.

Potential later touch gestures:

- pinch = zoom
- two-finger drag = pan
- simple rotate gesture or visible rotate buttons = orbit

Do not depend on multitouch gestures for basic usability until tested.

## Focus Point

The camera orbits around a focus point rather than around the global world origin forever.

Initially:

- opening a map focuses the map center
- selecting/entering a room may optionally make that room the convenient current focus
- pan moves the focus point

Do not auto-jump the camera aggressively. User camera movement should remain predictable.

## No First-Person Camera

MVP does not use:

- first-person movement
- WASD walking
- free-fly camera
- FPS-style mouse look

The product is a tabletop, not a Minecraft clone.

## Visibility and No-Ceiling Rule

The fixed elevated camera and no-ceiling room rule work together.

Rooms remain easy to inspect from above.

Orbiting lets the DM/player view different sides without needing roofs to disappear dynamically.

## Rendering Library Fit

Both current rendering candidates support this camera model well:

### Three.js

A constrained OrbitControls-style camera can provide:

- horizontal orbit
- fixed/limited polar angle
- pan
- zoom
- distance limits

### Babylon.js

An ArcRotateCamera-style setup can provide:

- horizontal orbit
- constrained vertical angle
- pan
- zoom/radius limits

This camera contract therefore does not force the Three.js vs Babylon.js decision.

## Usability Test

A child should be able to understand:

> "Turn the map left or right, slide over to another area, zoom in or out, and hit Home if you get lost."

If a user can accidentally flip the camera, go under the board, or permanently lose the map, the camera design has failed.
