import { Lightning, Img, Colors, Utils } from '@lightningjs/sdk';
import { transition, animation, extractCommonColor } from '../lib/helpers';
import Swirl from '../shaders/Swirl.js';

export default class Backdrop extends Lightning.Component {
    static _template() {
        return {
            w: 1920,
            h: 1080,
            rect: true,
            color: Colors('background').get(),
            ImgSource: {
                x: -299.5, w: 300, h: 168
            },
            Swirl: {
                rect: true, w: 1920, h: 1080,
                src: Utils.asset('images/swirlBackground.jpg'),
                shader: {type: Swirl, blur: 0.005, pull: 14}
            },
            Backdrop: {
                alpha: 1, w: w => w, color: 0xff000000, h: 740, shader: {type: Lightning.shaders.FadeOut, fade: [0, 700, 900, 0]}, transitions: {alpha: {duration: 1}},
            },
        }
    }

    _init() {
        const backdrop = this.tag('Backdrop');
        this._transitionAlpha = backdrop.transition('color');
        this.tag('Backdrop').on('txLoaded', (texture) => {
            if(this._backdrop.src === texture.src) {
                this._backdropLoaded = true;
                this._animateBackdrop();
            }
        });
        this.tag('ImgSource').on('txLoaded', (texture) => {
            if(this._imgSource.src === texture.src) {
                this._imgSrcLoaded = texture.source.nativeTexture;
                this._animateBackdrop();
            }
        });
        this._transitionAlpha.on('finish', () => {
            if(backdrop.color === 0xff000000) {
                this._loadSrc();
            }
        });
        this._baseColor = Colors('background').get();
    }

    _animateBackdrop() {
        if(!this._backdropLoaded || !this._imgSrcLoaded) {
            return;
        }
        
        if(this.stage.gl) {
            const color = extractCommonColor(this._imgSrcLoaded, this.stage.gl);
            const prevColor = this._baseColor;
            this._baseColor = color;

            this._colorAnim = animation(this._colorAnim, 'Swirl', this, {
                duration: 1, actions: [
                    {p: 'colorTop', v: {0: Colors(prevColor).darker(0.2), 1: Colors(color).darker(0.2)}},
                    {p: 'colorBottom', v: {0: prevColor, 1: color}}
                ]
            })
        }
        this._backdropLoaded = false;
        this._imgSrcLoaded = false;
        transition(this._transitionAlpha, 0xffffffff);
    }

    _loadSrc() {
        if(this._debounce) {
            clearTimeout(this._debounce);
        }
        this._debounce = setTimeout(() => {
            this._loadTextures(this._targetSrc);
        }, 50);
    }

    _loadTextures(src) {
        this._imgSource = Img(src).contain(300, 168);
        this._backdrop = Img(src).cover(1920, 740);

        this.tag('ImgSource').texture = this._imgSource;
        this.tag('Backdrop').texture = this._backdrop;
    }
    
    update(src) {
        if(src === this._targetSrc) {
            return;
        }
        if(this.tag('Backdrop').color === 0xff000000) {
            this._loadTextures(src);
        }
        else {
            transition(this._transitionAlpha, 0xff000000);
        }
        this._targetSrc = src;
    }
}