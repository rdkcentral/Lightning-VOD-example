import { Lightning } from "@lightningjs/sdk";
import keyboardConfig from "../lib/keyboardConfig.js";
import { ItemDescription } from "../components";
import Keyboard from "../keyboard/Keyboard.js";
import { Grid } from "@lightningjs/ui";
import { transition } from "../lib/helpers.js";

export default class Search extends Lightning.Component {
    static _template () {
        return {
            ItemDescription: { x: 230, y: 90, type: ItemDescription },
            Keyboard: {mountX: 0.5, y: 330, x: 960, w: 935, type: Keyboard, currentLayout: 'ABC', config: keyboardConfig, signals: {onInputChanged: true}},
            Grid: {y: 90, mountX: 0.5, x: 960, type: SearchGrid, w: 1535, h: 1080, columns: 7, scroll: 640, scrollTransition: {duration: 0.4}}
        }
    }

    onInputChanged({input}) {
        if(this.onSearch && this.onSearch.apply && this.onSearch.call) {
            this.onSearch(input)
                .then((response) => {
                    const grid = this.tag('Grid');
                    grid.clear();
                    if(response.length > 0) {
                        grid.add(response);
                    }
                });
        }
    }

    $updateItemTitle(e) {
        this.tag('ItemDescription').item = e;
    }

    _setup() {
        this.tag('Keyboard').inputField(this.widgets.inputfield)
    }

    _firstActive() {
        this._setState('Keyboard')
    }

    _init() {
        this._focusTransitionY = this.tag('Grid').transition('y');
        this._hideKeyboard = this.tag('Keyboard').animation({duration: 0.2, actions: [
            {p: 'x', v: {0: 960, 1: 1960}},
            {p: 'alpha', v: {0: 1, 1: 0}},
        ]});
    }

    static _states() {
        return [
            class Keyboard extends this {
                $enter() {
                    this.fireAncestors('$updateBackdrop', {src: null});
                    this.fireAncestors('$updateAmbientBackground', {color: 0xff9300e0});
                    this._hideKeyboard.stop();
                    this.widgets.inputfield.maximize();
                }

                $exit() {
                    this._hideKeyboard.start();
                    this.widgets.inputfield.minimize();
                }

                _getFocused() {
                    return this.tag('Keyboard');
                }

                _handleDown() {
                    if(this.tag('Grid').hasItems) {
                        this._setState('Grid');
                    }
                }
            },
            class Grid extends this {
                $enter() {
                    transition(this._focusTransitionY, 0);
                }

                $exit() {
                    this.tag('ItemDescription').hide();
                    transition(this._focusTransitionY, 90);
                }

                _getFocused() {
                    return this.tag('Grid');
                }

                _handleUp() {
                    this._setState('Keyboard');
                }
            }
        ]
    }
}

class SearchGrid extends Grid {
    _indexChanged(event) {
        super._indexChanged(event);
        this._lines.forEach((line, lineIndex) => {
            line.forEach((wrapper) => {
                this.itemWrappers[wrapper].setSmooth('alpha', lineIndex < event.mainIndex ? 0.001 : 1);
            });
        });
    }
}