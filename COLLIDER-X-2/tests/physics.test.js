import test from 'node:test';import assert from 'node:assert/strict';import{fourVector,combine,normalizeEvent,missingTransverseMomentum}from'../src/physics.js';
test('massless central object has E equal to pT',()=>{const v=fourVector({pt:10,eta:0,phi:0,mass:0});assert.equal(v.E,10);assert.equal(v.px,10);assert.equal(v.py,0);});
test('invariant mass of two opposite massless transverse momenta',()=>{const m=combine([{pt:10,eta:0,phi:0,mass:0},{pt:10,eta:0,phi:Math.PI,mass:0}]);assert.ok(Math.abs(m.mass-20)<1e-8);});
test('normalises Cartesian momenta',()=>{const p=normalizeEvent([{px:3,py:4,pz:0,mass:0}])[0];assert.equal(p.pt,5);assert.equal(p.phi,Math.atan2(4,3));});
test('missing transverse momentum is negative vector sum',()=>{const m=missingTransverseMomentum([{pt:10,eta:0,phi:0,mass:0}]);assert.ok(Math.abs(m.px+10)<1e-8);assert.ok(Math.abs(m.pt-10)<1e-8);});
