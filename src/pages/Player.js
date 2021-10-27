import { Colors, Img, Lightning } from "@lightningjs/sdk";
import { List } from "@lightningjs/ui";
import { Page } from "../components";
import { IconKey } from "../components/Key";

export default class Player extends Page {
    static _template() {
        return {
            Placeholder: {w: 1920, h: 1080},
            Overlay: {
                Top: {rect: true, w: 1920, h: 540, colorBottom: Colors('black').alpha(0.3).get(), colorTop: Colors('black').alpha(0.85).get()},
                Bottom: {rect: true, w: 1920, h: 540, mountY: 1, y: 1080, colorTop: Colors('black').alpha(0.3).get(), colorBottom: Colors('black').alpha(0.85).get()}
            },
            Title: {x: 230, y: 90, w: 1060, text: {fontFace: 'Bold', wrap: true, fontSize: 74, lineHeight: 88}},
            PlayerButtons: {
                y: 890, x: 960, mountX: 0.5, type: List, autoResize: true, spacing: 50,
            },
            Progressbar: {y: 830, x: 960, w: 1620, h: 8, mountX: 0.5,
                Frame: {
                    w: w => w, h: h => h, rect: true, alpha: 0.7, shader: {type: Lightning.shaders.RoundedRectangle, radius: 2}
                },
                Troth: {
                    mountY: 0.5, y: 4, x: -10, w: 20, h: 20, rect: true, shader: {type: Lightning.shaders.RoundedRectangle, radius: 10}
                }
            }
        }
    }

    pageTransition(pageIn, pageOut) {
        const widgets = pageIn.widgets;
        for(let key in widgets) {
            widgets[key].setSmooth('alpha', 0, {delay: 0.0, duration: 0.2});
        }
        return super.pageTransition(pageIn, pageOut);
    }

    setData(data) {
        const {title, backdrop} = data;
        this.patch({
            Placeholder: {texture: Img(backdrop).contain(1920, 1080)},
            Title: {text: title}
        });
    }

    _setup() {
        const buttons = ['previous', 'play', 'next'].map((icon) => {
            return {type: IconKey, w: 110, h: 110, icon: `images/${icon}.png`}
        });
        this.tag('PlayerButtons').add(buttons);
        this.tag('PlayerButtons').index = 1;

        this._progressAnimation = this.animation({duration: 30, repeat: -1, actions: [
            {t: 'Troth', p: 'w', v: {0: 20, 1: 1640}}
        ]});        
    }

    _firstActive() {
        this._progressAnimation.start();
    }

    _getFocused() {
        return this.tag('PlayerButtons');
    }
    
    get hideBackground() {
        return true;
    }
}