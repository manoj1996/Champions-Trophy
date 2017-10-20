<?php
	header("Content-type:text/xml");
	//To get content from different sever - This is a proxy server
	$feed = file_get_contents("0.xml");
	//Output is a string
	
	echo $feed;
?>
