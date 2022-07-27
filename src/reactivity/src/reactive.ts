import { track, trigger } from './effect'

export function reactive(raw: any) {
  const proxy = new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key)
      // 收集依赖 ( 收集ReactiveEffect实例 )
      track(target, key)

      return res
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      // 派发更新，触发依赖
      trigger(target, key)

      return res
    }
  })

  return proxy
}
