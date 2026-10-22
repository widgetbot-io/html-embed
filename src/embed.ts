import { Client } from '@widgetbot/embed-api'

import { API } from './types'
import { applyStyles, generateUUID, Shadow } from './util'

export type Platform = 'discord' | 'telegram'

const DISCORD_DEFAULTS = {
  shard: 'https://e.widgetbot.io',
  server: '299881420891881473',
  title: 'WidgetBot Discord chat embed',
  passthroughParams: ['username', 'avatar', 'token', 'notifications', 'notificationtimeout', 'thread', 'settings-group']
}

const TELEGRAM_DEFAULTS = {
  title: 'WidgetBot Telegram chat embed',
  passthroughParams: ['token', 'settings-group']
}

class Embed {
  id = generateUUID()
  iframe = document.createElement('iframe') as API

  constructor(readonly root: API, readonly platform: Platform = 'discord') {
    const { id, iframe } = this
    if (this.injected) return

    const defaults = platform === 'telegram' ? TELEGRAM_DEFAULTS : DISCORD_DEFAULTS
    iframe.setAttribute('title', defaults.title)

    const api = new Client({ id, iframe })

    const shadow = Shadow(root as any)
    shadow.appendChild(iframe)

    const { url, ...styles } = this.parseAttributes(root)
    iframe.setAttribute('allow', 'clipboard-write; fullscreen')
    iframe.setAttribute('src', url)

    this.setAPI(root, {
      on: (e, c) => api.on(e, c),
      emit: (e, d) => api.emit(e, d),
      contentWindow: iframe.contentWindow,
      contentDocument: iframe.contentDocument
    })

    applyStyles(root, {
      display: 'inline-block',
      overflow: 'hidden',
      backgroundColor: platform === 'telegram' ? '#17212B' : '#36393E',
      borderRadius: '7px',
      verticalAlign: 'top',
      ...styles
    })
    applyStyles(iframe, {
      border: 'none',
      width: '100%',
      height: '100%'
    })
  }

  get injected() {
    return 'emit' in this.root && 'on' in this.root
  }

  private parseAttributes(node: Element) {
    return this.platform === 'telegram'
      ? this.parseTelegramAttributes(node)
      : this.parseDiscordAttributes(node)
  }

  private parseDiscordAttributes(node: Element) {
    const server = node.getAttribute('server') || DISCORD_DEFAULTS.server
    const channel = node.getAttribute('channel')
    const shard = this.normalizeShard(node.getAttribute('shard') || DISCORD_DEFAULTS.shard)

    const params = new URLSearchParams({ api: this.id })
    for (const param of DISCORD_DEFAULTS.passthroughParams) {
      if (node.hasAttribute(param)) params.append(param, node.getAttribute(param))
    }

    const url = `${shard}/channels/${server}${channel ? `/${channel}` : ''}?${params}`

    return {
      ...this.parseSize(node),
      url
    }
  }

  private parseTelegramAttributes(node: Element) {
    const chat = node.getAttribute('chat')
    const topic = node.getAttribute('topic')
    const shardAttr = node.getAttribute('shard')
    if (!shardAttr) {
      throw new Error(
        '<telegram-widget> requires a `shard` attribute pointing at the widget host.'
      )
    }
    const shard = this.normalizeShard(shardAttr)

    const params = new URLSearchParams({ api: this.id })
    for (const param of TELEGRAM_DEFAULTS.passthroughParams) {
      if (node.hasAttribute(param)) params.append(param, node.getAttribute(param))
    }

    const path = chat
      ? `/channels/${chat}${topic ? `/${topic}` : ''}`
      : ''
    const url = `${shard}${path}?${params}`

    return {
      ...this.parseSize(node),
      url
    }
  }

  private parseSize(node: Element) {
    const width = node.getAttribute('width')
    const height = node.getAttribute('height')
    return {
      ...(width && { width: +width ? `${width}px` : width }),
      ...(height && { height: +height ? `${height}px` : height })
    }
  }

  private normalizeShard(shard: string) {
    if (!shard.startsWith('http')) shard = `https://${shard}`
    if (shard.endsWith('/')) shard = shard.substring(0, shard.length - 1)
    return shard
  }

  private setAPI(element: Element, api) {
    Object.keys(api).forEach(key => (element[key] = api[key]))
  }
}

export default Embed
