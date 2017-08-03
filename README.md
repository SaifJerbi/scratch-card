# \<scratch-card\>

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/SaifJerbi/scratch-card)

Scratch card  is based on HTML5, it generates canvas on the fly and is optimized for all modern browsers and has touch support for mobile devices. You can use it to make scratch cards, coupons, promotionnal game and even advertisement.

## Demo

Please visit the [demo](https://saifjerbi.github.io/scratch-card) and enjoy the scratch card

## Installation

To install the scratch-card 

```bash
bower install SaifJerbi/scratch-card
```

## Usage

You can use it to make scratch cards, coupons, promotionnal game and even advertisement.

Once you have installed the scratch-card element, you can import it in your project using HTML import :

```html
  <link rel="import" href="bower_components/scratch-card.html">
```
Once the element is imported , it's very easy to use :

```html

<scratch-card 
            background="images/background01.png" 
            foreground="images/foreground01.png"
            percent=80
            thickness=15
            load>
</scratch-card>

```

| Properties        | value          | Usage |
| -------------     |:-------------: | :-----|
| background        | String         | The path of the background images |
| foreground        | String         | The path of the foreground images to be scratched |
| percent           | Integer        | The scratch area size in percent to fully scratch the card |
| thikness          | Integer        | The area scratched when touching the screen, it's in Pixel |
| load              | Boolean        | Tell the component that is ready to create scratch component. It must be set to true when you want load the scratch card|

## Contributing

Fork it!
Create your feature branch: git checkout -b my-new-feature
Commit your changes: git commit -am 'Add some feature'
Push to the branch: git push origin my-new-feature
Submit a pull request :D

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

## History

The first stable release v1.0.0
