function processManifest() {
    var params = parseParameters(window.location.hash.substr(1));
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://cdn-ca.signal.org/stickers/" + params['pack_id'] + "/manifest.proto", true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (oEvent) {
        if (this.status == 200) {
            decryptManifest(params['pack_key'], new Uint8Array(xhr.response)).then(manifest => {

                parseManifest(manifest).then(data => {
                });
            }).catch(error => {
                console.log(error.stack);
                alert("Error: " + error);
            });
        }
    };
    xhr.send();
}

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
                alert("Error: " + error);
            });
        }
    };
    xhr.send();

}

function parseManifest(manifest) {
    return protobuf.load("Stickers.proto").then(function (root) {
        var manifestData = new Uint8Array(manifest, 0, manifest.byteLength);
        var PackMessage = root.lookupType("Pack");
        var pack = PackMessage.decode(manifestData);
        return pack;
    });
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
                parseManifest(manifest).then(pack => {
                    pack_title = document.createTextNode(pack.title);
                    pack_author = document.createTextNode(pack.author);
                    document.getElementById("pack_title").appendChild(pack_title);
                    document.getElementById("pack_author").appendChild(pack_author);
                    
                    for (var i = 0; i < pack.stickers.length; i++) {
                        getSticker(i, pack.stickers[i].emoji, params['pack_id'], params['pack_key'])
                    }
                });
            }).catch(error => {
                console.log(error.stack);
                alert("Error: " + error);
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
            createThumbnail(pack_id, val.key, val.nsfw==true)
        })
    });


}

function createThumbnail(pack_id, pack_key, nsfw) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://cdn-ca.signal.org/stickers/" + pack_id + "/manifest.proto", true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (oEvent) {
        if (this.status == 200) {
            decryptManifest(pack_key, new Uint8Array(xhr.response)).then(manifest => {
                parseManifest(manifest).then(pack => {
                    cover_id = pack.cover.id
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', "https://cdn-ca.signal.org/stickers/" + pack_id + "/full/" + cover_id, true);
                    xhr.responseType = 'arraybuffer';
                    xhr.onload = function (oEvent) {
                        if (this.status == 200) {
                            decryptManifest(pack_key, new Uint8Array(xhr.response)).then(manifest => {

                                var arrayBufferView = new Uint8Array(manifest, 0, manifest.byteLength);
                                const STRING_CHAR = arrayBufferView.reduce((data, byte)=> {return data + String.fromCharCode(byte);}, '');
                                var base64Data = btoa(STRING_CHAR);

                                var img = new Image;
                                img.src = "data:image/webp;base64," + base64Data;
                                img.crossOrigin = 'Anonymous';
                                img.className = "card-img-top";

                                var card = document.createElement("a");
                                card.href= "/pack.html#pack_id=" + pack_id + "&pack_key=" + pack_key
                                card.className = "card text-center sticker-pack-link" + (nsfw ? " nsfw":"");
                                card.setAttribute("data-pack-id", pack_id);
                                card.setAttribute("data-pack-key", pack_key);

                                var image = document.createElement("img");
                                image.className = "card-img-top";
                                

                                var card_body = document.createElement("div");
                                card_body.className = "card-body";
                                var label = document.createTextNode("" + pack.title);
                                card.appendChild(img);
                                card_body.appendChild(label);
                                card.appendChild(card_body);


                                document.getElementById("stickers_list").appendChild(card);

                            }).catch(error => {
                                console.log(error.stack);
                                alert("Error: " + error);
                            });
                        }
                    };
                    xhr.send();
                });
            }).catch(error => {
                console.log(error.stack);
                alert("Error: " + error);
            });
        }
    };
    xhr.send();
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