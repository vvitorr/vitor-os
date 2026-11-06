// Self-check for the game rules: node src/apps/games/logic.check.ts
import assert from "node:assert/strict";
import { hitsWall, placeFloor } from "./logic.ts";

// Packet Hop
assert.equal(hitsWall(100, 200, 10, 300, 60, 200, 120), false, "far left of the wall");
assert.equal(hitsWall(320, 200, 10, 300, 60, 200, 120), false, "centred in the gap");
assert.equal(hitsWall(320, 145, 10, 300, 60, 200, 120), true, "clips the top edge of the gap");
assert.equal(hitsWall(320, 255, 10, 300, 60, 200, 120), true, "clips the bottom edge of the gap");
assert.equal(hitsWall(295, 50, 10, 300, 60, 200, 120), true, "touches the wall face");

// Skyline
const base = { x: 100, w: 160 };
assert.deepEqual(placeFloor(base, 103, 160), { miss: false, kept: { x: 100, w: 160 }, cuts: [], perfect: true }, "perfect snaps");
assert.deepEqual(placeFloor(base, 140, 160), { miss: false, kept: { x: 140, w: 120 }, cuts: [{ x: 260, w: 40 }], perfect: false }, "right overhang cut");
assert.deepEqual(placeFloor(base, 60, 160), { miss: false, kept: { x: 100, w: 120 }, cuts: [{ x: 60, w: 40 }], perfect: false }, "left overhang cut");
assert.deepEqual(placeFloor(base, 260, 160), { miss: true }, "edge-to-edge is a miss");
assert.deepEqual(placeFloor(base, 80, 200), { miss: false, kept: { x: 100, w: 160 }, cuts: [{ x: 80, w: 20 }, { x: 260, w: 20 }], perfect: false }, "wider floor cut on both sides");

console.log("game logic ok");
