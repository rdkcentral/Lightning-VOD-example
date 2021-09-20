import { Lightning } from '@lightningjs/sdk';
import { List } from '@lightningjs/ui';
import { transition } from '../lib/helpers';

export default class Strip extends Lightning.Component {
    static _template() {
        return {
            alpha: 0.001, transitions: {alpha: {duration: 0.25}},
            Label: {x: 90, y: 0, pivotX: 0, pivotY: 1, scale: 0.8, text: {fontFace: 'Medium', fontSize: 48}},
            List: {
                y: 80, x: 90, type: List, w: 1600, spacing: 40
            }
        }
    }

    _init()  {
        this._transitionAlpha = this.transition('alpha');
        this._transitionLabel = this.tag('Label').transition('y');

        this._labelAnimation = this.tag('Label').animation({duration: 0.2, actions: [
            {p: 'y', v: {0: 0, 1: -30}},
            {p: 'scale', v: {0: 0.8, 1: 1}},
        ]})
    }

    _firstActive() {
        const parentIndex = this.collectionWrapper.index;
        const index = this.cparent.componentIndex;
        this.patch({
            alpha: index >= parentIndex,
            Label: {text: {text: this.title}},
            List: {
                itemType: this.itemType, items: this.items
            }
        });
        this._refocus();
    }

    _unfocus() {
        if(!this.cparent) {
            return;
        }

        const parentIndex = this.collectionWrapper.index;
        const index = this.cparent.componentIndex;

        if(index !== parentIndex) {
            this.tag('List').setIndex(0);
        }
        if(index < parentIndex) {
            transition(this._transitionAlpha, 0.001);
        }
        this._labelAnimation.stop();
    }

    _focus() {
        transition(this._transitionAlpha, 1);
        this._labelAnimation.start();
    }

    _getFocused() {
        return this.tag('List');
    }

    static get marginBottom () {
        return 30;
    }
}