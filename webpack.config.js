const path = require('path');
const fs = require('fs-extra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const buildDir = path.resolve(__dirname, 'build');
const publicDir = path.resolve(__dirname, 'public');
const popupHtml = path.resolve(__dirname, 'public/extensionpopup.html');

fs.emptyDirSync(buildDir);
fs.copySync(publicDir, buildDir, {
    dereference: true,
    filter: file => file !== popupHtml
});

const lint = {
    test: /\.(js|jsx)$/,
    enforce: 'pre',
    loader: 'eslint-loader'
}

const static = {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: 'url-loader',
    options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
    },
}

const js = {
    test: /\.(js|jsx)$/,
    loader: 'babel-loader',
    options: {
        presets: ['env', 'flow', 'react'],
        cacheDirectory: true,
    }
}

const css = {
    test: /\.css$/,
    use: [
        'style-loader',
        { loader: 'css-loader', options: { importLoaders: 1 } }
    ]
}

const file = {
    exclude: [/\.js$/, /\.html$/, /\.json$/],
    loader: 'file-loader',
    options: {
        name: 'static/media/[name].[hash:8].[ext]',
    }
}

module.exports = [{
    entry: './src/background/extensionbackground.js',
    output: {
        filename: 'extensionbackground.js',
        path: buildDir
    },
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: [lint, js]
    }
}, {
    entry: './src/contentscript/extensioncontentscript.js',
    output: {
        filename: 'extensioncontentscript.js',
        path: buildDir
    },
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: [lint, js]
    }
}, {
    entry: './src/extensionpopup.js',
    output: {
        filename: 'extensionpopup.js',
        path: buildDir
    },
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: [lint, {
            oneOf: [static, js, css, file]
        }]
    },
    plugins: [new HtmlWebpackPlugin({
        inject: true,
        template: popupHtml,
        filename: "extensionpopup.html"
    }), new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    })]
}];