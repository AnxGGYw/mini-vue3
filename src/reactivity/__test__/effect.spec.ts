import { effect, stop } from '../effect'
import { reactive } from '../reactive'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 22
    })

    let dummy
    effect(() => {
      dummy = user.age
    })
    expect(dummy).toBe(22)

    // update
    user.age++
    expect(dummy).toBe(23)
  })

  it('should return runner when called effect', () => {
    let dummy = 22
    const runner: any = effect(() => {
      dummy++
      return 'anXin'
    })
    expect(dummy).toBe(23)
    // 执行runner
    const r = runner()
    expect(dummy).toBe(24)
    expect(r).toBe('anXin')
  })

  it('scheduler', () => {
    // 1. 通过 effect 第二个参数，给定一个 scheduler的 fn
    // 2. effect第一次执行的时候，还会执行第一个参数的fn
    // 3. 当响应式对象 set update 的时候，不执行第一个参数的fn，而是执行scheduler
    // 4. 执行 effect 返回值 runner 的时候，会再次执行第一个参数的fn
    let dummy
    let run

    const scheduler = jest.fn(() => {
      run = runner
    })
    const user = reactive({
      age: 22
    })
    const runner = effect(
      () => {
        dummy = user.age
      },
      { scheduler }
    )
    // 第一次scheduler不会被执行
    expect(scheduler).not.toHaveBeenCalled()
    // effect第一个参数fn执行
    expect(dummy).toBe(22)
    user.age++
    // 响应式数据变化时，只会执行scheduler, 不会执行effect第一个参数fn
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(22)
    // 执行effect返回值runner时，只会执行effect第一个参数fn，不会执行scheduler
    run()
    expect(dummy).toBe(23)
    expect(scheduler).toHaveBeenCalledTimes(1)
  })

  it('stop', () => {
    let dummy
    const user = reactive({
      age: 22
    })
    const runner = effect(() => {
      dummy = user.age
      return 'anXin'
    })
    user.age = 23
    expect(dummy).toBe(23)
    stop(runner)
    user.age = 24
    expect(dummy).toBe(23)
    const r = runner()
    expect(r).toBe('anXin')
    expect(dummy).toBe(24)
  })

  it('onStop', () => {
    let dummy
    const user = reactive({
      age: 22
    })
    const onStop = jest.fn()
    const runner = effect(
      () => {
        dummy = user.age
      },
      {
        onStop
      }
    )
    expect(dummy).toBe(22)
    user.age++
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
    expect(dummy).toBe(23)
  })
})
