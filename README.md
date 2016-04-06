# jQuery PsiiiAlphabetScroller

###

A plugin to convert a given DOM-List into an mobile-scrollable-list including a nice A-Z scrollable sidebar list.

## Usage

1. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
	```

2. Include plugin's code:

	```html
	<script src="src/jquery.psiiiAlphabetScroller.js"></script>
	<link href="src/jquery.alphabetScroller.css" media="all" rel="stylesheet"/>
	```

3. Call the plugin:

	```javascript
	 $("#element").alphabetScroller({
	 	class:'.az-item',
	 	...
	 });
	```

## Structure

The basic structure of the project is given in the following way:

```
├── demo/
│   └── index.html
├── src/
│   └── jquery.psiiiAlphabetScroller.js
│   └── jquery.psiiiAlphabetScroller.css
│   └── jquery.psiiiAlphabetScroller.less
├── .editorconfig
├── .gitignore
└── package.json
```

## License

[MIT License](http://zenorocha.mit-license.org/) © Zeno Rocha
