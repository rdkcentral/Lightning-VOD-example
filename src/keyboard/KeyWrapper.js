import { Lightning } from "@lightningjs/sdk";
export default class KeyWrapper extends Lightning.Component {
    static _template() {
        return {
            clipbox: true
        }
    }

    _update() {
        let currentKey = this.children && this.children[0];
        if(currentKey && currentKey.action === this._key.action) {
            currentKey.patch({
                ...this._key
            });
        }
        else {
            this.children = [{type: this._key.keyType, ...this._key}];
        }
        if(this.hasFocus()) {
            this._refocus();
        }
    }

    set key(obj) {
        this._key = obj;
        if(this.active) {
            this._update();
        }
    }

    get key() {
        return this._key;
    }

    _active() {
        this._update();
    }

    _inactive() {
        this.childList.clear();
    }

    _getFocused() {
        return this.children && this.children[0] || this;
    }
}