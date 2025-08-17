import { assert } from 'chai'
import * as _ from '..'

describe('random module', () => {
  describe('random function', () => {
    test('returns a number', () => {
      const result = _.random(0, 100)
      assert.isAtLeast(result, 0)
      assert.isAtMost(result, 100)
    })
  })

  describe('uid function', () => {
    test('generates the correct length string', () => {
      const result = _.uid(10)
      assert.equal(result.length, 10)
    })
    /**
     * @warning This is potentially a flaky test.
     * We're trying to assert that given additional
     * special chars our function will include them
     * in the random selection process to generate the
     * uid. However, there is always a small chance that
     * one is never selected. If the test is flaky, increase
     * the size of the uid and/or the number of underscores
     * in the special char addition.
     */
    test('uid generates string including special', () => {
      const result = _.uid(
        300,
        '________________________________________________________________'
      )
      assert.include(result, '_')
    })
  })

  describe('shuffle function', () => {
    test('returns list with same number of items', () => {
      const list = [1, 2, 3, 4, 5]
      const result = _.shuffle(list)
      assert.equal(list.length, result.length)
    })
    test('returns list with same value', () => {
      const list = [1, 2, 3, 4, 5]
      const totalBefore = _.sum(list)
      const result = _.shuffle(list)
      const totalAfter = _.sum(result)
      assert.equal(totalBefore, totalAfter)
    })
    test('returns copy of list without mutatuing input', () => {
      const list = [1, 2, 3, 4, 5]
      const result = _.shuffle(list)
      assert.notEqual(list, result)
      assert.deepEqual(list, [1, 2, 3, 4, 5])
    })
  })

  describe('draw function', () => {
    test('returns a string from the list', () => {
      const letters = 'abcde'
      const result = _.draw(letters.split(''))
      assert.include(letters, result!)
    })
    test('returns a item from the list', () => {
      const list = [
        { id: 'a', word: 'hello' },
        { id: 'b', word: 'oh' },
        { id: 'c', word: 'yolo' }
      ]
      const result = _.draw(list)
      assert.include('abc', result!.id)
    })
    test('returns null given empty input', () => {
      const list: unknown[] = []
      const result = _.draw(list)
      assert.isNull(result)
    })
  })
})

describe('jitter', () => {
  it('returns the base delay when factor is 0', () => {
    const delay = 1000
    for (let i = 0; i < 5; i++) {
      const result = _.jitter(delay, 0)
      assert.strictEqual(result, delay)
    }
  })

  it('returns a value within the expected jitter range', () => {
    const delay = 1000
    const factor = 0.3
    // Expected range: [700, 1300]
    for (let i = 0; i < 20; i++) {
      const result = _.jitter(delay, factor)
      assert.ok(result >= 700 && result <= 1300, `Got ${result}`)
    }
  })

  it('never returns a negative value', () => {
    for (let i = 0; i < 10; i++) {
      const result = _.jitter(0, 1)
      assert.ok(result >= 0)
    }
  })

  it('uses default factor 0.2 when not provided', () => {
    const delay = 1000
    // Expected range: [800, 1200]
    for (let i = 0; i < 10; i++) {
      const result = _.jitter(delay)
      assert.ok(result >= 800 && result <= 1200, `Got ${result}`)
    }
  })

  it('returns 0 for negative delay', () => {
    const result = _.jitter(-100, 0.5)
    assert.strictEqual(result, 0)
  })

  it('returns 0 for NaN delay', () => {
    const result = _.jitter(NaN, 0.5)
    assert.strictEqual(result, 0)
  })

  it('returns 0 for Infinity delay', () => {
    const result = _.jitter(Infinity, 0.5)
    assert.strictEqual(result, 0)
  })

  it('treats negative factor as 0', () => {
    const delay = 1000
    const result = _.jitter(delay, -0.5)
    assert.strictEqual(result, delay)
  })

  it('treats NaN factor as 0', () => {
    const delay = 1000
    const result = _.jitter(delay, NaN)
    assert.strictEqual(result, delay)
  })

  it('treats Infinity factor as 0', () => {
    const delay = 1000
    const result = _.jitter(delay, Infinity)
    assert.ok(result >= 0)
  })
})
