import * as assert from 'assert'
import { monoidString } from '../src/Monoid'
import { none, option, some } from '../src/Option'
import { ordNumber } from '../src/Ord'
import { Pair, getMonoid, getOrd, getSemigroup, getSetoid, pair } from '../src/Pair'
import { semigroupString } from '../src/Semigroup'
import { setoidNumber } from '../src/Setoid'

describe('Pair', () => {
  it('first', () => {
    const double = (n: number): number => n * 2
    assert.deepEqual(new Pair(1, 2).first(double), new Pair(2, 2))
  })

  it('second', () => {
    const double = (n: number): number => n * 2
    assert.deepEqual(new Pair(1, 2).second(double), new Pair(1, 4))
  })

  it('map', () => {
    const double = (n: number): number => n * 2
    assert.deepEqual(new Pair(1, 2).map(double), new Pair(2, 4))
    assert.deepEqual(pair.map(new Pair(1, 2), double), new Pair(2, 4))
  })

  it('of', () => {
    assert.deepEqual(pair.of(1), new Pair(1, 1))
  })

  it('ap', () => {
    const double = (n: number): number => n * 2
    const inc = (n: number): number => n + 1
    assert.deepEqual(new Pair(1, 2).ap(new Pair(double, inc)), new Pair(2, 3))
    assert.deepEqual(pair.ap(new Pair(double, inc), new Pair(1, 2)), new Pair(2, 3))
    assert.deepEqual(new Pair(double, inc).ap_(new Pair(1, 2)), new Pair(2, 3))
  })

  it('reduce', () => {
    assert.deepEqual(new Pair('a', 'b').reduce('', (b, a) => b + a), 'ab')
    assert.deepEqual(pair.reduce(new Pair('a', 'b'), '', (b, a) => b + a), 'ab')
  })

  it('extract', () => {
    assert.deepEqual(new Pair('a', 'b').extract(), 'a')
    assert.deepEqual(pair.extract(new Pair('a', 'b')), 'a')
  })

  it('extend', () => {
    const f = (p: Pair<string>) => p.fst + p.snd
    assert.deepEqual(new Pair('a', 'b').extend(f), new Pair('ab', 'ba'))
    assert.deepEqual(pair.extend(new Pair('a', 'b'), f), new Pair('ab', 'ba'))
  })

  it('traverse', () => {
    assert.deepEqual(pair.traverse(option)(new Pair(0, 1), n => (n >= 0 ? some(n) : none)), some(new Pair(0, 1)))
    assert.deepEqual(pair.traverse(option)(new Pair(0, 1), n => (n >= 2 ? some(n) : none)), none)
  })

  it('getSetoid', () => {
    const S = getSetoid(setoidNumber)
    assert.strictEqual(S.equals(new Pair(1, 2), new Pair(1, 2)), true)
    assert.strictEqual(S.equals(new Pair(1, 2), new Pair(1, 3)), false)
    assert.strictEqual(S.equals(new Pair(1, 2), new Pair(2, 2)), false)
  })

  it('getOrd', () => {
    const O = getOrd(ordNumber)
    assert.strictEqual(O.compare(new Pair(0, 2), new Pair(1, 2)), -1)
    assert.strictEqual(O.compare(new Pair(1, 2), new Pair(1, 2)), 0)
    assert.strictEqual(O.compare(new Pair(2, 2), new Pair(1, 2)), 1)
    assert.strictEqual(O.compare(new Pair(1, 2), new Pair(1, 3)), -1)
    assert.strictEqual(O.compare(new Pair(1, 2), new Pair(1, 1)), 1)
  })

  it('getSemigroup', () => {
    const S = getSemigroup(semigroupString)
    assert.deepEqual(S.concat(new Pair('a', 'b'), new Pair('c', 'd')), new Pair('ac', 'bd'))
  })

  it('getMonoid', () => {
    const S = getMonoid(monoidString)
    assert.deepEqual(S.concat(new Pair('a', 'b'), new Pair('', '')), new Pair('a', 'b'))
    assert.deepEqual(S.concat(new Pair('', ''), new Pair('a', 'b')), new Pair('a', 'b'))
  })
})
