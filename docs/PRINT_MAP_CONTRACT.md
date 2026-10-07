# Print Map Contract

> Status: Stage 1 implementation contract.

## Goal

A DM can build digitally, then print the encounter as a physical tabletop battle map.

## Physical Scale

**1 grid square = 1 inch on paper = 5 feet in the game world.**

The browser print dialog should use **Actual Size / 100%** to preserve exact scale.

## Page Tiling

Initial format:

- US Letter portrait
- 0.25-inch page margin
- 8 grid columns × 10 grid rows per sheet
- each grid cell = exactly 1in × 1in
- large maps automatically tile across as many sheets as required
- corner alignment marks appear on each sheet

## Paper Efficiency

Do not print the entire 30×30 default workspace when only a small room was built.

Compute the X/Z bounds of placed objects and print:

- used footprint
- plus one grid square of padding where board bounds allow

An empty board prints one 8×10 test sheet.

## Top-Down Content

Printing is a separate derived top-down view, not a screenshot of the 3D camera.

For an occupied square:

- display the highest-elevation object in that square
- art-backed objects use their catalog face art
- non-art objects use catalog color plus a readable label

This is intentionally simple for Stage 1.

Later hidden/DM-only state must respect the print mode chosen by the DM.

## State Rule

Print layout is derived from authoritative BoardState.

Do not save rendered print pages as canonical world state.
