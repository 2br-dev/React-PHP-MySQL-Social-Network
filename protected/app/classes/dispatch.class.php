<?php

class Dispatch
{
    public $files = null ;
    public $dispatch_id = null ;
    
    public function __construct()
    {
        if ($this->files === null) {
            $this->files = new Files;
        }
    }
    
    public function checkModule($id = 0)
    {
        if ($id) {
            $modules = Q("SELECT * FROM `#__dispatch`")->all();

            if (!empty($modules)) {
                foreach ($modules as $module) {
                    $ex = explode(',', $module['module']);

                    foreach ($ex as $v) {
                        if ($v == $id) {
                            return 1;
                        }
                    }
                }

                return 2;
            }
        }
    }
    
    // function list_dispatch() {
    // 	$this->mysql->query( "SELECT * FROM `#__dispatch` ORDER By `name` " ) ;
    // 	$arr = [];
    // 	if ( $this->mysql->nf() ) {
    // 		$brr = $this->mysql->getAll() ;
    // 		foreach( $brr as $k=>$v ) {
    // 			$arr[] = array(
    // 				'id'			=>	$v['id'] ,
    // 				'name'			=>	from_base( $v['name'] ) ,
    // 				'module_name'	=>	$this->getModName( $v['module'] ) ,
    // 				'module'		=>	$v['module'] ,
    // 				'settings'		=>  unserialize( $v['settings'] ) ,
    // 				'send_to'		=>	$v['send_to'] ,
    // 				'send_to_field'	=>	$v['send_to_field'] ,
    // 				'send_group'	=>	$v['send_group'] ,
    // 				'send_list'		=>	$v['send_list']
    // 			) ;
    // 		}
    // 	}
    // 	return $arr ;
    // }
    
    // function sendToModule( $module_id , $item_id ) {
        
    // 	$this->dispatch_id = $module_id ;
        
    // 	# Поиск таблицы рассылки
    // 	$this->mysql->query( "SELECT `sys_name` FROM `#__mdd_modules` WHERE `id`='".$module_id."' " ) ;
    // 	if ( $this->mysql->nf() ) {
    // 		$this->mysql->next_record() ;
    // 		$table = $this->mysql->f( 'sys_name' ) ;
        
    // 		# Настройки рассылки
    // 		$this->mysql->query( "SELECT `settings` FROM `#__dispatch` WHERE `module`='".$module_id."' LIMIT 1 " ) ;
    // 		if ( $this->mysql->nf() ) {
    // 			$this->mysql->next_record() ;
    // 			$settings = unserialize( $this->mysql->f( 'settings' ) ) ;
    // 			if ( !empty($settings ) ) foreach( $settings as $k=>$v ) {
    // 				$arr[$k] = array( 'value' => $this->getElementValue( $table, $module_id, $k, $item_id ) , 'order' => $v['order'] ) ;
    // 				$brr[$v['order']] = $k ;
    // 			}
    // 		}
    // 		ksort( $brr ) ;
    // 		return $this->SubscribeSend( $arr, $brr ) ;
    // 	}
    // }
    
    // function SubscribeSend( $arr, $brr ) {
    // 	$template = "" ;
    // 	$attachment = [];
    // 	foreach( $brr as $k=>$v ) {
    // 		if ( !is_array( $arr[$v]['value'] ) )
    // 			$template .= "<p>".stripslashes( nl2br( $arr[$v]['value'] ) )."</p>" ;
    // 		else
    // 			foreach( $arr[$v]['value'] as $key=>$val ) $attachment[] = array( 'real_name' => $val['real_name'], 'sys_name' => $val['sys_name'] ) ;
    // 	}
    // 	return $this->dispatch_mail( $template, $this->maillist( $this->dispatch_id ) , $this->getSubject() , $attachment ) ;
    // }
    
    // function getFileType( $n ) {
    // 	if ( strstr( $n , ".") ) {
    // 		$e = explode( "." , $n ) ;
    // 		$c = count( $e ) - 1 ;
    // 		return $e[$c] ;
    // 	}
    // 	else return '' ;
    // }
    
    // function dispatch_mail( $template, $emails, $name , $attachment ) {
    // 	global $tpl ;
    
    // 	$domen = $_SERVER['SERVER_NAME'] ;
    // 	$subject = $name.' '.$domen;
    // 	$sName = COMPANY_NAME ;
            
    // 	$tpl->assign( 'domen', $domen ) ;
    // 	$tpl->assign( 'subject', $subject ) ;
    // 	$tpl->assign( 'sName', $sName ) ;
    // 	$tpl->assign( 'text1', 'С уважением, администрация сайта <a href="http://'.$domen.'">'.$sName.'</a>.' ) ;
    // 	$tpl->assign( 'footer', 'Письмо сгенерированно автоматически. Отвечать на него не нужно.' ) ;
    // 	if ( $template != '' ){
    // 		$tpl->assign( 'template', $template ) ;
    // 	}
    // 	$mail = new mMail() ;
    // 	$mail->setSubject( iconv("utf-8","windows-1251", $subject ) ) ;
    // 	$mail->setFrom( iconv("utf-8","windows-1251", $sName )." <info@".$domen.">" ) ;
    // 	$html = iconv("utf-8","windows-1251", $tpl->fetch( PATH_ROOT."/admin/dispatch/tpl/send-tpl-message.tpl" ) ) ;
        
    // 	if ( isset($attachment ) && !empty( $attachment ) ) {
    // 		foreach( $attachment as $k=>$v ) {
    // 			if ( file_exists( $_SERVER['DOCUMENT_ROOT'].$v['sys_name'] ) )
    // 			$mail->addAttachment( $v['real_name'], $this->getFileType( $v['sys_name'] ) , $_SERVER['DOCUMENT_ROOT'].$v['sys_name'] ) ;
    // 		}
    // 	}
        
    // 	$mail->setHtmlBody( $html ) ;
        
    // 	if ( isset($emails ) && !empty( $emails ) ){
    // 		$arr['goods'] = 0 ;
    // 		$arr['error'] = 0 ;
    // 		foreach( $emails as $v ) {
    // 			$mail->To = array( $v ) ;
    // 			if ( $mail->send() )
    // 				$arr['goods'] += 1 ;
    // 			else
    // 				$arr['error'] += 1 ;
    // 		}
    // 		return $arr ;
    // 	}
    // }
        
    // function getSubject() {
    // 	$this->mysql->query( "SELECT `name` FROM `#__dispatch` WHERE `module`='".$this->dispatch_id."' LIMIT 1 " ) ;
    // 	if ( $this->mysql->nf() ) {
    // 		$this->mysql->next_record() ;
    // 		return $this->mysql->f('name') ;
    // 	}
    // 	else return "Рассылка" ;
    // }
    
    // function getElementValue( $tab, $module_id, $field, $item_id ) {
    // 	$table = "#_mdd_".$tab ;
        
    // 	$this->mysql->query( "SELECT `f_type`, `f_table_dep`, `f_table_field`, `f_table_list`, `photo_settings` FROM `#__mdd_fields` WHERE `module_id`='".$module_id."' AND `f_sys_name`='".$field."' " ) ;
        
    // 	if ( $this->mysql->nf() ) {
    // 		$this->mysql->next_record() ;

    // 		$f_type			= $this->mysql->f('f_type') ;
    // 		$f_table_dep	= $this->mysql->f('f_table_dep') ;
    // 		$f_table_field	= $this->mysql->f('f_table_field') ;
    // 		$f_table_list	= $this->mysql->f('f_table_list') ;
    // 		//$photo_settings	= $this->mysql->f('photo_settings') ;
            
    // 		$this->mysql->query( "SELECT `".$field."` FROM `".$table."` WHERE `id`='".$item_id."' " ) ;
    // 		if ( $this->mysql->nf() ) {
    // 			$this->mysql->next_record() ;
                
    // 			# Значение из таблицы
    // 			$val = $this->mysql->f( $field ) ;
                
    // 			# Выбор значения в зависимости от типа
    // 			if ( $f_type == 8 || $f_type == 9 )
    // 				$value = $this->files->getFilesByGroup( $val ) ;
    // 			elseif ( $f_type == 10 || $f_type == 11 || $f_type == 12 ) {
    // 				if ( !$f_table_list && $f_table_dep && $f_table_field )
    // 					$value = $this->getElementByTableField( $f_table_dep, $f_table_field, $val ) ;
    // 				elseif ( $f_table_list )
    // 					$value = $this->getElementByCategory( $f_table_list, $val ) ;
    // 			}
    // 			else
    // 				$value = $val ;
                
    // 			return $value ;
    // 		}
    // 	}
    // }
    
    // function getElementByTableField( $f_table_dep, $f_table_field, $val ) {
    // 	$this->mysql->query( "SELECT `".$f_table_field."` as `var` FROM `".$f_table_dep."` WHERE `id`='".$val."' " ) ;
    // 	if ( $this->mysql->nf() ) {
    // 		$this->mysql->next_record() ;
    // 		return $this->mysql->f( 'var' ) ;
    // 	}
    // }
    
    // function getElementByCategory( $f_table_list, $val ) {
    // 	$this->mysql->query( "SELECT `var` FROM `#__mdd_lists` WHERE `value`='".$val."' AND `list_name`='".$f_table_list."' " ) ;
    // 	if ( $this->mysql->nf() ) {
    // 		$this->mysql->next_record() ;
    // 		return $this->mysql->f( 'var' ) ;
    // 	}
    // }
    
    // function getModName( $mid ) {
    // 	$this->mysql->query( "SELECT `name` FROM `#__mdd_modules` WHERE `id`='".$mid."' " ) ;
    // 	if ( $this->mysql->nf() ) {
    // 		$this->mysql->next_record() ;
    // 		return $this->mysql->f( 'name' ) ;
    // 	}
    // }
    
    // function doSerialize( $arr ) {
    // 	if ( !empty( $arr ) ) {
    // 		$temp = array () ;
    // 		foreach( $arr as $k=>$v ) {
    // 			$set = $this->is_settings( $k ) ;
    // 			if ( $set ) {
    // 				$temp[$set] = array (
    // 					'value'	=>	$set ,
    // 					'order'	=>	$arr["settings_".$set."_ord"]!=''?($arr["settings_".$set."_ord"]):0 ,
    // 				) ;
    // 			}
    // 		}
    // 		return serialize( $temp ) ;
    // 	}
    // 	else return "";
    // }
    
    // function is_settings( $val ) {
    // 	if ( strstr( $val, "settings_" ) ) {
    // 		$r = str_replace( "settings_", "", $val ) ;
    // 		if ( !strstr( $r, "_ord" ) )
    // 			return $r ;
    // 	}
    // 	else return false ;
    // }
    
    // function get_modules(){
    // 	$this->mysql->query( "SELECT * FROM `#__mdd_modules` " ) ;
    // 	return $this->mysql->getAll() ;
    // }
    
    // function get_groups(){
    // 	$this->mysql->query( "SELECT * FROM `#__usr_groups` " ) ;
    // 	return $this->mysql->getAll() ;
    // }
    
    // function item_dispatch($id){
    // 	$this->mysql->query( "SELECT * FROM `#__dispatch` WHERE `id`='".$id."' " ) ;
    // 	if ( $this->mysql->nf() ) {
    // 		$brr = $this->mysql->getAll() ;
    // 		$arr = array(
    // 			'id'				=>	$brr[0]['id'] ,
    // 			'name'				=>	from_base( $brr[0]['name'] ) ,
    // 			'module'			=>	$brr[0]['module'] ,
    // 			'settings'			=>  unserialize( $brr[0]['settings'] ) ,
    // 			'send_to'			=>	$brr[0]['send_to'] ,
    // 		 	'send_to_field_id'	=>	$brr[0]['send_to_field'] ,
    // 		 	'send_to_field'		=>	$this->send_to_field( $brr[0]['send_to'] ) ,
    // 			'send_group'		=>	explode( "," , $brr[0]['send_group'] ) ,
    // 			'send_list'			=>	$brr[0]['send_list']
    // 		) ;
    // 	}
    // 	return $arr ;
    // }
    
    // function get_fields( $id, $mode="" ) {
    // 	if ( $mode=="all" )
    // 		$this->mysql->query( "SELECT * FROM `#__mdd_fields` WHERE `module_id`='".$id."' " ) ;
    // 	else
    // 		$this->mysql->query( "SELECT * FROM `#__mdd_fields` WHERE `f_type`='1' and `module_id`='".$id."' " ) ;
        
    // 	if ( $this->mysql->nf() ) {
    // 		$emails = [];
    // 		while( $this->mysql->next_record() ) {
    // 			$sn = $this->mysql->f( 'f_sys_name' ) ;
    // 			if ( $sn != "id" && $sn != "ord" && $sn != "updated" && $sn != "uid"  && $sn != "gid" && $sn != "visible" && $sn != "created" ) {
    // 				$emails[] = array(
    // 					'id'		=>	$this->mysql->f( 'id' ) ,
    // 					'f_name'	=>	from_base( $this->mysql->f( 'f_name' ) ) ,
    // 					'f_sys_name'	=>	from_base( $this->mysql->f( 'f_sys_name' ) ) ,
    // 				) ;
    // 			}
    // 		}
    // 		return $emails ;
    // 	}
    // }
    
    // function getFieldId( $id ) {
    // 	$this->mysql->query( "SELECT `module` FROM `#__dispatch` WHERE `id`='".$id."' " ) ;
    // 	if ( $this->mysql->nf() ) {
    // 		$this->mysql->next_record() ;
    // 		return $this->mysql->f( 'module' ) ;
    // 	}
    // }
    
    // function maillist( $id ) {
    // 	$this->mysql->query( "SELECT * FROM `#__dispatch` WHERE `module`='".$id."' " ) ;
    // 	if ( $this->mysql->nf() == 1 ) {
    // 		$val = $this->mysql->getAll() ;
    // 		$arr = [];
    // 		#send to
    // 		$send_to = $val[0]['send_to'] ;
    // 		if ( $send_to != '' && $send_to != 0 ) {
    // 			$fid = $val[0]['send_to_field'] ;
    // 			if ( $fid != '' && $fid != 0 ) {
    // 				$brr = $this->email_from_field( $send_to , $fid ) ;
    // 				$arr = array_merge( $arr, $brr ) ;
    // 			}
    // 		}
            
    // 		#send_group
    // 		$send_group = $val[0]['send_group'] ;
    // 		if ( $send_group != '' ) {
    // 			$crr = $this->group_emails( $send_group ) ;
    // 			$arr = array_merge( $arr, $crr ) ;
    // 		}
                
    // 		#send_list
    // 		$send_list = $val[0]['send_list'] ;
    // 		if ( $send_list != '' ){
    // 			$send_list = str_replace( " ", "", $send_list ) ;
    // 			if ( $send_list != '' ){
    // 				$e = explode( ";" , $send_list ) ;
    // 				$c = count( $e ) ;
    // 				if ( $c > 0 ){
    // 					$err = [];
    // 					foreach( $e as  $k=>$v ){
    // 						$err[] = array( 'email' => $v ) ;
    // 					}
    // 					$arr = array_merge( $arr, $err ) ;
    // 				}
    // 			}
    // 		}
    // 		return $this->check_emails( $arr ) ;
    // 	}
    // }
    
    // function check_emails( $arr ){
    // 	if ( is_array($arr) && !empty($arr) ){
    // 		$result = [];
    // 		foreach( $arr as $k=>$v ){
    // 			if ( !in_array( $v['email'] , $result ) ){
    // 				if ( isset($v['email'] ) && preg_match("%^[A-Za-z0-9](([_.-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([.-]?[a-zA-Z0-9]+)*).([A-Za-z])+$%", $v['email'] ) ){
    // 					$result = array_merge( $result, array( $v['email'] ) ) ;
    // 				}
    // 			}
    // 		}
    // 		return $result ;
    // 	}
    // }
    
    // function group_emails( $group ) {
    // 	$group = explode( "," , $group ) ;
    // 	if ( isset($group ) && !empty( $group ) ) {
    // 		$arr = [];
    // 		foreach( $group as $k=>$v ) {
    // 			if ( $v != '' && intval( $v ) ) {
    // 				$this->mysql->query( "SELECT `email` FROM `#__usr_users` WHERE `gid`='".$v."' GROUP By `email` " ) ;
    // 				if ( $this->mysql->nf() ) {
    // 					while( $this->mysql->next_record() ){
    // 						$arr[] = array( 'email'	=>	$this->mysql->f( 'email' ) ) ;
    // 					}
    // 					return $arr ;
    // 				}
    // 			}
    // 		}
    // 	}
    // }
    
    // function email_from_field( $send_to , $fid ){
    // 	$this->mysql->query( "SELECT `f_sys_name` FROM `#__mdd_fields` WHERE `id`='".$fid."' " ) ;
    // 	if ( $this->mysql->nf() ){
    // 		$this->mysql->next_record() ;
    // 		$f_sys_name = $this->mysql->f( 'f_sys_name' ) ;
            
    // 		$q0 = new Mysql( "SELECT `sys_name` FROM `#__mdd_modules` WHERE `id`='".$send_to."' " ) ;
    // 		if ( $q0->nf() ){
    // 			$q0->next_record() ;
    // 			$sys_name = $q0->f( 'sys_name' ) ;
                
    // 			$q1 = new Mysql( "SELECT `".$f_sys_name."` FROM `#_mdd_".$sys_name."` GROUP By `".$f_sys_name."` " ) ;
    // 			if ( $q1->nf() ){
    // 				$arr = [];
    // 				while( $q1->next_record() ){
    // 					$arr[] = array(
    // 						'email'	=>	$q1->f( $f_sys_name )
    // 					) ;
    // 				}
    // 			}
    // 			return $arr ;
    // 		}
    // 	}
    // }

    // function del($id){
    // 	if ( isset($id ) && $id != '' ){
    // 		$this->mysql->query( "DELETE FROM `#__dispatch` WHERE `id`='".$id."' LIMIT 1 " ) ;
    // 	}
    // }
    
    // function send_to_field( $id='' ){
    // 	if ( $id != '') {
    // 		$this->mysql->query( "SELECT * FROM `#__mdd_fields` WHERE `f_type`='1' and `module_id`='".$id."' " ) ;
    // 		if ( $this->mysql->nf() ){
    // 			$emails = [];
    // 			while( $this->mysql->next_record() ){
    // 				$emails[] = array(
    // 					'id'		=>	$this->mysql->f( 'id' ) ,
    // 					'f_name'	=>	from_base( $this->mysql->f( 'f_name' ) )
    // 				) ;
    // 			}
    // 			return $emails ;
    // 		}
    // 	}else
    // 		return '' ;
    // }
}
