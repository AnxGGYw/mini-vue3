import { effect } from '../effect'
import { reactive } from '../reactive'
import { isRef, proxyRefs, ref, unRef } from '../ref'

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

  it('proxyRefs', () => {
    const obj = {
      name: 'anXin',
      age: ref(22)
    }
    const proxyObj = proxyRefs(obj)

    // proxyRefs 里面的ref 不用使用.value形式访问

    /**
     * setup() {
     *   const num = ref(10)
     *   return {
     *     num
     *   }
     * }
     */
    // template 可以也可以不用.value来访问ref的值
    expect(proxyObj.age).toBe(22)
    expect(proxyObj.name).toBe('anXin')

    proxyObj.age = 23
    expect(proxyObj.age).toBe(23)
    expect(obj.age.value).toBe(23)

    proxyObj.age = ref(24)
    expect(proxyObj.age).toBe(24)
    expect(obj.age.value).toBe(24)
  })
})
