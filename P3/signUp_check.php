<?php
extract($_GET);
$servername = "localhost";
$username = "root";
$dbpassword = "";
$dbname='E Shopping';
// Create connection
$conn = mysqli_connect($servername, $username, $dbpassword,$dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
$sql="select uname,password from customer";
$result=mysqli_query($conn,$sql);
//if (mysqli_num_rows($result) > 0)
//{
	while($row = mysqli_fetch_assoc($result))
	{
		$name=$row["uname"];
		$pass=$row["password"];

		if($name==$uname && $pass==$password)
			{header("Refresh:0; url=main page.php"); mysqli_close($conn); die("correct Format");}
		
	}
//}
mysqli_close($conn);
header("Refresh:0; url=Shop@_Login.php"); 
?>

<!--manoj129
Manoj@pesu-->
