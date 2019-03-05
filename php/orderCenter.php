
<?php
	//引入数据库连接
	include('db_login.php');

	$type = $_GET['type'];  //请求功能

	if ($type == 'allOrder')
		$returnData = allOrder($con);
	else if ($type == 'orderCancel')
		$returnData = orderCancel($con);

	//输出
	echo json_encode($returnData);

	//订单中心信息
	function allOrder($con)
	{
		$user_id = $_GET['user_id'];  //用户id
		$result = mysqli_query($con, "SELECT * FROM orderlist WHERE user_id = $user_id ORDER BY post DESC, order_id DESC;");
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
			$all_order_id[] = $row;
		if (!isset($all_order_id))
			$resultArray = null;
		else
		{
			//逐个查找订单中的宝贝
			for ($i=0; $i<count($all_order_id); $i++)
			{
				$result = mysqli_query($con, "SELECT * FROM baby, orderlistitem WHERE baby.baby_id = orderlistitem.baby_id AND orderlistitem.order_id = ".$all_order_id[$i]['order_id']);
				while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
					$resultArray[$i]['babys'][] = $row;
				$resultArray[$i]['order_id'] = $all_order_id[$i]['order_id'];
				$resultArray[$i]['order_number'] = $all_order_id[$i]['order_number'];
				$resultArray[$i]['price'] = $all_order_id[$i]['price'];
				$resultArray[$i]['post'] = $all_order_id[$i]['post'];
				$resultArray[$i]['state'] = $all_order_id[$i]['state'];
				$resultArray[$i]['baby_num'] = count($resultArray[$i]['babys']);
			}
		}
		return $resultArray;
	}

	//订单取消
	function orderCancel($con)
	{
		$order_id = $_GET['order_id'];  //订单id
		$result = mysqli_query($con, "UPDATE orderlist SET state = 'TRADE_CLOSED' WHERE order_id = $order_id;");
		if ($result)
			return true;
		return false;
	}

	mysqli_close($con);
?>