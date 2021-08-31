const path = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //añadimos nuestro plugin a nuestro documento
const CopyPlugin = require('copy-webpack-plugin'); 
// const CssMinimizerPlugin = require('mini-css-extract-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = { //configuraciones
    entry: "./src/index.js", // entry => nos permite decir cual es el punto inicial de nuestra apicacion
    output: { // autput => hacia donde vamos a enivar lo que retorna webpack 
        //elementos internos
        path: path.resolve(__dirname, "dist"),  // resolve => no va a permiter saber donde se encuentra nuestro proyecto
        filename: "[name].[contenthash].js", // nombre del reusltante
        assetModuleFilename: 'assets/images/[hash][ext][query]', // indicamos donde se guardara despues de ejecutar webpack, usara un has una extencion y un query
    }, // extensiones que vamos a trbajar en el proyecto
    mode: 'development', // de esta forma "activamos" que este documento solomante tiene la configuracion para el modo desarrollo
    watch: true, // activamos el modo watch
    resolve: {
        extensions: ['.js'], // normalmente es .js pero si trabajamos con React, svelte debemos especificar
        alias:{ //
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/')
        }
    },
    module: { 
        rules:[ // reglas que vamos a establecer cuando vamos a trabajar con diferentes elementos y tipos de archivos
            { // con este objeto podemos trabajar con babel loder y poder concetar nuestro webpack con babel
            test: /\.m?js$/, // usamos expresiones redulares, aqui dice: utiliza cualquier archivo que empiese con m o js
            exclude: /node_modules/, // excluimos node_modules, y no utilise nada de node_modules
            use:{
                loader: 'babel-loader' // utilisamos babel en nuestro loader
            }
           },
           { //creamos la configuracion para el loader
            test: /\.css|.scss$/i,
            use: [MiniCssExtractPlugin.loader, 
                'css-loader',
                'sass-loader'
            ],
           },
           {
               test: /\.png/,
               type: 'asset/resource'
           },
           {
               test: /\.(woff|woff2)$/,
               use: {
                   loader: 'url-loader',
                   options: {
                       // Habilita o deshabilita la transformación de archivos en base64.
                       limit: 10000, // O LE PASAMOS UN BOOLEANOS TRUE O FALSE                       
                       // Los MIME Types (Multipurpose Internet Mail Extensions)
                       mimetype: 'application/font-woff',  // son la manera standard de mandar contenido a través de la red.
                       // EL NOMBRE INICIAL DEL ARCHIVO + SU EXTENSIÓN
                       name: "[name].[contenthash].[ext]", // PUEDES AGREGARLE [name]hola.[ext] y el output del archivo seria // ubuntu-regularhola.woff                        
                       outputPath: './assets/fonts/', // EL DIRECTORIO DE SALIDA (SIN COMPLICACIONES)
                       publicPath: '../assets/fonts/',  // EL DIRECTORIO PUBLICO (SIN COMPLICACIONES)
                       esModule: false, // AVISAR EXPLICITAMENTE SI ES UN MODULO
                   },
               }
           }
        ]
    },
    plugins: [ // aqui añadiremos nuestros plugins
        new HtmlWebpackPlugin({ //configuracion del plugin, donde le pasaremos un objeto
            inject: true, // inyecta el bundle al template HTML
            template: './public/index.html', // la ruta del template
            filename: 'index.html'  // nombre final del archivo
        }),
        new MiniCssExtractPlugin({ // utilisamos el CSS
            filename: 'assets/[name].[contenthash].css'
        }), 
        new CopyPlugin({
            patterns:[{
                from: path.resolve(__dirname, "src", "assets/images"), /*  
                From ⇒ que recurso (archivo o directorio) deseamos copiar al directorio final
                */
                to: "assets/images" /* To ⇒ en que ruta dentro de la carpeta final terminara los recursos */                
            }]
        }),
        new Dotenv(),
    ],

    /* La optimizacion no es necesaria en esta fase de webpak que es la de desarrollo */
//     optimization:{
//         minimize: true,
//         minimizer: [
//             new CssMinimizerPlugin(),
//             new TerserPlugin(),
//         ]
//     }

}