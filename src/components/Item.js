import { Colors, Img, Lightning } from '@lightningjs/sdk';

export default class Item extends Lightning.Component {
    static _template() {
        return {
            Focus: {
                alpha: 0, y: -36, x: -20, w: w => w + 40, h: h => h + 40, rect: true, colorBottom: Colors('focus2').get(), colorTop: Colors('focus').get(), shader: {type: Lightning.shaders.RoundedRectangle, stroke: 7, strokeColor: 0xffffffff, fillColor: 0x00ffffff, radius: 22, blend: 1}
            },
            Poster: {w: w => w, h: h => h, shader: {type: Lightning.shaders.RoundedRectangle, radius: 12}}
        }
    }

    _firstActive() {
        this.patch({
            Poster: {texture: Img(this.item.poster).original()}
        });
    }

    _focus() {
        const {backdrop, title, description} = this.item;
        this.fireAncestors('$updateBackdrop', {src: backdrop});
        this.fireAncestors('$updateItemTitle', {title, description});
        this.patch({
            Focus: {smooth: {alpha: 1}},
            Poster: {smooth: {y: -15}}
        });
    }

    _unfocus() {
        this.patch({
            Focus: {smooth: {alpha: 0}},
            Poster: {smooth: {y: 0}}
        });
    }

    static get width() {
        return 185
    }

    static get height() {
        return 278
    }
}