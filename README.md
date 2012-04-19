popcorn-toc
=======

A popcorn plugin to create a visual table of contents.

## Example

	popcorn.toc({
		start: 0,
		end: 1000,
		text: "Table of Poptents",
		toc: [
		  {
		    timestamp: 0,
		    frameTime: 1,
		    title: "Intro to popcorn",
		  },
		  {
		    timestamp: 13,
		    title: "What can you use it for?",
		  }
	});