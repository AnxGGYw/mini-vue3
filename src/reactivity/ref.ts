import { hasChanged, isObject } from '../shared'
import { ReactiveEffect, trackEffect, triggerEffect, isTracking } from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _value: any
  dep: Set<ReactiveEffect> = new Set<ReactiveEffect>()
  constructor(value: any) {
    // object -> reactive
    this._value = convert(value)
  }
  get value() {
    trackRefValue(this)
    return this._value
  }
  set value(newVal) {
    if (hasChanged(this._value, newVal)) {
      this._value = convert(newVal)
      triggerEffect(this.dep)
    }
  }
}
// object -> reactive
function convert(val) {
  return isObject(val) ? reactive(val) : val
}

function trackRefValue(ref: RefImpl) {
  if (isTracking()) {
    trackEffect(ref.dep)
  }
}

export function ref(raw: any) {
  return new RefImpl(raw)
}
