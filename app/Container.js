import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'
import * as Components from './components';

const componentName = location.pathname.replace('/', '')
const Component = Components[componentName];
const props = require(`./components/${componentName}/${componentName}.json`);

const render = (Component, props) => {
    ReactDOM.render(
        <AppContainer>
            <Component {...props} />
        </AppContainer>,
        document.getElementById('root'),
    )
}

render(Component, props);

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./components', () => {
        const Components = require('./components');

        const componentName = location.pathname.replace('/', '')
        const props = require(`./components/${componentName}/${componentName}.json`);
        const Component = Components[componentName];

        render(Component, props);
    });
}
