function init()
{
	obj = new NewsFeed();
	obj.divouter = document.getElementById("outer");
	obj.divinner = document.getElementById("inner");
	//Inital position of the text is to the right
	//relative to its position if position was not defined
	//position: relative; left:10px - original one is 10px to the left of new one
	obj.divinner.style.left=window.innerWidth-2+"px";
	
	obj.divinner.onmouseover = obj.stopScroll;
	obj.divinner.onmouseout = obj.scrollText;
	
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
		if(obj.divinner.offsetLeft + obj.divinner.offsetWidth < 0)
		{
			obj.divinner.style.left = window.innerWidth - 2 + "px";
		}
		//GOLDEN RULE
		//set using style.left, read using offset property
		else
		{
			obj.divinner.style.left = obj.divinner.offsetLeft - 1 + "px";
		}
		obj.scrTimer = setTimeout(obj.scrollText, 7);
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
		for(i = 0; i < items.length; i++)
		{
			title = items[i].getElementsByTagName("title")[0]; //getElementByTagName always returns an array
			link = items[i].getElementsByTagName("link")[0];
			newfeed= new NewsFeedItem(title.firstChild.nodeValue, link.firstChild.nodeValue);
			
			//Store the feed details
			obj.feeds.push(newfeed);
			
			//Show in the browser
			obj.divinner.appendChild(newfeed.anchor);
			obj.divinner.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			if(i%5==0 && i!=0)
			{
				obj.divinner.innerHTML += "\n<br><hr>";
			}
		}
	}
}
