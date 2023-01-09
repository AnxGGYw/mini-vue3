import { computed } from '../computed'
import { reactive } from '../reactive'

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({
      age: 22
    })

    const age = computed(() => user.age)

    expect(age.value).toBe(22)
  })

  it('computed should lazy', () => {
    const user = reactive({
      age: 22
    })
    const getter = jest.fn(() => user.age)

    const age = computed(getter)
    expect(getter).toHaveBeenCalledTimes(0)

    age.value
    expect(getter).toHaveBeenCalledTimes(1)
  })

  it('computed should cache', () => {
    const user = reactive({
      age: 22
    })
    const getter = jest.fn(() => user.age)

    const age = computed(getter)

    expect(age.value).toBe(22)
    expect(getter).toHaveBeenCalledTimes(1)

    age.value
    expect(getter).toHaveBeenCalledTimes(1)
  })

  it('computed should be called when reactive object change', () => {
    const user = reactive({
      age: 22
    })
    const getter = jest.fn(() => user.age)

    const age = computed(getter)

    expect(age.value).toBe(22)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute again
    age.value
    expect(getter).toHaveBeenCalledTimes(1)

    // reactive object change
    user.age = 23
    // should compute when reactive object change
    expect(age.value).toBe(23)
    expect(getter).toHaveBeenCalledTimes(2)

    // should not compute again
    age.value
    expect(getter).toHaveBeenCalledTimes(2)

    user.age = 24

    expect(age.value).toBe(24)
    expect(getter).toHaveBeenCalledTimes(3)
  })
})
