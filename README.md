# Signal stickers gallery

## About

This site is served on [signalstickers.com](https://signalstickers.com), directly from this Github repository.

## Adding a sticker pack to this site

Open a pull request to add a sticker pack to [`stickers.json`](https://github.com/romainricard/signalstickers/blob/master/stickers.json)!

### Format

Use [this page](https://signalstickers.com/convert.html) to convert your `signal.art` URL to the following format: 

```json
"[PACK ID]": {
    "key": "[PACK KEY]",
    "source": "[Where you got the sticker pack]",
    "tags": "keyword1, keyword2"
}
```

You can also get `[PACK ID]` and `[PACK KEY]` directly from a sticker pack URL.

> **Note:** if your sticker pack is NSFW, add the key:value `"nsfw": true` to your JSON object.

> **Note:** `tags` and `source` are not currently implemented, but if you remember where you got the sticker pack, and want to add keywords, feel free!


## Q&A

### How can I create a sticker pack?

+ [Use this Gist](https://gist.github.com/ondondil/4b8564b404696b3255253b467b413de9) to convert Telegram stickers to Signal
+ **OR** use Gimp and your talent!

And then follow the tutorial on the [Signal support site](https://support.signal.org/hc/en-us/articles/360031836512-Stickers#h_c2a0a45b-862f-4d12-9ab1-d9a6844062ca) to upload your stickers.

### Do I have to add my sticker pack to this site to share it with my friends?

**No**. You can just share your sticker pack using the `signal.art` link that you got when you created your sticker pack.

### Can you create a sticker pack for me?

This is not the goal of this project :-)

### Where can I find more stickers?

- Head to the [Sticker pack collection thread](https://community.signalusers.org/t/sticker-pack-collection-thread-makeprivacystick/10650) on the [Signal Community forum](https://community.signalusers.org).
- Search Twitter for the [`#makeprivacystick`](https://twitter.com/hashtag/makeprivacystick) hashtag.

### Is this a commercial project?

**No**. This project is open-source, and is served directly from Github via [Github Pages](https://pages.github.com/).


## Dev stuff

This is a quick-and-dirty, let-the-client-do-the-job application. All the stickers are loaded by the client, without pagination, to make it easier to develop and maintain: to add stickers, just edit the `stickers.json` pack.

If you have JS skills and want to improve my (bad but working) code, feel free to make a pull request!

## License

See [LICENSE.md](LICENSE.md), and do what the f*** you want.
