import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export function reactive(raw: any) {
  return createReactiveObj(raw, mutableHandlers)
}

export function readonly(raw: any) {
  return createReactiveObj(raw, readonlyHandlers)
}

function createReactiveObj(raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}
