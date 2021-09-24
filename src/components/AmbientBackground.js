import { Lightning, Colors, Utils } from "@lightningjs/sdk";
import { animation } from "../lib/helpers.js";
import Swirl from '../shaders/Swirl.js';

export default class AmbientBackground extends Lightning.Component {
    static _template() {
        return {
            w: 1920,
            h: 1080,
            rect: true,
            color: Colors('background').get(),
            Swirl: {
                w: 1920, h: 1080,
                src: Utils.asset('images/swirlBackground.jpg'),
                shader: {type: Swirl, blur: 0.008, pull: 8}
            }
        }
    }

    _changeColor(argb) {
        const prevColor = this._targetColor || Colors('background').get();
        const color = this._targetColor = argb || Colors('background').get();

        this._colorAnimation = animation(this._colorAnimation, 'Swirl', this, {
            duration: 1, actions: [
                {p: 'colorTop', v: {0: Colors(prevColor).darker(0.2), 1: Colors(color).darker(0.2)}},
                {p: 'colorBottom', v: {0: prevColor, 1: color}}
            ]
        });
    }

    update(argb) {
        this._changeColor(argb);
    }
}