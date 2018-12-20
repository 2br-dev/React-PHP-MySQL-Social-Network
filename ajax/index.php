<?php 

error_reporting(E_ALL);

if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
	$domain	= $_SERVER["HTTP_HOST"];
	$parse_url = parse_url($_SERVER["REQUEST_URI"]);
	$path = preg_split('/\/+/', $parse_url['path'], -1, PREG_SPLIT_NO_EMPTY);
	$controller = isset($path[1]) ? $path[1] : '';
	$action = isset($path[2]) ? $path[2] : '';
	
	include_once '../define.php';

	if (!session_id()) {
		session_start();
	}

	
	if ($controller == 'registration') {

		$login 		  = __post('login');
		$password 	= __post('password');
		$email 			= filter_var(__post('email'), FILTER_VALIDATE_EMAIL);
		$username   = __post('username');
		$phone			= __post('phone');

		if (isset($username) && isset($login) && isset($phone) && isset($email) && isset($login)) {
			
			$result = Q("INSERT INTO `#_mdd_users` SET `login`=?s, `password`=?s, `email`=?s, `username`=?s, `phone`=?s, `admin`=?i, `created`=NOW()", 
				array($login, md5( $password ), $email, $username, $phone, 0));
	
			echo json_encode( array( 'result' => 1 ), 64 | 256 ); 
		} else {
			echo json_encode( array( 'result' => 0 ), 64 | 256 );
		}

	}

	if ($controller == 'signup') {

		$login 		  = __post('login');
		$pass				= md5(__post('password'));
		$servername = DB_HOST;
		$username 	= DB_USER;
		$password 	= DB_PASS;
		$dbname 		= DB_BASE;
		
		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		} 

		if (isset($login) && isset($password)) {
			if ($result = mysqli_query($conn, "SELECT * FROM `db_mdd_users` WHERE `login` = '$login' AND `password` = '$pass'")) {
				/* определение числа рядов в выборке */
				$row_cnt = mysqli_num_rows($result);
		
				if ($row_cnt == 0) {
					if ($result = mysqli_query($conn, "SELECT * FROM `db_mdd_users` WHERE `email` = '$login' AND `password` = '$pass'")) {
						$row_cnt = mysqli_num_rows($result);
						if ($row_cnt == 0) {
							echo json_encode( array( 'result' => 0 ), 64 | 256 );
						} else {
							echo json_encode( array( 'result' => 1 ), 64 | 256 ); 
						}
					}			
				} else {
					echo json_encode( array( 'result' => 1 ), 64 | 256 ); 
				}
		
				/* закрытие выборки */
				mysqli_free_result($result);
			}
		} 	

		$conn->close();
	}
/* 	if ($controller == 'sendmessage') {
		$status = false;
		$errors = array();
		$responce = array();

		$con = new mysqli("127.0.0.1", "root", "", "mdenta");
	
		if ($con -> connect_error) {
			echo "database connection error";
		}
		$stmt = $con->prepare("INSERT INTO db_mdd_formdata (field, phone) VALUES (?, ?)");
		$stmt->bind_param("ss",$field,$phone);
		if ($stmt->execute()) {
			echo "success";
		} else {
			echo "failure";
		}

    $domen = str_replace([ 'http://', 'www.', 'www' ], '', $_SERVER['SERVER_NAME']);

    $subject = '<h2>Новое сообщение, на сайте ' . $domen . '</h2>';

    $body  = '';
    $body .= '<p>Здравствуйте,</p>';
    $body .= '<p>Новое сообщение, на сайте ' . $domen . '</p>';
    $body .= '<p>--------------------</p>';

    $phone = isset($_POST['phone']) ? $_POST['phone'] : '';
		$field = isset($_POST['field']) ? $_POST['field'] : '';
		
		if ($field == '') {
			$errors['field'] = 'field';
		}
		if ($phone == '') {
			$errors['phone'] = 'name';
		}

    if ($field) {
      $body .= '<p>Заявка с формы: <strong>'. $field .'</strong></p>';
    }

    if ($phone) {
      $body .= 'Телефон: <a href="tel:'. $phone .'"><strong>'. $phone .'</strong></a>';
    }

		$body .= '<p>--------------------</p>';
    $body .= '<p>Дата отправки: '. date('d.m.Y H:i:s') .'</p>';

		$emails = getfl('emails');

    // Create the Transport
    $transport = (new \Swift_SmtpTransport('smtp.mail.ru', 465, 'ssl'))
      ->setUsername('prog@2-br.ru')
      ->setPassword('123123prog');

    // Create the Mailer using your created Transport
    $mailer = new \Swift_Mailer($transport);

    // Create a message
    $message = (new \Swift_Message($subject))
      ->setFrom(['prog@2-br.ru' => 'DEV'])
      ->setTo($emails)
      ->setBody($body, 'text/html');
		
			//$mailer->send($message);
			if ($mailer->send($message)) {
      //unset($_SESSION[$this->session]);
      	$response['success'] = 1;
      } else {
        $response['error'] = 1;
      }

		exit(
			json_encode( $responce, 64 | 256 )
		);
	}

	if( $controller == 'search' )
	{
		$term = __get( 'term' );
		$result = Q("SELECT `id`, `city`, `region` FROM `#_mdd_cityes` WHERE `city` LIKE '%". $term ."%' ORDER BY `city` ASC LIMIT 10")->all();
		
		if( !empty ( $result ) ) {
			foreach( $result as $arr ) {
				$arr['label'] = str_replace( $term, '<span class="autocomplete-selected">' . $term . '</span>', $arr['city'] );
			}
		}
		echo json_encode( $result );
	}

	elseif ($controller == 'registration')
	{
		$phone 		= __post('phone');
		$password 	= __post('password');
		$name 		= __post('name');
		$email 		= __post('email');
		$city 		= __post('city');
		$address 	= __post('address');

		$result = Q("INSERT INTO `#_mdd_users` SET `phone`=?s, `password`=?s, `name`=?s, `email`=?s, `city`=?s, `address`=?s, `created`=NOW()", array( 
			$phone, md5( $password ), $name, $email, $city, $address
		));

		echo json_encode( array( 'result' => 1 ), 64 | 256 ); 
	}

	elseif( $controller == 'validation' ) {
		$value = __post('value');
		$field = isset($path[2] ) ? $path[2] : '';

		if( $field !== '' ) {
			if( $field == 'email' ) {
				if( !isset($_SESSION['registration']['email_code'] ) || empty( $_SESSION['registration']['email_code'] ) ) {
					$_SESSION['registration']['email_code'] = rand(10000, 99990);

					$code = $_SESSION['registration']['email_code'];
					$domen = str_replace( array( 'http://', 'www.', 'www' ) , '', $_SERVER['SERVER_NAME'] );
				   
					$m  = '<p>Здравствуйте!</p>';
					$m .= '<p>Ваш код подтверждения на сайте ' . $domen . ': ' . $code . '</p>';
					$m .= '<p>Дата и время отправки сообщения: '. date( 'd.m.Y H:i:s' ) .'</p>';

					$sended = sendMail('Подтверждение адреса электронной почты', $m, 'info@' . $domen, $value);
					
					$result = (int)is_email($value) && $sended;
				}
				else {
					$result = 0;
				}

				echo
					json_encode(
						array(
							'result' => $result
						), 64 | 256
					);
			}
			elseif( $field == 'email_code' ) {
				if( $_SESSION['registration']['email_code'] == $value ) {
					$result = 1;
				}
				else {
					$result = 0;
				}

				echo json_encode(
					array(
						'result' => $result
					), 64 | 256
				);
			}
			elseif( $field == 'phone' ) {
				
				if( is_phone($value) ) {
					$domen = str_replace( array( 'http://', 'www.', 'www' ) , '', $_SERVER['SERVER_NAME'] );
					$phone = str_replace( array( '+', '(', ')', ' ', '-' ), '', $value );

					if( !isset($_SESSION['registration']['phone_code'] ) || empty( $_SESSION['registration']['phone_code'] ) ) {
						$_SESSION['registration']['phone_code'] = rand(10000, 99990);

						$code = $_SESSION['registration']['phone_code'];
						$url = "http://sms.ru/sms/send?api_id=973996a8-7094-1674-d1b6-e7f63a0c826a&to=". $phone ."&text=" . urlencode( "Ваш код подтверждения на сайте " . $domen . ": " ) . $code;
						$responce = file_get_contents( $url );
					}

					$result = 1;
				} else {
					$result = 0;
				}
				
				echo json_encode(
					array(
						'result' => $result
					), 64 | 256
				);
			}
		}
	}
	if ($controller = 'writetodatabase') {

		$servername = DB_HOST;
		$username 	= DB_USER;
		$password 	= DB_PASS;
		$dbname 		= DB_BASE;
	
		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		} 

		$sql =  "UPDATE -DATABASE- SET -FIELD- = -VALUE-, -FIELD- = -VALUE-  WHERE -FIELD- = -VALUE-";
		$conn->query($sql);

		O('_mdd_balance')->create(array(
			'renter_id' 	=> 	$_POST['renter_id'],
			'contract_id' => 	$id,
			'balance' 		=> 	$contract_balance,
			'ground'			=> 	'payment',
			'contract' 		=> 	$contract_number['number'],
			'date' 				=> 	$_POST['date'],
			'renter' 			=> 	$renter_full_name,
			'ground_id' 	=> 	$balance_in_contract['ground'],	
			'summa' 			=> 	$rest_sum,
		));	
	
		$conn->close();
			
	} */


	return true ;
}