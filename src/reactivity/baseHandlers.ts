import { track, trigger } from './effect'
import { ReactiveFlags } from './reactive'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

const createMutableHandlers = () => {
  return {
    get,
    set
  }
}

const createReadonlyHandlers = () => {
  return {
    get: readonlyGet,
    set(target, key, value) {
      console.warn(`key: '${key}' set '${value}' 失败，因为 target 设置了readonly`, target)
      return true
    }
  }
}

export const mutableHandlers = createMutableHandlers()

export const readonlyHandlers = createReadonlyHandlers()

function createGetter(isReadonly = false) {
  return (target, key) => {
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }

    const res = Reflect.get(target, key)
    // 收集依赖 ( 收集ReactiveEffect实例 )
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return (target, key, value) => {
    const res = Reflect.set(target, key, value)
    // 派发更新，触发依赖
    trigger(target, key)
    return res
  }
}
