import { Lightning, Colors, Img } from "@lightningjs/sdk";
import { extractCommonColor } from "../lib/helpers.js";
export default class Ambient extends Lightning.Component {
    static _template() {
        return {
            // w: 1920,
            // h: 1080,
            // rect: true,
            // color: Colors('background').get(),
            // Radial: {
            //     w: w => w,
            //     h: h => h,
            //     rect: true,
            //     color: 0x00ffffff,
            //     shader: {
            //         type: Lightning.shaders.RadialGradient, innerColor: Colors('background').darker(0.15).get(), outerColor:  Colors('white').alpha(0).get(), pivot: [0.15, 0.5]
            //     }
            // },
            ImageSource: {
                x: -299.5, w: 300, h: 168
            }
        }
    }

    _init() {
        const imageSource = this.tag('ImageSource');
        imageSource.on('txLoaded', () => {
            if(this.stage.gl) {
                const texture = imageSource.texture.source.nativeTexture;
                const color = extractCommonColor(texture, this.stage.gl);
                this.patch({
                    smooth: {color: [color, {duration: 0.4}]}
                });
            }
        });
    }

    _changeColor(src) {
        if(this._debounce) {
            clearTimeout(this._debounce);
        }
        this._debounce = setTimeout(() => {
            this.tag('ImageSource').texture = Img(src).contain(300, 168);
        }, 400);
    }

    update(src) {
        this._changeColor(src);
    }
}