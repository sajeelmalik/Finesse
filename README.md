# Finesse


handlebars main.handlebars has very explicit syntax requirements. I attempted to properly link the CSS and JS files based on their exact routes, but handlebars required me to list them starting with /assets, even though assets was an internal directory in a separate folder.

Since some of the images on HM's website were dynamically generated, I had to more deeply scrape through the site to obtain all the necessary information. While some of the images were not rendered on the page, their parent *divs* were. Inside the parent *divs*, placeholder *img* tags were housed and contained a data-attribute called *data-src* from which the image would obtain its "true" source upon page scroll. As such, I was able to scrape these attributes and generate the images on my page.