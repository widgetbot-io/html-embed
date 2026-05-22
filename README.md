# html-embed

[CodeSandbox](https://codesandbox.io/s/y32o59nn0v)

```html
<html>

<body>
  <button id="hello-world">Send "Hello world"</button>
  <widgetbot
    server="299881420891881473"
    channel="355719584830980096"
    id="embed"
    height="300"
    width="500"
  >
  </widgetbot>
  <script src="https://unpkg.com/@widgetbot/html-embed"></script>

  <script>
    const embed = document.getElementById('embed')

    document.getElementById('hello-world').addEventListener('click', () => {
      embed.emit(
        'sendMessage',
        `Hello world! from \`@widgetbot/html-embed!\`\n` +
          `<https://codesandbox.io/s/y32o59nn0v>`
      )
    })

    embed.on('signIn', data => {
      console.log(`You've signed in as ${data.name}`)
    })
  </script>
</body>

</html>
```

## Telegram

Use the `<telegram-widget>` tag for Telegram chats. `shard` is **required** —
point it at your deployed Telegram widget host:

```html
<telegram-widget
  chat="-1003784217881"
  shard="https://your-telegram-widget.example.com"
  id="tg-embed"
  height="600"
  width="400"
></telegram-widget>
<script src="https://unpkg.com/@widgetbot/html-embed"></script>

<script>
  const embed = document.getElementById('tg-embed')
  embed.on('ready', () => console.log('Telegram widget ready'))
  embed.on('signIn', (user) => console.log('Signed in as', user))
</script>
```

Attributes:

- `shard` (required) — URL of the deployed Telegram widget host
- `chat` (required) — Telegram chat ID (e.g. `-1003784217881`)
- `topic` (optional) — Topic ID for supergroup forums
- `token` (optional) — Platform auth token
- `width`, `height` — Pixel dimensions (or any CSS length)

