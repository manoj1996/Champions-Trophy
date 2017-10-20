function init()
{
	obj = new NewsFeed();
	obj.divouter = document.getElementById("outer");
	obj.divinner1 = document.getElementById("inner1");
	obj.divinner2 = document.getElementById("inner2");
	obj.divinner3 = document.getElementById("inner3");
	obj.divinner4 = document.getElementById("inner4");
	obj.divinner5 = document.getElementById("inner5");
	obj.divinner6 = document.getElementById("inner6");
	obj.divinner7 = document.getElementById("inner7");
	obj.divinner8 = document.getElementById("inner8");
	//Inital position of the text is to the right
	//relative to its position if position was not defined
	//position: relative; left:10px - original one is 10px to the left of new one
	obj.divinner1.style.left=window.innerWidth-2+"px";
	
	obj.divinner1.onmouseover = obj.stopScroll;
	obj.divinner1.onmouseout = obj.scrollText;
	
	obj.getFeed();
	//String -> JSON - JSON.parse(text)
	//JSON -> String - JSON.stringify(obj) - serialization on client side
	//Call the timer to scroll the text
	obj.scrollText();
}

//Class for each headline
function NewsFeedItem(title, link)
{
	this.anchor = document.createElement("a");
	this.anchor.href = link;
	this.anchor.innerHTML = title;
}


function NewsFeed()
{
	this.feeds = new Array();
	/*
	//Does not work
	this.scrTimer = null;
	this.dx=5;
	this.scrollText = function() {
		obj.divouter.style.paddingLeft  = 100-obj.dx + "%";
		obj.dx += 1;
		//console.log(obj.dx);
		obj.scrTimer = setTimeout(obj.scrollText, 50);
	*/
	this.scrTimer = null;
	this.scrollText = function() {
		if(obj.divinner1.offsetLeft + obj.divinner1.offsetWidth < 0)
		{
			obj.divinner1.style.left = window.innerWidth - 2 + "px";
		}
		//GOLDEN RULE
		//set using style.left, read using offset property
		else
		{
			obj.divinner1.style.left = obj.divinner1.offsetLeft - 2 + "px";
		}
		obj.scrTimer = setTimeout(obj.scrollText, 20);
	}	
	this.stopScroll = function()
	{
		if(obj.scrTimer)
			clearTimeout(obj.scrTimer);
	}
	//Function to get the feed from the server. Every 10 mins
	this.getFeed = function()
	{
		$.ajax(
			{
				url: "http://localhost/icc/P1/rss/getfeeds.php",
				type: "GET",
				data: {},
				dataType: "xml",
				success: obj.showNews,
				error: obj.showError
			}
		);
		
		//Do the call every 10 mins - do setTimeout(obj.getFeeds, 10*60*1000);
	}
	this.showNews = function(xmldom)
	{
		rssnode = xmldom.documentElement;
		items = rssnode.getElementsByTagName("item");
		alert(items+":"+items.length);
		for(i = 0; i < 10; i++)
		{
			title = items[i].getElementsByTagName("title")[0]; //getElementByTagName always returns an array
			link = items[i].getElementsByTagName("link")[0];
			newfeed= new NewsFeedItem(title.firstChild.nodeValue, link.firstChild.nodeValue);
			
			//Store the feed details
			obj.feeds.push(newfeed);
			
			//Show in the browser
			obj.divinner1.appendChild(newfeed.anchor);
			obj.divinner1.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		}
	}
}
