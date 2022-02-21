import EventBus from "./event-bus"

export default function createStore<T, Y>(reducer: Function, initialState: Y) {
  let state: Y = initialState
  return {
    dispatch: (action: { [key: string]: T }): void => {
      state = reducer(state, action)
      EventBus.publish(action.type, state)
    },
    getState: (): Y => state,
    subscribe: (channelName: string, listener: Function): void => {
      EventBus.subscribe(channelName, listener)
    }
  }
}