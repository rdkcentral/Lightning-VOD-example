import { Lightning, Colors } from "@lightningjs/sdk";

export default class Button extends Lightning.Component {
    static _template() {
        return {
            Background: {
                w: w => w, h: h => h, rect: true, color: Colors('white').alpha(0.5).get(), shader: {type: Lightning.shaders.RoundedRectangle, stroke: 7, strokeColor: 0xffffffff, fillColor: 0x00ffffff, radius: 22, blend: 1}
            },
            Label: {mountX: 0.5, x: w => w / 2, color: Colors('white').get(), mountY: 0.42, y: h => h / 2, text: {text: this.bindProp('label'), fontFace: 'Regular', fontSize: 44}}
        }
    }

    _init() {
        const whiteAlpha = Colors('white').alpha(0.5).get();
        this._focusAnimation = this.animation({duration: 0.2, actions: [
            {t: 'Background', p: 'shader.fillColor', v: {0: 0x00ffffff, 1: 0xffffffff}},
            {t: 'Background', p: 'colorTop', v: {0: whiteAlpha, 1: Colors('focus').get()}},
            {t: 'Background', p: 'colorBottom', v: {0: whiteAlpha, 1: Colors('focus2').get()}},
        ]})
    }

    _focus() {
        this._focusAnimation.start();
    }

    _unfocus() {
        this._focusAnimation.stop();
    }
}