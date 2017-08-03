# RecoGaugeLibrary

[![npm version](https://badge.fury.io/js/)](https://www.npmjs.com/package/)

**A library for creating nice and flexible gauge charts.**

For Angular version of the library, please visit [this repository]().

You can [catch us on twitter](https://twitter.com/recogizer): [@recogizer](https://twitter.com/recogizer) or head over to [our company's website](http://www.recogizer.com/).

## [Demo]() | [Documentation]()

## Installation

Install via npm:

```
npm install 
```

Or add manually a link to the library into your html file:

```html
<script src=""></script>
```

## Usage

Create an element for positioning gauge in your html file:

```html
<div id="gaugeArea"></div>
```

Now you're ready to draw your first gauge.

Just copy this code into the .js / .ts file or into `<script></script>` tag in HTML file:

```javascript
// Element inside which you want to see the chart.
let element = document.querySelector('#gaugeArea')

// Properties of the gauge.
let options = {
  hasNeedle: true,
  arcColors: ['rgb(44, 151, 222)', 'lightgray'],
  arcDelimiters: [30],
  rangeLabel: ['0', '100'],
}

// Drawing and updating the chart.
GaugeChart
  .gaugeChart(element, 300, options)
  .updateNeedle(50)
```

#### Result:

![Gauge Example](/examples/img/gauge1.png "Gauge Example")

## Settings

### .gaugeChart( ... )

All variables below are mandatory. Chart height is unchangeable and always holds `0.5 * chartWidth`.

| Name | Values Ranges | Description |
| ---- | ------------- | ----------- |
| element | HTML element | specifies an element which contains a chart |
| chartWidth | number larger than 0 | gives a width to the gauge (px) |
| options | object | provides gauge properties (can be empty) |

### .updateNeedle( ... )

Dynamically changes needle value.

| Name | Values Ranges | Description |
| ---- | ------------- | ----------- |
| needleValue | number from 0 to 100 | specifies needle value on the gauge |

### options: { ... }

None of the options listed below are mandatory. You can experiment with combining any of them in any order within permitted value ranges.

##### Needle options
| Name | Values Ranges | Description | Default |
| ---- | ------------- | ----------- | ------- |
| hasNeedle | true / false | show / hide needle | false |
| outerNeedle | true / false | outer / inner needle | false |
| needleColor | [value supported by CSS](https://www.w3schools.com/colors/default.asp) | needle color | 'gray' |
| needleStartValue | number from 0 to 100 | needle start value | 0 |
| needleUpdateSpeed | number larger than 0 | needle update animation speed (ms) | 1000 |

##### Arc options
| Name | Values Ranges | Description | Default |
| ---- | ------------- | ----------- | ------- |
| arcColors | [array of values supported by CSS](https://www.w3schools.com/colors/default.asp) | arc colors | [ ] |
| arcDelimiters | array of numbers from 0 to 100 | arc delimiters (in asc. order) | [ ] |

##### Label options
| Name | Values Ranges | Description | Default |
| ---- | ------------- | ----------- | ------- |
| rangeLabel | array of two strings | range labels | [ ] |
| centralLabel | string | inner label | ' ' |
| rangeLabelFontSize | number larger than 0 | particular font size for range labels (px) | undefined |

## Examples

Some examples of what you can get out of the library using different properties:

![Gauge Examples](/examples/img/gauge2.png "Gauge Examples")

Like it? Give us a star :)

## Contributing
Build the library with `npm run build`. For a production version with console warnings, execute `npm run build:prod_warn`. This will fetch all dependencies and then compile `dist` files. To see the examples locally you can start a web server with `npm start dev` and go to `localhost:8080` (`8081` if `8080` is busy).

## License
MIT License. Copyright (c) 2017 RECOGIZER GROUP GmbH.