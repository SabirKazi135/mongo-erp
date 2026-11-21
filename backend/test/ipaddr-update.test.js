'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const backendRoot = path.resolve(__dirname, '..');

test('ipaddr.js is resolved to 2.5.0 in the lockfile', () => {
  const lock = JSON.parse(
    fs.readFileSync(path.join(backendRoot, 'package-lock.json'), 'utf8')
  );

  assert.equal(lock.packages['node_modules/ipaddr.js'].version, '2.5.0');
});

test('proxy-addr accepts the IPv4 notations supported by ipaddr.js 2.5.0', () => {
  // ipaddr.js 1.9.1 rejected shortened IPv4 notation, so compiling this
  // trust entry used to throw. ipaddr.js 2.5.0 accepts it.
  assert.doesNotThrow(() => require('proxy-addr').compile('1.2.3'));
});

test('proxy-addr keeps trusting only the configured IPv4 ranges', () => {
  const trust = require('proxy-addr').compile('10.0.0.0/8');

  assert.equal(trust('10.1.2.3'), true);
  assert.equal(trust('192.168.1.1'), false);
});
