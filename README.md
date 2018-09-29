# Finesse

Scrape the most recent clothing sale items at affordable prices, comment and write notes on the best products, and store them within your collection!

Finesse is a Full-Stack Application! 

* Powered by node.js, Express.js, MongoDB, mongoose.js *Object-relational Mapping (ORM)*, Axios, Cheerio, and Handlebars.js. Utilizes MVC and RESTful architecture.

*Further design development underway. The user will be able to save multiple items from different websites in their own collection.*
#

## Getting Started and Prerequisites

Check out the deployed site here: 
[**Finesse**](https://finessed.herokuapp.com/)!

This is a full-stack application, so no need to download anything!

### Preview 
<!-- take a picture of the image and add it into the readme  -->

#### Demo

![Finesse](./public/assets/images/preview.gif  "Finesse")
*An example of the interface in action*


# Technology Used

* **HTML5, CSS3** 
* **Javascript** - the primary scripting logic powering the application
* **jQuery** - the robust DOM-oriented scripting library for Javascript
* [**node.js**](https://nodejs.org/en/) - a versatile Javascript runtime environment that processes user inputs in terminal
* [**MongoDB**](https://www.mongodb.com/) - an open-source, cross-platform document-oriented database program
* [**UIKit**](https://getuikit.com/docs/) - a secondary web design framework utilized for animations


## Node Packages Employed

1. Express - unopinionated web framework for Node.js that constructs server logic and powers the API
``` require("express"); ```
2. Mongoose - a comprehensive object-relational mapper for MongoDB
``` require("mongoose"); ```
3. Handlebars - provides the power to build semantic templates effectively through Express
``` require("express-handlebars"); ```
4. Axios - promise based HTTP client for the browser and node.js. A more robust option than the *request* npm package
```require("axios");```
5. Cheerio - web scraping module    
```require("cheerio");```
6. Body Parser - middleware technology for JSON formatting
``` require("body-parser"); ```
7. Path - simplifies directories and filepaths through Node
``` require("path"); ```
8. Morgan - logging middleware for node.js HTTP apps
``` require("morgan"); ```

# Code Snippets
<!-- put snippets of code inside ``` ``` so it will look like code -->
<!-- if you want to put blockquotes use a > -->

Axios and Cheerio are extremely powerful npm packages that allowed for HTTP requests that serve up raw site data in a parsed, highly accessible format. The cheerio methods greatly expedited the scraping process to smoothly provide the exact information that I needed from the site. Here, an axios request is sent and the response is interpreted by cheerio through the various subsequent methods, such as `find()` and `children()`.
```Javascript
axios.get("https://www2.hm.com/en_us/sale/men/view-all.html").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        const home = "https://www2.hm.com/";

        var saleItems = [];
        // Iterate through each class of "product item" on the page to scrape the specific sales
        $("li.product-item").each(function (i, element) {
            // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this).find("h3.item-heading").children("a").text();
                result.link = home + $(this).find("div.image-container").children("a").attr("href"); 
                result.price = $(this).find("strong.item-price").children("span.sale").text();
                if($(this).find(".item-image").attr("src")){
                   result.image = $(this).find(".item-image").attr("src"); 
                }
                else{
                    result.image = $(this).find(".item-image").attr("data-src"); 
                }
               
                // Create a new Sale using the `result` object built from scraping
                db.Sale.create(result)
                    .then(function (dbSale) {
                        // Push the added result to our array to develop our JSON
                        // console.log(dbSale);
                        saleItems.push(dbSale);
                    })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        return res.json(err);
                    });
        });
```
Handlebars.js provides the unique utility of allowing "blocks" for elements that will be recurrently rendered on the page. Since each scraped sale item needed to be rendered with a consistent format, I was able to construct an *item-block* similar to a React component. Handlebars' native `{{#each}}` iterator power the generation of the items; that way, I would not need to use jQuery and Javascript iteration to dynamically append these elements.
```HTML
<!-- In index.handlebars -->

 <div style="display:flex">
    <div class="sale-items" uk-scrollspy="target: > div; cls:uk-animation-fade; delay: 100">
      {{#each item}}
      {{> item/item-block}}
      {{/each}}
    </div>

<!-- In item-block.handlebars -->
<div class="product">
	<a href={{link}} target="_blank">
		<h3 class="item-link">{{title}}</h3>
	</a>

	<h5>Sale Price: <span>{{price}}</span></h5>

	<a href={{link}} target="_blank"><img src={{image}} class="item-image"></a>
	<br><br>
	<button class="uk-button uk-button-text add-note" data-id="{{_id}}">Add Note</button>

</div>
```

# Learning Points

* While utilizing **handlebars.js**, I uncovered that *main.handlebars* has very explicit syntax requirements. I attempted to properly link the CSS and JS files based on their exact routes, but handlebars required me to list them starting with /assets, even though assets was an internal directory in a separate folder. 

* Since some of the images on H&M's website were dynamically generated, I had to more deeply scrape through the site to obtain all the necessary information. While some of the images were not directly rendered on the page, their parent `divs` were, acting as placeholders for further dynamically rendered content. Inside the parent `divs`, unrealized `img` tags were housed, each of which contained a data-attribute called `data-src` from which the image would obtain its "true" source upon page scroll. As such, I was able to scrape these attributes and generate the images on my page.

* Utilizing mLab MongoDB service for Heroku deployment

## Developers

* **Sajeel Malik** - *Initial work* - [GitHub](https://github.com/sajeelmalik)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
