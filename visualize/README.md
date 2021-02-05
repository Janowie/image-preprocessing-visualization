# Filter visualization
link: https://janowie.github.io/image-preprocessing-visualization/

For the final visualization project, a filter visualization tool has been created. Its main goal is to show the
process of applying given filter on an image. Users can easily change the kernel matrix and explore how
minor changes influence the outcome.
Its functionality currently includes:
- Setting the kernel (automatically initialized with a Gaussian blur)
- Setting background color – to show how the padding added changes the color of the “first”
pixels of the image
- Setting pixel size – although using different images is not supported in the current version, user
can specify fictional pixel size demonstrated by the gray grid.
- Speed of the animation

### Technology
This project was developed in React and the filtering part is done using the HTML5 Canvas elements.
### Pixel size
If we were to use “normal” images, the pixels are so small (on all todays monitors) that one could barely
see the kernel moving over the pixels and the whole animation would be too slow. Since our main goal
was to show the movement and convolution of the kernel, we have decided to use an image composed
of “large pixels” and draw a grid over it to represent them. The grid size, and therefore the pixel size, can
be specified by users if they wish to change the granularity of the effect of the filter applied.
### Future work
In the future, if this tool were to be used in the real world, one could implement the option of changing
the image or changing the kernel size. We decided not to implement these features for now, even tough
everything is ready for such update.
### Final remarks
A surprising number of hours was spent developing this fairly simple tool. Anyone using it can still
experience few bugs. (The best way to get rid of them is to refresh the website.)