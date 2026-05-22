import Embed from './embed'
import { API } from './types'

const { version } = require('../package.json')

class WidgetBot {
  public version = version
  public embeds = [] as API[]

  constructor() {
    this.register()

    document.addEventListener('DOMContentLoaded', this.register.bind(this))
  }

  public register() {
    this.registerTag('widgetbot', 'discord')
    this.registerTag('telegram-widget', 'telegram')
  }

  private registerTag(tagName: string, platform: 'discord' | 'telegram') {
    const elements = document.getElementsByTagName(tagName) as any
    for (const element of elements) {
      const { root } = new Embed(element, platform)
      this.embeds.push(root)
    }
  }
}

export default WidgetBot
