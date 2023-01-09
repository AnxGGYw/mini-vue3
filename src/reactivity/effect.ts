import { extend } from '../shared'

let activeEffect: ReactiveEffect | undefined
let shouldTrack: boolean

let targetMap = new WeakMap()

interface effectOptions {
  scheduler?: Function
  onStop?: Function
}

export class ReactiveEffect {
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
  effect.deps.length = 0
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
  if (!isTracking()) return

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

  trackEffect(dep)
}

export function trackEffect(dep) {
  // 小优化,已经在dep中，不需要重复收集，虽然是这里是Set类型，但是要想到这一点
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  // effect反向收集dep，stop方法才能知道
  activeEffect.deps.push(dep)
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

// 派发更新，触发依赖
export function trigger(target: any, key: string | symbol) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  triggerEffect(dep)
}

export function triggerEffect(dep: Set<ReactiveEffect>) {
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
