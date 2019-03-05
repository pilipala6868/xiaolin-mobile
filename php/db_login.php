

<?php

    /**
     *
     * 数据库连接文件
     * 包含所需数据库信息，用于数据库连接
     *
     * @date  2019.01.26
     *
     */

    $db_username = '******';
    $db_password = '******';
    $db_host = 'localhost';
    $db_database = '******';

    $con = mysqli_connect($db_host, $db_username, $db_password, $db_database);
    if (!$con)
        die ("Could not connect to the database: <br />" . mysqli_connect_error());

    mysqli_query($con, 'set names utf8');

?>
