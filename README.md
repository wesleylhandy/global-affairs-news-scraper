# scraps
News aggregator that allows users to comment and vote up/down headlines, using node, cheerio, mongo/mongoose.


## Where Can You Try It Out?

* Here: https://global-news.herokuapp.com/

### What Does This App Do?

1. Web Scraping - using `cheerio` npm package, this app scrapes three world news sites - [BBC](https://www.bbc.com), [Al-Jazeera, Africa Section](http://www.aljazeera.com/topics/regions/africa.html), and [China Daily](http://usa.chinadaily.com.cn/us/index.html), and saves the headlines and links to the articles in a database.

2. NoSQL database via MongoDB - using `mongoose` npm package to create models and operate controllers, this app stores articles, favorites and votes on articles as well as allows certain articles to have user-generate notes stored on them.

3. Routing - using `express`, `method-override`, and `express-handlebars` packages to serve views, layouts and partials to the user. Some `jQuery` helps the front end deal with certain minute changes to the DOM.

### What are rooms for improvement?

* Create a user model, and utilize some sort of user authentication alongside `Passport.js`, to make favorites, notes and articles personalized. Currently, any and every user can make simultaneous changes to the DB which can easily lead to race conditions. As such, this app is in the very early stages of development.

* ~~Develop an algorithm for continually adding to the DB of articles being scraped that will not add duplicates, and that will allow the persistance and usefulness of the up/down vote feature.~~ DONE!

* Implement the ability to update one's notes on a given article.

* Style the UI to make it less 'boxy' feeling.