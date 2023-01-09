import { extend } from '../shared'

let activeEffect: ReactiveEffect | undefined
let shouldTrack: boolean

let targetMap = new WeakMap()

interface effectOptions {
  scheduler?: Function
  onStop?: Function
}

class ReactiveEffect {
  private fn: Function
  deps: Set<ReactiveEffect>[] = []
  active: boolean = true
  onStop: Function
  scheduler?: Function
  constructor(fn: Function) {
    this.fn = fn
  }
  run() {
    if (!this.active) {
      return this.fn()
    }
    shouldTrack = true
    activeEffect = this
    const res = this.fn()

    // reset shouldTrack
    shouldTrack = false

    return res
  }
  stop() {
    if (this.active) {
      // 可选链 this.onStop && this.onStop()
      this.onStop?.()

      clearUpEffect(this)
      this.active = false
    }
  }
}

// 清空当前effect
function clearUpEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep: Set<ReactiveEffect>) => {
    dep.delete(effect)
  })
}

export function effect(fn: Function, options: effectOptions = {}) {
  // fn
  const _effect = new ReactiveEffect(fn)

  // 合并options
  extend(_effect, options)

  _effect.run()

  const runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

// 收集依赖
export function track(target: any, key: string | symbol) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  if (!activeEffect) return
  if (!shouldTrack) return

  dep.add(activeEffect)
  // effect反向收集dep，stop方法才能知道
  activeEffect.deps.push(dep)
}

// 派发更新，触发依赖
export function trigger(target: any, key: string | symbol) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  if (dep && dep.size) {
    for (const effect of dep) {
      if (effect.scheduler) {
        effect.scheduler()
      } else {
        effect.run()
      }
    }
  }
}

export function stop(runner: any) {
  runner.effect.stop()
}
