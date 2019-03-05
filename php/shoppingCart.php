
<?php
	//引入数据库连接
	include('db_login.php');

	$type = $_GET['type'];  //请求功能

	if ($type == 'allItem')
		$returnData = shoppingCart($con);
	else if ($type == 'changeTone')
		$returnData = changeTone($con);
	else if ($type == 'deleteShopping')
		$returnData = deleteShopping($con);
	else if ($type == 'newOrder')
		$returnData = newOrder($con);

	//输出
	echo json_encode($returnData);

	//购物车信息
	function shoppingCart($con)
	{
		$user_id = $_GET['user_id'];  //用户id
		$result = mysqli_query($con, "SELECT * FROM baby INNER JOIN shoppingcart WHERE baby.baby_id = shoppingcart.baby_id AND shoppingcart.user_id = $user_id ORDER BY shopping_id DESC;");
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
			$resultArray[] = $row;
		if (!isset($resultArray))
			$resultArray = null;
		return $resultArray;
	}

	//修改移调信息
	function changeTone($con)
	{
		$shopping_id = $_GET['shopping_id'];
		$result = mysqli_query($con, "UPDATE shoppingcart SET changetone = 1 WHERE shopping_id = $shopping_id;");
		if ($result)
			return true;
		return false;
	}

	//删除购物车商品
	function deleteShopping($con)
	{
		$shopping_id = $_GET['shopping_id'];
		$result = mysqli_query($con, "DELETE FROM shoppingcart WHERE shopping_id = $shopping_id;");
		if ($result)
			return true;
		return false;
	}

	//下单
	function newOrder($con)
	{
		$user_id = $_POST['user_id'];
		$orderNumber = $_POST['orderNumber'];
		$orderPrice = $_POST['orderPrice'];
		$orderLists = $_POST['orderLists'];
		//插入orderlist
		$result = mysqli_query($con, "INSERT INTO orderlist VALUES (order_id, '$orderNumber', $user_id, $orderPrice, NOW(), 'WAIT_BUYER_PAY')");
		if (!$result)
			return false;
		//获取刚插入的order_id
		$new_order_id = mysqli_insert_id($con);
		//逐个插入orderlistitem，且从购物车中删除
		for($i=0; $i<count($orderLists); $i++)
		{
			//是否有改调
			$changetone_temp = 0;
			if ($orderLists[$i]['changetone'] == 'true')
				$changetone_temp = 1;
			//插入orderlistitem
			$result = mysqli_query($con, "INSERT INTO orderlistitem VALUES (item_id, $new_order_id, ".$orderLists[$i]['baby_id'].", $changetone_temp)");
			if (!$result)
				return false;
			//购物车中删除
			$result = mysqli_query($con, "DELETE FROM shoppingcart WHERE shopping_id = ".$orderLists[$i]['shopping_id']);
			if (!$result)
				return false;
		}
		return true;
	}

	mysqli_close($con);
?>