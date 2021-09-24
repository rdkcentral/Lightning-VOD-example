import { Lightning, Colors, Utils } from "@lightningjs/sdk";

export class Key extends Lightning.Component{
    static _template() {
        return {
            Focus: {
                alpha: 0, mount: 0.5, x: w => w / 2, y: h => h /2, w: w => w + 10, h: h => h + 10, rect: true, colorBottom: Colors('focus2').get(), colorTop: Colors('focus').get(), shader: {type: Lightning.shaders.RoundedRectangle, stroke: 7, strokeColor: 0xffffffff, fillColor: 0x00ffffff, radius: 22, blend: 1}
            },
            Label: {mountX: 0.5, x: w => w / 2, color: Colors('white').get(), mountY: 0.42, y: h => h / 2, text: {fontFace: 'Regular', fontSize: 44}}
        }
    }

    set label(str) {
        this._label = str;
        if(this.active) {
            this.tag('Label').text.text = str.toUpperCase();
        }
    }

    get label() {
        return this._label;
    }

    _init() {
        this._focusAnimation = this.tag('Focus').animation({duration: 0.2, actions: [
            {p: 'alpha', v: {0: 0, 1: 1}},
            {p: 'h', v: {0: this.h, 1: this.h + 10}},
            {p: 'w', v: {0: this.w, 1: this.w + 10}},
        ]});
    }

    _update() {
        if(!this.active) {
            return;
        }
        this.patch({
            Label: {text: this._label}
        });
    }

    _firstActive() {
        this._update();
    }

    _focus() {
        this._focusAnimation.start();
    }

    _unfocus() {
        this._focusAnimation.stop();
    }

    static get width() {
        return 80;
    }

    static get height() {
        return 80;
    }
}

export class IconKey extends Key {
    static _template() {
        return {
            Focus: {
                alpha: 0, mount: 0.5, x: w => w / 2, y: h => h /2, w: w => w + 10, h: h => h + 10, rect: true, colorBottom: Colors('focus2').get(), colorTop: Colors('focus').get(), shader: {type: Lightning.shaders.RoundedRectangle, stroke: 7, strokeColor: 0xffffffff, fillColor: 0x00ffffff, radius: 22, blend: 1}
            },
            Icon: {mount: 0.5, x: w => w / 2, y: h => h /2}
        }
    }

    _update() {
        if(!this.active) {
            return;
        }
        this.patch({
            Icon: {src: Utils.asset(this._icon)}
        });
    }

    set icon(src) {
        this._icon = src;
    }

    get icon() {
        return this._icon;
    }
}