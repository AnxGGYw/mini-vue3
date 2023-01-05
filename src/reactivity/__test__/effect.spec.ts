import { effect } from '../effect'
import { reactive } from '../reactive'

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

  it('should return runner when called effect', () => {
    let age = 22
    const runner: any = effect(() => {
      age++
      return 'anXin'
    })
    expect(age).toBe(23)
    // 执行runner
    const r = runner()
    expect(age).toBe(24)
    expect(r).toBe('anXin')
  })
})
