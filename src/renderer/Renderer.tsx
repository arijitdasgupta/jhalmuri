import {mainReducer} from '../reducers/mainReducer';
import {Provider, connect} from 'react-redux';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import * as React from 'react';

declare let escape;

export class Renderer {
    constructor(private baseUrl) {}

    public render = (state, component):string => {
        let store = createStore(mainReducer, state);
        let App = connect((state) => {
            return {
                mode: state.mode,
                pageData: state.pageData
            };
        }, () => { // No actions on the server
            return {};
        })(component);
        let renderedDom = renderToString(
            <Provider store={store}>
                <App />
            </Provider>
        );
        let renderedHtml = this.renderFullHtml(state, renderedDom);
        return renderedHtml;
    };

    private renderFullHtml = (appState, renderedMarkup) => {
        const appStateString = escape(JSON.stringify(appState));

        return `<!doctype html>
        <html>
            <head>
                <title>Something</title>
                <script>
                    window.__APP__STATE__STRING__ = '${appStateString}';
                </script>
                <script src="${this.baseUrl}/assets/bundle.js"></script>
            </head>
            <body>
                <div id="application">
                    ${renderedMarkup}
                </div>
            </body>
        </html>`;
    };
}
