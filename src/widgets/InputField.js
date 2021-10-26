import { Lightning, Colors, Utils } from "@lightningjs/sdk";
import { transition } from "../lib/helpers";
import { InputField as Input } from "@lightningjs/ui";

export default class InputField extends Lightning.Component {
    static _template () {
        return {
            x: 330, y: 140, zIndex: 9,
            onPositionChanged: this.bindProp('positionX', (comp) => {
                if(comp.active) {
                    comp.mirroredContent.x = 330 - comp.positionX;
                    comp.x = comp.positionX;
                }
                return comp.positionX;
            }),
            positionX: 330,
            Background: {
                w: 1260, h: 140, rtt: true, shader: {type: Lightning.shaders.RoundedRectangle, radius: 22},
                FastBlur: {
                    w: 1260, h: 140, zIndex: 9, type: Lightning.components.FastBlurComponent, amount: 3, content: {
                        MirrorContent: {color: Colors('white').darker(0.4).get()}
                    }
                },
                Labels: {
                    Icon: {x: 70, y: 70, mount: 0.5, zIndex: 10, src: Utils.asset(`images/search.png`)},
                    Input: {
                        type: Input,
                        x: 140,
                        y: 70,
                        h: 54,
                        mountY: 0.43,
                        zIndex: 10,
                        description: 'Search...',
                        inputText: {
                            fontFace: 'Regular',
                            fontSize: 54
                        },
                        cursor: {
                            y: 3,
                            w: 7, 
                            h: 62,
                            shader: {
                                type: Lightning.shaders.RoundedRectangle,
                                radius: 3
                            }
                        }
                    }
                }
            }
        }
    }

    get mirroredContent () {
        return this.tag('FastBlur').content.tag('MirrorContent');
    }

    _setup() {
        this.mirroredContent.texture = this.fireAncestors('$getAppContentTexture');
        this.mirroredContent.texture.enableClipping(330, 140, 1590, 140);
    }

    _init() {
        this._transitionPosition = this.transition('positionX');
        this._transitionPosition.settings.duration = 0.2;

        this._minimize = this.animation({duration: 0.4, actions: [
            {p: 'x', v: {0: 330, 0.5: 1330}},
        ]});
    }

    get input() {
        return this.tag('Input');
    }

    maximize() {
        if(!this._minized) {
            return;
        }
        this._minized = false;
        this._minimize.stop();
    }

    minimize() {
        if(this._minized) {
            return;
        }
        this._minized = true;
        this._minimize.start();
    }

    _focus() {
        this.tag('Input').cursor.setSmooth('color', Colors('focus').get())
    }

    _getFocused() {
        return this.tag('Input');
    }
}