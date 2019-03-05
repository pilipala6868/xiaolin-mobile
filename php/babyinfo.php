
<?php
	//引入数据库连接
	include('db_login.php');
	include('same.php');

	$type = $_GET['type'];
	$baby_id = $_GET['baby_id'];
	if ($type == 'getInfo')
	{
		$returnData = array(
			'babyInfo' => babyInfo($con, $baby_id), 
			'recommend' => recommend($con, 4, $baby_id)
		);
	}
	else if ($type == 'addCart')
	{
		$returnData = addCart($con, $baby_id);
	}

	//输出
	echo json_encode($returnData);

	//获取宝贝信息
	function babyInfo($con, $baby_id)
	{
		$result = mysqli_query($con, "SELECT * FROM baby WHERE baby_id = $baby_id;");
		return mysqli_fetch_array($result, MYSQLI_ASSOC);
	}

	//添加购物车
	function addCart($con, $baby_id)
	{
		$user_id = $_GET['user_id'];
		$changetone = $_GET['changetone'];
		//查询是否购物车已有
		$result = mysqli_query($con, "SELECT shopping_id FROM shoppingcart WHERE user_id = $user_id AND baby_id = $baby_id;");
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
			$resultData = $row;
		if (isset($resultData))
			return false;
		else
		{
			$result = mysqli_query($con, "INSERT INTO shoppingcart VALUES (shopping_id, $user_id, $baby_id, $changetone);");
			if ($result)
				return true;
			return false;
		}
	}

	mysqli_close($con);
?>