import { isProxy, isReactive, reactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)

    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
  })

  it('nested reactive', () => {
    const original = { foo: 1, bar: { baz: [123], fn: function () {} } }
    const observed = reactive(original)

    expect(isReactive(original)).toBe(false)

    expect(isReactive(observed)).toBe(true)
    expect(isReactive(observed.bar)).toBe(true)
    expect(isReactive(observed.bar.baz)).toBe(true)
    // fn
    expect(isReactive(observed.bar.fn)).toBe(false)
  })

  it('isProxy, create by reactive', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = reactive(original)

    expect(isProxy(wrapped)).toBe(true)
  })
})
