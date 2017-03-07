danielburgess.me
===

### About

Welcome to the repo of my personal branding site. It doesn't have a lot on it right now, and it isn't super fancy, but it works okay and I hope you think it's sort of fun! I mainly use this as an experimental playground for trying out various ways of building websites. Right now, it's using [React](https://facebook.github.io/react/) for the view layer, and [React Motion](https://github.com/chenglou/react-motion) for some gaudy animations.

In this iteration, I mainly just wanted to create something sort of pretty and get experience doing animations in React. I decided I wanted all of my animations to be very interdependent (i.e., cascading based on the progress of other, related animations) which significantly increased the complexity of things. In the RealWorld™, I don't think this approach would scale very well...But you also probably wouldn't have every element on the page intertwined like I do here.

You may be thinking, based on the content of the site, that using React for such a basic site is totally overkill. The production build weighs in somewhere between ~150kb<sup><a href="#foot1" id="foot1ref">1</a></sup>, which, for a site that just displays a couple titles, a paragraph, and a few links, is pretty hefty.

If you were thinking that, you're entirely right! React, in my opinion, is especially well suited for very large, complex applications, which this is not. But one of my primary use cases for this is to experiment and learn. Of course, I'd like it to load quickly and efficiently, but that's a much lower priority.

### Usage

Running locally: `npm run start`

Running (very limited) tests: `npm run test`

Create production build: `npm run build`

Deploy production build: `npm run deploy` _(requires [.npmrc](.npmrc-sample) with config)_

###### Footnotes

[<a href="#foot1ref" id="foot1">1</a>]: It's worth noting that roughly half of this size can be attributed to a custom font. I'm using [Font Awesome](fontawesome.io) for icons. Of course, this is a trade-off I've made, sacrificing performance for my own convenience. It'd be valid to criticize this, as it's used for a measly seven icons, yet the entire font toolkit is loaded. Personally, I find this to be a reasonable concession for now. If I wanted to improve load time, optimizing this would be a good place to start.

###### This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
