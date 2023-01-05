let activeEffect: any
let targetMap = new WeakMap()

interface effectOptions {
  scheduler?: Function
}

class ReactiveEffect {
  private fn: Function
  constructor(fn: Function, public scheduler?: Function) {
    this.fn = fn
  }
  run() {
    activeEffect = this
    return this.fn()
  }
}

export function effect(fn: Function, options: effectOptions = {}) {
  const instance = new ReactiveEffect(fn, options.scheduler)
  instance.run()
  // return runner
  return instance.run.bind(instance)
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
  dep.add(activeEffect)
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
