import { effect } from '../src/effect'
import { reactive } from '../src/reactive'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 22
    })

    let effectAge
    effect(() => {
      effectAge = user.age
    })
    expect(effectAge).toBe(22)

    // update
    user.age++
    expect(effectAge).toBe(23)
  })
})
