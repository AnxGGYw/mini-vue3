import { mutableHandlers, readonlyHandlers } from './baseHandlers'

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

export function isReadonly(target: any) {
  // 触发baseHandlers getter即可
  return !!target[ReactiveFlags.IS_READONLY]
}

export function isReactive(target: any) {
  // 触发baseHandlers getter即可
  return !!target[ReactiveFlags.IS_REACTIVE]
}

function createReactiveObj(raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}
