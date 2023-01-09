import { isReactive, isReadonly, reactive, readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
  })

  it('warning when readonly call set', () => {
    const user = readonly({
      name: 22
    })
    console.warn = jest.fn()
    user.name++
    expect(console.warn).toBeCalled()
  })

  it('isReadonly', () => {
    const original = { foo: 1 }
    const wrapped = readonly(original)

    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(wrapped)).toBe(true)
  })

  it('isReactive', () => {
    const original = { foo: 1 }
    const wrapped = reactive(original)

    expect(isReactive(original)).toBe(false)
    expect(isReactive(wrapped)).toBe(true)

    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(wrapped)).toBe(false)
  })
})
