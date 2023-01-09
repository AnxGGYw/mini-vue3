import { effect } from '../effect'
import { reactive } from '../reactive'
import { isRef, ref, unRef } from '../ref'

describe('ref', () => {
  it('happy path', () => {
    const num = ref(1)
    expect(num.value).toBe(1)
  })

  it('ref should be reactive', () => {
    let dummy
    const num = ref(1)
    let calledCount = 0
    effect(() => {
      dummy = num.value
      calledCount++
    })
    expect(dummy).toBe(1)
    expect(calledCount).toBe(1)

    // set
    num.value = 2
    expect(calledCount).toBe(2)
    expect(dummy).toBe(2)

    // set same value
    num.value = 2
    expect(calledCount).toBe(2)
    expect(dummy).toBe(2)
  })

  it('ref should nested', () => {
    const obj = ref({
      count: 1
    })
    let dummy: number
    effect(() => {
      dummy = obj.value.count
    })
    expect(dummy).toBe(1)
    obj.value.count = 2

    expect(dummy).toBe(2)

    obj.value = {
      count: 10
    }
    expect(dummy).toBe(10)
  })

  it('isRef', () => {
    const num = ref(1)
    const user = reactive({
      name: 'anXin'
    })

    expect(isRef(num)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(user)).toBe(false)
  })

  it('unRef', () => {
    const num = ref(1)

    expect(unRef(num)).toBe(1)
    expect(unRef(1)).toBe(1)
  })
})
