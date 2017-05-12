# Gauge Library

[![npm version]()]()
[![Code Climate]()]()
[![Test Coverage]()]()

**A library for creating nice and flexible gauge charts.**

You can [catch us on twitter](https://twitter.com/recogizer): [@recogizer](https://twitter.com/recogizer) or head over to [our company's website](http://www.recogizer.com/).

## [Demo]() | [Documentation]()

## Installation

The easiest way to get started is to install it via npm:

```
   npm install 
```

Or to add manually a link to the library into your html file:

```html
  <script src=""></script>
```

## Creating your first gauge chart

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
GaugeChart
  .gaugeChart(element, 300, gaugeOptions)
  .updateNeedle(50)
```


#### Result:

![Gauge Example](/examples/img/gauge1.png "Gauge Example")

By default, the needle is positioned on 0, thus in order to move it you have to use `.updateNeedle(val)`, where `val` denotes the value on the chart.

Feel free to change or delete any of the gaugeOptions properties as long as there values are in permitted ranges.

## Properties Specification

#### gaugeOptions: { ... }

| Name | Values Ranges | Description |
| ---- | ------------- | ----------- |
| hasNeedle | true / false | determines whether to show the needle or not |
| needleColor | [value supported by CSS](https://www.w3schools.com/colors/default.asp) | colorizes needle with specified colors |
| needleUpdateSpeed | number larger than 0 | determines the speed of needle update animation |
| arcColors | [array of values supported by CSS](https://www.w3schools.com/colors/default.asp) | colorizes gauge with specified color |
| arcDelimiters | array of numbers from 0 to 100 | specifies delimiters of the gauge in ascending order |
| rangeLabel | array of two strings | depicts gauge ranges on both sides of the chart |
| centralLabel | string | depicts gauge inner label |


#### .gaugeChart( ... )

| Name | Values Ranges | Description |
| ---- | ------------- | ----------- |
| element | html element | specifies an element which contains a chart |
| chartWidth | number larger than 0 | gives a width to the gauge (height is always 0.5 * chartWidth) |
| gaugeOptions | object | provides gauge properties (can be empty) |

#### .updateNeedle( ... )

| Name | Values Ranges | Description |
| ---- | ------------- | ----------- |
| needleValue | number from 0 to 100 | specifies needle value on the gauge |

## Examples

Some examples of what you can get out of the library using different properties:

![Gauge Examples](/examples/img/gauge2.png "Gauge Examples")

Like it? Give us a star :)

## Contributing
Build the library with `npm run build`. This will fetch all dependencies and then compile the `dist` files. To see the examples locally you can start a web server with `npm start dev` and go to `localhost:8080` (`localhost:8081` if port `8080` is busy).

## License (MIT)
Copyright (c) 2017 RECOGIZER GROUP GmbH.

