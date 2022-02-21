interface IEventBus {
  channels: { [key: string]: Function[] },
  subscribe: Function,
  publish: Function
}


const EventBus: IEventBus = {

  channels: {},

  subscribe(channelName: string, listener: Function) {
    if (!this.channels[channelName]) {
      this.channels[channelName] = []
    }
    this.channels[channelName].push(listener)
  },

  publish(channelName: string, data: any) {
    const channel = this.channels[channelName]
    if (!channel || !channel.length) {
      return
    }
    channel.forEach((listener: Function) => listener(data))
  }
}

export default EventBus