import { Lightning, Colors, Utils } from "@lightningjs/sdk";
import { transition } from "../lib/helpers";
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
                    Input: {alpha: 0.8, x: 140, y: 70, mountY: 0.43, zIndex: 10, text: {text: 'Search...', fontFace: 'Regular', fontSize: 54}}
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
        this._transitionPosition.settings.duration = 0.4;
    }

    onInputChanged({input = ''}) {
        const hasInput = input.length > 0;
        this.tag('Input').patch({
            alpha: hasInput ? 1 : 0.8,
            text: {text: hasInput ? input : 'Search...'}
        });
    }

    maximize() {
        if(!this._minized) {
            return;
        }
        this._minized = false;
        this.tag('Input').patch({
            text: {
                wordWrapWidth: 1100,
                wrap: false,
                fontSize: 54
            }
        });
        transition(this._transitionPosition, 330);
    }

    minimize() {
        if(this._minized) {
            return;
        }
        this._minized = true;
        this.tag('Input').patch({
            text: {
                wordWrapWidth: 330,
                wrap: true,
                fontSize: 44,
            }
        });
        transition(this._transitionPosition, 1330);
    }
}