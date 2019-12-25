// Sticker packs list
let packs =[];

// The Pack proto for protobuf
var proto = {
    "nested": {
      "Pack": {
        "fields": {
          "title": {
            "type": "string",
            "id": 1
          },
          "author": {
            "type": "string",
            "id": 2
          },
          "cover": {
            "type": "Sticker",
            "id": 3
          },
          "stickers": {
            "rule": "repeated",
            "type": "Sticker",
            "id": 4,
            "options": {}
          }
        },
        "nested": {
          "Sticker": {
            "fields": {
              "id": {
                "type": "uint32",
                "id": 1
              },
              "emoji": {
                "type": "string",
                "id": 2
              }
            }
          }
        }
      }
    }
  }
var root = protobuf.Root.fromJSON(proto);
const PackMessage = root.lookupType("Pack");


function getSticker(sticker_id, emoji, pack_id, pack_key) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://cdn-ca.signal.org/stickers/" + pack_id + "/full/" + sticker_id, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (oEvent) {
        if (this.status == 200) {
            decryptManifest(pack_key, new Uint8Array(xhr.response)).then(manifest => {

                var arrayBufferView = new Uint8Array(manifest, 0, manifest.byteLength);
                const STRING_CHAR = arrayBufferView.reduce((data, byte)=> {return data + String.fromCharCode(byte);}, '');
                var base64Data = btoa(STRING_CHAR);

                var sticker = document.createElement("div")
                sticker.className = "sticker"
                sticker.setAttribute('data-packid', pack_id)
                sticker.setAttribute('data-stickerid', sticker_id)
                sticker.setAttribute('data-emoji', emoji)
                var image = document.createElement("img");
                var imageParent = document.getElementById("stickers_list");
                image.id = "id";
                image.className = "class";
                image.src = 'data:image/webp;base64,' + base64Data;;

                sticker.appendChild(image)
                imageParent.appendChild(sticker);


            }).catch(error => {
                console.log(error.stack);
                alert("getSticker: " + error);
            });
        }
    };
    xhr.send();

}

function parseManifest(manifest) {
    var manifestData = new Uint8Array(manifest, 0, manifest.byteLength);
    var pack = PackMessage.decode(manifestData);
    return pack;
}

async function decryptManifest(encodedKey, encryptedManifest) {
    var keys = await deriveKeys(encodedKey);
    var theirIv = encryptedManifest.slice(0, 16);
    var ciphertextBody = encryptedManifest.slice(16, encryptedManifest.byteLength - 32);
    var theirMac = encryptedManifest.slice(encryptedManifest.byteLength - 32, encryptedManifest.byteLength);
    var combinedCiphertext = encryptedManifest.slice(0, encryptedManifest.byteLength - 32);
    var macKey = await window.crypto.subtle.importKey("raw", keys[1], {
        name: "HMAC",
        hash: {
            name: "SHA-256"
        }
    }, false, ["verify", "sign"]);
    var ourMac = await window.crypto.subtle.sign({
        name: "HMAC"
    }, macKey, combinedCiphertext);
    var valid = await window.crypto.subtle.verify({
        name: "HMAC"
    }, macKey, theirMac, combinedCiphertext);
    if (valid) {
        var cipherKey = await window.crypto.subtle.importKey("raw", keys[0], {
            name: "AES-CBC"
        }, false, ["decrypt"]);
        var plaintext = await window.crypto.subtle.decrypt({
            name: "AES-CBC",
            iv: theirIv
        }, cipherKey, ciphertextBody);
        return plaintext;
    } else {
        throw new Error('MAC failed');
    }
}
async function deriveKeys(encodedKey) {
    var masterKey = await window.crypto.subtle.importKey("raw", hexToArrayBuffer(encodedKey), 'HKDF', false, ['deriveKey']);
    var derivedKeys = await window.crypto.subtle.deriveKey({
        name: "HKDF",
        hash: "SHA-256",
        salt: new ArrayBuffer(32),
        info: new TextEncoder().encode("Sticker Pack")
    }, masterKey, {
        name: "HMAC",
        hash: "SHA-256",
        length: 512
    }, true, ["verify"]);
    var derivedKeyBytes = await window.crypto.subtle.exportKey("raw", derivedKeys);
    return [derivedKeyBytes.slice(0, 32), derivedKeyBytes.slice(32, 64)];
}

function parseParameters(hash) {
    var params = {};
    hash.split("&").forEach(function (item) {
        var parts = item.split("=");
        if (parts.length == 2) {
            params[parts[0]] = parts[1];
        }
    });
    return params;
}

function hexToArrayBuffer(hexString) {
    var result = [];
    while (hexString.length >= 2) {
        result.push(parseInt(hexString.substring(0, 2), 16));
        hexString = hexString.substring(2, hexString.length);
    }
    return new Uint8Array(result);
}




/**
 * Called when arriving on the pack.html page
 */
function getStickerPack() {
    var params = parseParameters(window.location.hash.substr(1));
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://cdn-ca.signal.org/stickers/" + params["pack_id"] + "/manifest.proto", true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (oEvent) {
        if (this.status == 200) {
            decryptManifest(params["pack_key"], new Uint8Array(xhr.response)).then(manifest => {
                var pack = parseManifest(manifest)
                var pack_title = document.createTextNode(pack.title);
                var pack_author = document.createTextNode(pack.author);
                document.getElementById("pack_title").appendChild(pack_title);
                document.getElementById("pack_author").appendChild(pack_author);
                
                for (var i = 0; i < pack.stickers.length; i++) {
                    getSticker(i, pack.stickers[i].emoji, params['pack_id'], params['pack_key'])
                }
                
            }).catch(error => {
                console.log(error.stack);
                alert("getStickerPack: " + error);
            });
        }
    };
    xhr.send();

    document.getElementById("install_pack").onclick = function () {
        window.location.href = "sgnl://addstickers/?pack_id=" + params["pack_id"] + "&pack_key=" + params["pack_key"]
        return false;
    };
}
/**
 * Called when arriving on the / page
 */

function getStickerPackList() {
    $.getJSON("stickers.json", function (data) {
        $.each(data, function (pack_id, val) {
            getStickerPackDetails({
                id: pack_id,
                key: val.key,
                nsfw: val.nsfw,
                tags: val.tags
            });
        })
    });
}

function getStickerPackDetails(pack) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', "https://cdn-ca.signal.org/stickers/" + pack.id + "/manifest.proto", true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (oEvent) {
        if (this.status == 200) {
            decryptManifest(pack.key, new Uint8Array(xhr.response)).then(manifest => {
                var manifestData = parseManifest(manifest)
                var cover_id = manifestData.cover.id
                var xhr = new XMLHttpRequest();
                xhr.open('GET', "https://cdn-ca.signal.org/stickers/" + pack.id + "/full/" + cover_id, true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function (oEvent) {
                    if (this.status == 200) {
                        decryptManifest(pack.key, new Uint8Array(xhr.response)).then(manifest => {
                            new_pack =  {
                                id: pack.id,
                                key: pack.key,
                                title: manifestData.title,
                                nsfw: pack.nsfw || false,
                                author: manifestData.author,
                                stickers: manifestData.stickers,
                                tags: pack.tags.split(',').map(s => s.trim() && s.toLowerCase()).filter(a => a),
                                cover: manifestData.cover,
                                manifest: manifest,
                            }
                            // Add to global packs list
                            packs = [...packs, new_pack];
                            // Display pack
                            displayPackThumbnail(new_pack);
                        }).catch(error => {
                            console.error(error.stack);
                            alert("getStickerPackDetails: " + error);
                        });
                    }
                };
                xhr.send();
            }).catch(error => {
                console.error(error.stack);
                alert("getStickerPackDetails: " + error);
            });
        }
    };
    xhr.send();
}

function displayPackThumbnail(pack) {
    let img = new Image;
    img.src = "data:image/webp;base64," + btoa(new Uint8Array(pack.manifest, 0, pack.manifest.byteLength).reduce((data, byte)=> {return data + String.fromCharCode(byte);}, ''));
    img.crossOrigin = 'Anonymous';
    img.className = "card-img-top";

    let card = document.createElement("a");
    card.href= "/pack.html#pack_id=" + pack.id + "&pack_key=" + pack.key
    card.className = "card text-center sticker-pack-link" + (pack.nsfw ? " nsfw":"");
    card.setAttribute("data-pack-id", pack.id);
    card.setAttribute("data-pack-key", pack.key);

    let image = document.createElement("img");
    image.className = "card-img-top";


    let card_body = document.createElement("div");
    card_body.className = "card-body";
    const label = document.createTextNode("" + pack.title);
    card.appendChild(img);
    card_body.appendChild(label);
    card.appendChild(card_body);
    document.getElementById("stickers_list").appendChild(card);
}

function convert(){
    var signalart_valid_url = new RegExp('^https:\/\/signal\.art\/addstickers\/#pack_id=[a-f0-9]{32}&pack_key=[a-f0-9]{64}$');
    $('.signaart-form').on('input', function() {
        var input = $('#signalart-url').val();
        if (signalart_valid_url.test(input)) {
            var hash = input.substring(input.lastIndexOf("#") + 1);
            var params = parseParameters(hash);
            var json_obj = {"key":  params['pack_key'], "source": "", "tags": "", "nsfw": $('#nsfw').is(':checked')}
            var result = '"' +params['pack_id'] + '": ' + JSON.stringify(json_obj, null, 4);
            $('#json-result').text(result)
        }else{
            $('#json-result').text("Please enter a valid URL!");
        }
    });
}

/**
 * Called on search bar input change
 */
function search(e) {
    const searched = e.target.value.toLowerCase()
    const filtered_packs = packs.filter(
        p => p.title.toLowerCase().includes(searched) || // by title
        (p.tags.map(t => t.includes(searched)).includes(true)) // by tags
    )
    document.getElementById("stickers_list").innerHTML = "";
    filtered_packs.forEach(filetered_pack => displayPackThumbnail(filetered_pack))
}