let activeEffect: any
let targetMap = new WeakMap()

class ReactiveEffect {
  private fn: any
  constructor(fn: any) {
    this.fn = fn
  }
  run() {
    activeEffect = this
    return this.fn()
  }
}

export function effect(fn) {
  const instance = new ReactiveEffect(fn)
  instance.run()
  // return runner
  return instance.run.bind(instance)
}

// 收集依赖
export function track(target, key) {
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
export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  if (dep && dep.size) {
    for (const effect of dep) {
      effect.run()
    }
  }
}
