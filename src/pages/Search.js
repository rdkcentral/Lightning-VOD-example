import { Router } from "@lightningjs/sdk";
import keyboardConfig from "../lib/keyboardConfig.js";
import { Page } from "../components";
import { Grid, Keyboard } from "@lightningjs/ui";
import { transition } from "../lib/helpers.js";

export default class Search extends Page {
    static _template () {
        return {
            Keyboard: {mountX: 0.5, y: 330, x: 960, w: 935, type: Keyboard, currentLayout: 'ABC', config: keyboardConfig, signals: {onInputChanged: true}},
            Content: {alpha: 0.001, y: 90, mountX: 0.5, x: 960, type: SearchGrid, w: 1535, h: 1080, columns: 7, scroll: 640, scrollTransition: {duration: 0.4}}
        }
    }

    pageTransition(pageIn, pageOut) {
        pageOut.setSmooth('alpha', 0, {delay: 0.0, duration: 0.2});
        pageIn.widgets.menu.setSmooth('alpha', 0, {delay: 0.0, duration: 0.2});
        const inputfield = pageIn.widgets.inputfield;
        if(inputfield.alpha !== 1) {
            inputfield.visible = true;
            inputfield.alpha = 0.001;
            inputfield.setSmooth('alpha', 1, {delay: 0.2, duration: 0.2});
        }
        return this._pageTransition(pageIn, pageOut);
    }

    onInputChanged({input}) {
        const grid = this.tag('Content');
        grid.setSmooth('alpha', 0.001);
        if(input.length === 0) {
            this._clearSearchTimeout();
        }
        else {
            this._startSearchTimeout();
        }
        this._input = input;
    }

    _setup() {
        this.tag('Keyboard').inputField(this.widgets.inputfield.input);
    }

    _firstActive() {
        this._setState('Keyboard')
        this.tag('Keyboard').focus('onSpace');
    }

    _startSearchTimeout() {
        this._clearSearchTimeout();
        this._searchTimeout = setTimeout(() => {
            this._doSearch();
        }, 600);
    }

    _clearSearchTimeout() {
        if(this._searchTimeout) {
            clearTimeout(this._searchTimeout);
        }
    }

    _doSearch() {
        if(this.onSearch && this.onSearch.apply && this.onSearch.call) {
            this.onSearch(this._input)
                .then((response) => {
                    const grid = this.tag('Content');
                    grid.clear();
                    if(response.length > 0) {
                        grid.add(response);
                        grid.setSmooth('alpha', 1, {delay: 0.2});
                    }
                });
        }
    }

    _init() {
        const grid = this.tag('Content');
        this._focusTransitionY = grid.transition('y');
        grid.transition('alpha').on('finish', () => {
            if(grid.alpha === 0.001 && this._input.length === 0) {
                grid.clear();
            }
        })
        this._hideKeyboard = this.tag('Keyboard').animation({duration: 0.4, actions: [
            {p: 'x', v: {0: 960, 0.5: 1000}},
            {p: 'alpha', v: {0: 1, 0.5: 0}},
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
                    this.widgets.detail.setSmooth('alpha', 0.001, {duration: 0.2, delay: 0});
                }

                $exit() {
                    this._hideKeyboard.start();
                    this.widgets.inputfield.minimize();
                    this.widgets.detail.setSmooth('alpha', 1, {duration: 0.2, delay: 0.2});
                }

                _getFocused() {
                    return this.tag('Keyboard');
                }

                _handleUp() {
                    Router.focusWidget('InputField');
                }

                _handleDown() {
                    if(this.tag('Content').hasItems) {
                        this._setState('Grid');
                    }
                }
            },
            class Grid extends this {
                $enter() {
                    transition(this._focusTransitionY, 0);
                }

                $exit() {
                    transition(this._focusTransitionY, 90);
                }

                _getFocused() {
                    return this.tag('Content');
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