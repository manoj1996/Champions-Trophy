<?php
	ob_start();
	date_default_timezone_set('Asia/Kolkata');
	//File modification time is given by...
	$oldtime = filemtime("data.txt"); //gives modification time of file
	while(true){
		ob_flush();
		flush();
		clearstatcache(); // update 1
		$newtime = filemtime("data.txt");
		$file=fopen("data.txt",'r');	
		if($newtime > $oldtime)
		{
			/*$modtime = date('d M Y H:i:s', $newtime);
			echo "$modtime";*/
			while(! feof($file))
  			{
 				echo fgets($file). "<br />";
 			}
			ob_flush();
			flush();
			//Update the oldtime
			$oldtime = $newtime;
		}
		
		//Monitor every 5s		
		sleep(2);		
	}	
?>

