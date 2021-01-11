const Image = require("@11ty/eleventy-img");
const path = require("path");
const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");

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

  eleventyConfig.addNunjucksAsyncShortcode("picture", pictureShortcode);
  eleventyConfig.addLiquidShortcode("picture", pictureShortcode);
  eleventyConfig.addJavaScriptFunction("picture", pictureShortcode);

  /* Markdown Plugins */
  // Disable whitespace-as-code-indicator, which breaks a lot of markup
  const configuredMdLibrary = markdownIt({
    html: true,
  }).disable("code");

  eleventyConfig.setLibrary("md", configuredMdLibrary);

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    pathPrefix: "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,

    dir: {
      // Place sources under 'src'; keeps things cleaner
      input: "src",
      // The defaults for Eleventy
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
