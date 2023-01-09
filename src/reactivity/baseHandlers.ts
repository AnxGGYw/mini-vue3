import { extend, isObject } from '../shared'
import { track, trigger } from './effect'
import { reactive, ReactiveFlags, readonly } from './reactive'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

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

const createShallowReadonlyHandlers = () => {
  return extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
  })
}

export const mutableHandlers = createMutableHandlers()

export const readonlyHandlers = createReadonlyHandlers()

export const shallowReadonlyHandlers = createShallowReadonlyHandlers()

function createGetter(isReadonly = false, shallow = false) {
  return (target: any, key: string | symbol) => {
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }

    const res = Reflect.get(target, key)

    if (shallow) {
      return res
    }

    // nested object 嵌套对象 排除 function
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    // 收集依赖 ( 收集ReactiveEffect实例 )
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return (target: any, key: string | symbol, value: any) => {
    const res = Reflect.set(target, key, value)
    // 派发更新，触发依赖
    trigger(target, key)
    return res
  }
}
