# Gauge Library

[![npm version]()]()
[![Code Climate]()]()
[![Test Coverage]()]()

**A library for creating nice and flexible gauge charts.**

You can [catch us on twitter](https://twitter.com/recogizer): [@recogizer](https://twitter.com/recogizer) or head over to [our company's website](http://www.recogizer.com/).

## [Demo]() | [Documentation]()

## Creating your first gauge chart

The easiest way to get started is to install it via npm:

```
   npm install 
```

Or just manually add a link to the library into your html file:

```html
  <script src=""></script>
```

Then, create an element for positioning gauge:

```html
  <div id="gaugeArea"></div>
```

Now you're ready to draw your own gauge.
Just copy this code into your js / ts file or into *<script> </script>* tags in html file:

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

![Alt text](http://i64.tinypic.com/k363df.png "Optional Title")

By default, the needle is positioned to 0, thus in order to move it you have to use .updateNeedle(val), where val corresponds to the value on the chart.

Feel free to change or delete any of the gaugeOptions properties as long as there values are in permitted ranges.

| Name | Values Range | Description |
| ---- | ------------ | ----------- |
| hasNeedle | true / false | determines whether to show the needle or not |
| needleColor | [values supported by CSS](https://www.w3schools.com/colors/default.asp) | colorizes needle with specified colors |
| needleUpdateSpeed | number larger than 0 | determines the speed of needle update animation |
| arcColors | [values supported by CSS](https://www.w3schools.com/colors/default.asp) | colorizes gauge with specified color |
| arcDelimiters | array of values from 0 to 100 | specifies delimiters of the gauge in ascending order |
| rangeLabel | array of two strings | depicts gauge ranges on both sides of the chart |
| centralLabel | string | depicts gauge inner label |

Some examples of what you can get out of the library:


Like it? Give us a star :)

## Contributing
Build the library with `npm run build`. This will fetch all dependencies and then compile the `dist` files. To see the examples locally you can start a web server with `npm start dev` and go to `localhost:8081`.

## License (MIT)
Copyright (c) 2017 RECOGIZER GROUP GmbH.
