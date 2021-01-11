# 11ty-img-example

An example of using [Eleventy's eleventy-img plugin](https://www.11ty.dev/docs/plugins/image/).

## Pre-requisites

You will need [Node](https://nodejs.org/en/download/) and npm installed. npm typically comes installed with node. I recommend [using a version manager, such as nvm, to manage your node installation](https://github.com/nvm-sh/nvm)

## How to build

In a terminal, such as iTerm on MacOS, gnome terminal on Linux, or Windows Subsystem for Linux (WSL) on Windows, type:

If you have nvm installed, make sure the node versions match up

```shell
nvm use
```

```shell
# Install dependencies
npm ci
```

If the above command fails, try

```shell
npm install
```

Once the command completes, you are ready to build or develop!

To develop:

```shell
npm run dev
```

This will start a server at http://localhost:8080.

To build:

```shell
npm run build
```

This will build and output the final site under the `_site` directory. You can inspect the contents from there!

## Where is eleventy-img used?

The eleventy-img package is used in `.eleventy.js`. It is used to create a shortcode called "picture", which is then used inside posts or templates.

The picture shortcode is [based on the eleventy-img example](https://www.11ty.dev/docs/plugins/image/#use-this-in-your-templates).

This is what the full shortcode looks like:

```js
/* Fetch and transform an image to a `picture` with multiple sources */
async function pictureShortcode(
src,
alt,
sizes = "",
loading = "eager",
decoding = "auto"
) {
let metadata = await Image(src, {
    // Set these however you like (the more widths, the more time to build, so not always a good idea to have a ton)
    widths: [600, 1200, 1920],
    // What formats to include. Avif and Webp are small, jpeg is supported more broadly. The browser will pick the right one
    formats: ["avif", "webp", "jpeg"],
    // Output images under _site/img/opt. This can help caching
    outputDir: "_site/img/opt/",
    // Inform the base path for URLs, e.g. in <source> and <img> elements
    urlPath: "/img/opt/",
    // Rename 'box-on-table' to 'box-on-table-hashHere123-1200w.jpg' etc.
    filenameFormat: function (id, src, width, format, options) {
    const extension = path.extname(src);
    const name = path.basename(src, extension);

    return `${name}-${id}-${width}w.${format}`;
    },
});

let imageAttributes = {
    alt,
    sizes,
    loading,
    decoding,
};

return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline",
});
}
```

And this is what usage (with Nunjucks templating) looks like:

```njk
# This is an example page

{# Insert a picture element with different sources #}

{% picture "https://upload.wikimedia.org/wikipedia/commons/3/3b/Good_Morning_From_the_International_Space_Station.jpg", "The Earth at night, seen from the international space station. Cities and towns are lit up as bright spots.", "48rem"  %}
```
