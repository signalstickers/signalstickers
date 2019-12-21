# Signal stickers galery

## About

This site is served on [www.signalstickers.com](https://www.signalstickers.com), directly from this Github repository.

## Adding a sticker pack to the site

Open a merge request to add a sticker pack to `stickers.json`!

### Format

```json
"[PACK ID]": {
    "key": "[PACK KEY]",
    "source": "[Where you get the sticker pack]",
    "tags": "keyword1, keyword2"
}
```

You can get from a URL sticker link:
```
https://signal.art/addstickers/#pack_id=[PACK ID]&pack_key=[PACK KEY]
```

`tags` and `source` are not currently implemented, but if you remember where you got the sticker pack, and want to add keywords, feel free!

> Note: if your sticker pack is NSFW, add the key:value `"nsfw": true` to your JSON PR.

## Q&A

### How can I crate a sticker pack?

+ Follow the tutorial on the [Signal support site](https://support.signal.org/hc/en-us/articles/360031836512-Stickers#h_c2a0a45b-862f-4d12-9ab1-d9a6844062ca)
+ OR [use this Gist](https://gist.github.com/ondondil/4b8564b404696b3255253b467b413de9) to convert Telegram stickers to Signal
+ OR use Gimp and your talent!

### Have I to add my sticker pack to this site to share it with my friends?

**No**. You can just share your sticker pack using the `signal.art` link that you get when you create your Sticker pack.

### Can you create a sticker pack for me?

This is not the goal of this projet :-)

### Where can I found more stickers?

Head to the [Signal forum](https://community.signalusers.org/t/sticker-pack-collection-thread-makeprivacystick/10650).

### Is this a commercial projet ?

**No**. This project is open-source, and is served directly from Github with Github pages.


## Dev stuff

This is a quick-and-dirty, let-the-client-do-the-job application. All the stickers are loaded by the client, without pagination, to make it easier to develop and maintain: to add stickers, just edit the `stickers.json` pack.

If you have JS skills and want to improve my (bad but working) code, feel free to make a pull request!

## License

See [LICENSE.md](LICENSE.md), and do what the f*** you want.
