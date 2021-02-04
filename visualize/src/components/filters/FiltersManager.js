import filterSettings from './filters.json';

class FiltersMixin {

  constructor() {
    // "Hidden" canvas used for calculation purposes
    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "none";
  }

  setCanvasDimensions = function (dimensions) {
    this.canvas.width = dimensions.width;
    this.canvas.height = dimensions.height;
  }

  getPixels = function (image) {
    if (this.canvas.width && this.canvas.height) {
      let ctx = this.canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      return ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  runFilter = function (image, filter, args) {
    // Run filter by given filter name
    if (this[filter]) {
      return this[filter](this.getPixels(image), args);
    }
    return null;
  }

  getSettings = function (filter) {
    if (this.settings[filter]) {
      return this.settings[filter];
    }
    return null;
  }
}


export class FiltersManager extends FiltersMixin {

  constructor() {
    super();
    this.settings = filterSettings;
  }

  // Filter functions
  filter_gray_scale = function(pixels, args) {
    let d = pixels.data;
    for (let i=0; i<d.length; i+=4) {
      let r = d[i];
      let g = d[i+1];
      let b = d[i+2];
      // CIE luminance for the RGB
      // The human eye is bad at seeing red and blue, so we de-emphasize them.
      let v = 0.2126*r + 0.7152*g + 0.0722*b;
      d[i] = d[i+1] = d[i+2] = v
    }
    return pixels;
  }

  filter_threshold = function(pixels, args) {
    let threshold = args["threshold"];
    var d = pixels.data;
    for (var i=0; i<d.length; i+=4) {
      var r = d[i];
      var g = d[i+1];
      var b = d[i+2];
      var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
      d[i] = d[i+1] = d[i+2] = v
    }
    return pixels;
  };

  filter_threshold_ticked = function(pixels, tick, args) {
    let threshold = args["threshold"];
    var d = pixels;

    var r = d[tick];
    var g = d[tick+1];
    var b = d[tick+2];
    var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
    d[tick] = d[tick+1] = d[tick+2] = v

    return d;
  };

  filter_custom_convolution = function (pixels, args) {

  };

}
