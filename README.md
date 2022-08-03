# Gauge Chart

**A library for creating nice and flexible gauge charts.**

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

You can [catch us on twitter](https://twitter.com/recogizer): [@recogizer](https://twitter.com/recogizer) or head over to [our company's website](http://www.recogizer.com/).

## [Demo](https://recogizer.github.io/gauge-chart/examples/samples/) | [Documentation](https://recogizer.github.io/gauge-chart/docs/)

## Installation

The easiest way to get started is to install it via npm:

```
  npm install gauge-chart
```

**beware that we moved from `@recogizer/gauge-chart` to `gauge-chart`**

Or to add manually a link to the library into your html file:

```html
  <script src="https://unpkg.com/gauge-chart@latest/dist/bundle.js"></script>
```

## Usage

Create an element for positioning gauge in your html file:

```html
  <div id="gaugeArea"></div>
```

Now you're ready to draw your own gauge.

Just copy this code into your js / ts file or into `<script> </script>` tags in html file:

```javascript
// Element inside which you want to see the chart
let element = document.querySelector('#gaugeArea')

// Properties of the gauge
let gaugeOptions = {
  hasNeedle: true,
  needleColor: 'gray',
  needleUpdateSpeed: 1000,
  arcColors: ['rgb(44, 151, 222)', 'lightgray'],
  arcDelimiters: [30],
  rangeLabel: ['0', '100'],
  centralLabel: '50',
}

// Drawing and updating the chart
GaugeChart.gaugeChart(element, 300, gaugeOptions).updateNeedle(50)
```

#### Result:

![Gauge Example](/examples/img/gauge1.png 'Gauge Example')

By default, the needle is pointing to 0, thus in order to move it you have to use `.updateNeedle(val)`, where `val` denotes the value on the chart.

Feel free to change or delete any of the gaugeOptions properties as long as their values are in permitted ranges.

## Options

#### gaugeOptions: { ... }

| Name              | Values Ranges                                                                    | Description                                          |
| ----------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------- |
| hasNeedle         | true / false                                                                     | determines whether to show the needle or not         |
| needleColor       | [value supported by CSS](https://www.w3schools.com/colors/default.asp)           | colorizes needle with specified colors               |
| needleUpdateSpeed | number ⩾ 0                                                                       | determines the speed of needle update animation      |
| arcColors         | [array of values supported by CSS](https://www.w3schools.com/colors/default.asp) | colorizes gauge with specified color                 |
| arcDelimiters     | array of numbers from 0 to 100                                                   | specifies delimiters of the gauge in ascending order |
| arcOverEffect     | true / false                                                                     | determines if over effect on ars is enabled or not   |
| arcLabels         | array of strings                                                                 | specifies labels to be placed at delimiters ends     |
| arcPadding        | number                                                                           | specifies padding between arcs (in pixels)           |
| arcPaddingColor   | [value supported by CSS](https://www.w3schools.com/colors/default.asp)           | color of the padding between delimeters              |
| rangeLabel        | array of two strings                                                             | depicts gauge ranges on both sides of the chart      |
| centralLabel      | string                                                                           | depicts gauge inner label                            |
| labelsFont        | string                                                                           | specifies font-family to be used for labels          |
| labelsColor       | string                                                                           | specifies font color to be used for labels          |

#### .gaugeChart( ... )

| Name         | Values Ranges        | Description                                                     |
| ------------ | -------------------- | --------------------------------------------------------------- |
| element      | html element         | specifies an element which contains a chart                     |
| chartWidth   | number larger than 0 | gives a width to the gauge (height is always 0.5 \* chartWidth) |
| gaugeOptions | object               | provides gauge properties (can be empty)                        |

#### .updateNeedle( ... )

| Name        | Values Ranges        | Description                         |
| ----------- | -------------------- | ----------------------------------- |
| needleValue | number from 0 to 100 | specifies needle value on the gauge |

## Examples

Some examples of what you can get out of the library using different properties:

![Gauge Examples](/examples/img/gauges.png 'Gauge Examples')

## Contributing

Build the library with `npm run build`. For a production version with console warnings, execute `npm run build:prod_warn`. This will fetch all dependencies and then compile the `dist` files. To see the examples locally you can start a web server with `npm run dev` and go to `localhost:8080` (`localhost:8081` if port `8080` is busy).

## License

MIT License. Copyright (c) 2017-2019 RECOGIZER GROUP GmbH.

## Authors

[Alexey Karpov](https://github.com/cherurg), [Maxim Maltsev](https://github.com/mmaltsev).
