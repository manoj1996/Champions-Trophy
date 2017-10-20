<?php
extract($_GET);
$servername = "localhost";
$username = "root";
$dbpassword = "";
$dbname='Champions';
// Create connection
$conn = mysqli_connect($servername, $username, $dbpassword,$dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
$count = rand(1000, 9999);
$uidNew = "UID".$count;
while(check($uidNew) == -1)
{
	$count = rand(1000, 9999);	
	$uidNew = "UID".$area.$count;
}

function check($uidNew)
{
	$servername = "localhost";
	$username = "root";
	$dbpassword = "";
	$dbname='Champions';
	// Create connection
	$conn = mysqli_connect($servername, $username, $dbpassword,$dbname);
	// Check connection
	if (!$conn) {
	    die("Connection failed: " . mysqli_connect_error());
	}
	$sql="select uid from fantasy";
	$result=mysqli_query($conn,$sql);
	while($row = mysqli_fetch_assoc($result))
	{
		$uid=$row["uid"];

		if($uid == $uidNew)
		{	
			return -1;	
		}
		
	}
	return 0;
}

$sql="insert into fantasy(uname,password,uid) values ('$uname','$password','$uidNew')";
if($conn->query($sql) === TRUE)
{
	header("Refresh:0; url=Fantasy_League_login.php"); 
	mysqli_close($conn);
}
else {
header("Refresh:0; url=signUp.php"); 
    mysqli_close($conn);

}

$conn->close(); 
?>
