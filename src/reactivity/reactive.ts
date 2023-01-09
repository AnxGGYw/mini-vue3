import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_READONLY = '__v__isReadonly',
  IS_REACTIVE = '__v__isReactive'
}

export function reactive(raw: any) {
  return createReactiveObj(raw, mutableHandlers)
}

export function readonly(raw: any) {
  return createReactiveObj(raw, readonlyHandlers)
}

export function shallowReadonly(raw: any) {
  return createReactiveObj(raw, shallowReadonlyHandlers)
}

export function isReadonly(target: any) {
  // 触发baseHandlers getter即可
  return !!target[ReactiveFlags.IS_READONLY]
}

export function isReactive(target: any) {
  // 触发baseHandlers getter即可
  return !!target[ReactiveFlags.IS_REACTIVE]
}

export function isProxy(target: any) {
  return isReactive(target) || isReadonly(target)
}

function createReactiveObj(raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}
