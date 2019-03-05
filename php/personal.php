
<?php
	//引入数据库连接
	include('db_login.php');

	$type = $_GET['type'];  //功能需求
	$user_id = $_GET['user_id'];  //用户id

	if ($type == 'personalInfo')
		$returnData = personalInfo($con, $user_id);
	else if ($type == 'passwordConfirm')
		$returnData = passwordConfirm($con, $user_id);
	else if ($type == 'updateInfo')
		$returnData = updateInfo($con, $user_id);

	//输出
	echo json_encode($returnData);

	//个人信息
	function personalInfo($con, $user_id)
	{
		$result = mysqli_query($con, "SELECT * FROM user WHERE user_id = $user_id;");
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
			$userData = $row;

		unset($userData['password']);
		return $userData;
	}

	//旧密码检测
	function passwordConfirm($con, $user_id)
	{
		$password = $_POST['password'];
		$result = mysqli_query($con, "SELECT * FROM user WHERE user_id = $user_id;");
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
			$userData = $row;
		if ($userData['password'] != md5(md5($password)))
			return 'wrongPassword';
		else
			return 'allRight';
	}

	//个人信息更新
	function updateInfo($con, $user_id)
	{
		$name = $_POST['name'];
		$username = $_POST['username'];
		$email = $_POST['email'];
		if (isset($_POST['passwordNew']))
		{
			$password = md5(md5($_POST['passwordNew']));
			$sql = "UPDATE user SET name = '$name', username = '$username', password = '$password', email = '$email' WHERE user_id = $user_id;";
		}
		else
			$sql = "UPDATE user SET name = '$name', username = '$username', email = '$email' WHERE user_id = $user_id;";

		$result = mysqli_query($con, $sql);
		if ($result)
			return true;
		else 
			return false;
	}

	mysqli_close($con);
?>