(function(phantom){
	"use strict";
	
	phantom.onError = function(msg, trace) {
		var msgStack = ['phantom.onError: ' + msg];
		if (trace && trace.length) {
			msgStack.push('trace:');
			trace.forEach(function(t) {
				msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function + ')' : ''));
			});
		}
		console.error(msgStack.join('\n'));
		phantom.exit(1);
	};
	
	var
	
	page 	= require('webpage').create(),
	system 	= require('system'),
	url 	= system.args[1],
	
	logEverything=false,
	
	printArgs = function() {
		var i, ilen;
		for (i = 0, ilen = arguments.length; i < ilen; ++i) {
			console.log("\targuments[" + i + "] = " + JSON.stringify(arguments[i]));
		}
		console.log("");
	},
	
	getPageData = function(){
		return page.evaluate(function() {
			return { count:TESTS_COMPLETE, total:MAX_TESTS };
		});
	},
	
	checkTestsComplete = function(){
		var data = getPageData();
		console.log("waiting... ");
		
		return typeof data!=='undefined' && data.count > 0 && data.count > 0 && data.count == data.total;
	},
	
	waitInterval = -1,
	waitForResults = function(){
		if(checkTestsComplete()){
			clearInterval(waitInterval);
			console.log("[PhantomJS] Tests complete!");
			setTimeout(function() { phantom.exit(0); }, 0);
		}
	},
	
	start = function(){
			
		if (system.args.length == 1) {
			console.log('[PhantomJS] Error: no page URL supplied...');
			phantom.exit(1);
		} else {
		
			// start up...
			console.log("[PhantomJS] Loading page at:", url);
			page.open(url, function(state){
				
				console.log("[PhantomJS] Page loaded");
				//console.log(page.content);
				
				if(state == "success"){
					
					if(checkTestsComplete()){
						console.log("[PhantomJS] Tests already completed on page-load!");
						setTimeout(function() { phantom.exit(0); }, 0);
						
					} else {
						
						var data = getPageData();
						if(typeof data !== 'undefined'){
							console.log("[PhantomJS] Running " + data.total + " test(s)...");
							waitInterval = setInterval(waitForResults, 500);
						} else {
							console.log("[PhantomJS] Tests data not found in loaded page - exit");
							setTimeout(function() { phantom.exit(0); }, 0);
						}
					}
					
				} else {
					console.log("[PhantomJS] Error loading page!");
					phantom.exit(1);
				}
			});
		}
	},


	setupPageCallbacks = function(){
		
		/** Handle js ballback from the clientside - window.callPhantom({ yourData:'here'}); */
		page.onCallback = function(data) {
			if(logEverything) console.log("[PhantomJS] page.onCallback");
			
			if(data.action == "shutdown"){
				page.render("../success.png");
				setTimeout(function() { phantom.exit(0); }, 0);
			} else if(data.action == 'testComplete'){
				console.log("[PhantomJS] test-complete (" + data.count + "/" + data.maxTests + ")");
				if(data.count == data.maxTests){
					console.log("[PhantomJS] All tests complete");
					// waiting for the POST data now...
				}
			} else {
				console.log('[PhantomJS] Error: Unexpected callback action: '+data.action);
				phantom.exit(1);
			}
		};
		
		page.onError = function (msg, trace) {
			console.log("[PhantomJS] page.onError");
			printArgs.apply(this, arguments);
			phantom.exit(1);
		};
		
		if(!logEverything) return;
		
		page.onInitialized = function() {
			console.log("[PhantomJS] page.onInitialized");
			printArgs.apply(this, arguments);
		};
		
		page.onLoadStarted = function() {
			console.log("[PhantomJS] page.onLoadStarted");
			printArgs.apply(this, arguments);
		};
		
		page.onLoadFinished = function() {
			console.log("[PhantomJS] page.onLoadFinished");
			printArgs.apply(this, arguments);
		};
		
		page.onUrlChanged = function() {
			console.log("[PhantomJS] page.onUrlChanged");
			printArgs.apply(this, arguments);
		};
		
		page.onNavigationRequested = function() {
			console.log("[PhantomJS] page.onNavigationRequested");
			printArgs.apply(this, arguments);
		};
		
		page.onResourceRequested = function() {
			console.log("[PhantomJS] page.onResourceRequested");
			printArgs.apply(this, arguments);
		};
		
		page.onResourceReceived = function() {
			console.log("[PhantomJS] page.onResourceReceived");
			printArgs.apply(this, arguments);
		};

		page.onClosing = function() {
			console.log("[PhantomJS] page.onClosing");
			printArgs.apply(this, arguments);
		};
		
		page.onConsoleMessage = function() {
			console.log("[PhantomJS] page.onConsoleMessage");
			printArgs.apply(this, arguments);
		};
		
		page.onAlert = function() {
			console.log("[PhantomJS] page.onAlert");
			printArgs.apply(this, arguments);
		};
		
		page.onConfirm = function() {
			console.log("[PhantomJS] page.onConfirm");
			printArgs.apply(this, arguments);
		};
		
		page.onPrompt = function() {
			console.log("[PhantomJS] page.onPrompt");
			printArgs.apply(this, arguments);
		};
	};
	
	setTimeout(function(){
		console.log("[PhantomJS] Took more than 30 seconds. Quitting");
		page.render("../failed.png");
		phantom.exit(1);
	}, 30000);
	
	setupPageCallbacks();
	
	start();
	
}(phantom));