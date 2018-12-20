<?php

class Mysql
{
    public $Auto_Free     = 0;     ## Установить в 1 для автоматического mysqli_free_result()
    public $Debug         = 0;     ## Установить в 1 для получения сообщений дебага
    public $Halt_On_Error = "no";    ## "yes" (показать ошибку), "no" (проигнорировать), "report" (игнорировать ошибку, но показать предупреждение)
    public $Seq_Table     = "db_sequence";
    public $Record   = [];
    public $Row;
    public $Errno    = 0;
    public $Error    = "";
    public $type     = "mysql";
    public $revision = "1.2";
    public $Link_ID  = 0;
    public $Query_ID = 0;
    public $pager      = [];
    
    public function __construct($query = "")
    {
        $this->query($query);
    }
    
    public function connect()
    {
        if ($this->Link_ID == 0) {
            $this->Link_ID = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_BASE);
        
            if (!$this->Link_ID) {
                $this->halt("connect(Host, User, Password) failed.");
                return 0;
            }
        }
        //@mysqli_query( "SET NAMES cp1251" , $this->Link_ID );
        @mysqli_query("SET NAMES utf8", $this->Link_ID);
        return $this->Link_ID;
    }
    
    public function free()
    {
        @mysqli_free_result($this->Query_ID);
        $this->Query_ID = 0;
    }
    
    public function query($Query_String)
    {
        if ($Query_String == "") {
            return 0;
        }
        if (!$this->connect()) {
            $this->connect();
        }
        if ($this->Query_ID) {
            $this->free();
        }
        if ($this->Debug) {
            printf("Debug: query = %s<br>\n", $Query_String);
        }
        
        $Query_String = str_replace("`#_", "`".DB_PREF."_", $Query_String);
        $this->Query_ID = @mysqli_query($Query_String, $this->Link_ID);
        $this->Row   = 0;
        $this->Errno = mysqli_connect_errno();
        $this->Error = mysqli_connect_error();
        if (!$this->Query_ID) {
            $this->halt("Invalid SQL: ".$Query_String);
        }
        return $this->Query_ID;
    }
    
    public function next_record()
    {
        if (!$this->Query_ID) {
            $this->halt("next_record called with no query pending.");
            return 0;
        }
        if (isset($this->pager['limit'])) {
            #	first offset
            while ($this->Row < $this->pager['start_item']) {
                $this->Record = @mysqli_fetch_array($this->Query_ID);
                $this->Row++;
            }
            #	fast
            if ($this->Row >= $this->pager['start_item']+$this->pager['limit']) {
                $this->free();
                return null;
            }
        }
        $this->Record = @mysqli_fetch_array($this->Query_ID);
        $this->Row   += 1;
        $this->Errno  = mysqli_connect_errno();
        $this->Error  = mysqli_connect_error();
        
        $stat = is_array($this->Record);
        if (!$stat && $this->Auto_Free) {
            $this->free();
        }
        return $stat;
    }
    
    public function nr()
    {
        if (!$this->Query_ID) {
            $this->halt("next_record called with no query pending.");
            return 0;
        }

        $this->Record = @mysqli_fetch_array($this->Query_ID);
        $this->Row   += 1;
        $this->Errno  = mysqli_connect_errno();
        $this->Error  = mysqli_connect_error();

        $stat = is_array($this->Record);
        if (!$stat && $this->Auto_Free) {
            $this->free();
        }
        return $stat;
    }
    
    public function getAll()
    {
        $arAll = [];
        if ($this->Query_ID) {
            while ($arr = @mysqli_fetch_row($this->Query_ID)) {
                $thisRecord = [];
                foreach ($arr as $k => $v) {
                    $name_field = mysqli_field_name($this->Query_ID, $k);
                    $thisRecord[ $name_field ] = from_base($v);
                }
                $arAll[] = $thisRecord;
            }
        }
        return $arAll;
    }
    
    public function getLimited($limit=10)
    {
        $this->preparePager($limit);
        $i = 0;
        $arAll = [];
        if ($this->Query_ID) {
            while ($arr = @mysqli_fetch_row($this->Query_ID)) {
                if ($i > $this->pager['start_item'] + $this->pager['limit']) {
                    break;
                }
                if ($i >= $this->pager['start_item']) {
                    $thisRecord = [];
                    foreach ($arr as $k => $v) {
                        $name_field = mysqli_field_name($this->Query_ID, $k);
                        $thisRecord[ $name_field ] = from_base($v);
                    }
                    $arAll[] = $thisRecord;
                }
                $i++;
            }
        }
        return $arAll;
    }
    
    public function preparePager($limit)
    {
        $pager = [];
        #	Get page number
        $page = 0;
        if (isset($_GET['page'])) {
            $page = intval($_GET['page']);
        }
        #	Calculate paga count
        $count = $this->nf();
        if ($count % $limit == 0) {
            $page_count = $count / $limit;
        } else {
            $page_count = intval($count / $limit) + 1;
        }

        $this->pager['limit'] = $limit;
        $this->pager['curr_page'] = $page;
        $this->pager['page_count'] = $page_count;
        $this->pager['all_items'] = $count;
        $this->pager['start_item'] = $limit*$page;
    }

    public function getRecord()
    {
        $arr = @mysqli_fetch_row($this->Query_ID);
        $arAll = [];
        $thisRecord = [];
        if (!empty($arr)) {
            foreach ($arr as $k => $v) {
                $name_field = mysqli_field_name($this->Query_ID, $k);
                $thisRecord[ $name_field ] = from_base($v);
            }
            $arAll = $thisRecord;
            return $arAll;
        } else {
            return [];
        }
    }
    
    public function from_base($s)
    {
        return stripslashes($s);
    }
    
    public function to_base($s)
    {
        $s = trim($s);
        return addslashes($s);
    }
    
    public function affected_rows()
    {
        return @mysqli_affected_rows($this->Link_ID);
    }
    
    public function debug()
    {
        $this->Debug = 1;
    }
    
    public function num_rows()
    {
        return @mysqli_num_rows($this->Query_ID);
    }
    
    public function last_id()
    {
        return @mysqli_insert_id($this->Link_ID);
    }
    
    public function num_fields()
    {
        return @mysqli_num_fields($this->Query_ID);
    }
    
    public function nf()
    {
        return $this->num_rows();
    }
    
    public function f($Name)
    {
        //return isset($this->Record[$Name])?$this->Record[$Name]:0;
        return @$this->Record[$Name];
    }
    
    public function halt($msg)
    {
        $this->Error = @mysqli_connect_error($this->Link_ID);
        $this->Errno = @mysqli_connect_errno($this->Link_ID);
        if ($this->Halt_On_Error == "no") {
            return;
        }
        $this->haltmsg($msg);
        if ($this->Halt_On_Error != "report") {
            die('Errors');
        }
    }
    
    public function haltmsg($msg)
    {
        printf("</td></tr></table><b>Database error:</b> %s<br>\n", $msg);
        printf("<b>MySQL Error</b>: %s (%s)<br>\n", $this->Errno, $this->Error);
    }
    
    public function table_names()
    {
        $this->query("SHOW TABLES");
        $i=0;
        while ($info=mysqli_fetch_row($this->Query_ID)) {
            $return[$i]['table_name']= $info[0];
            $return[$i]['tablespace_name']=$this->Database;
            $return[$i]['database']=$this->Database;
            $i++;
        }
        return $return;
    }
    
    public function name_fields()
    {
        $res = [];
        $count_for = $this->num_fields();
        for ($i = 0; $i < $count_for; $i++) {
            $res[$i] = @mysqli_field_name($this->Query_ID, $i);
        }
        unset($count_for);
        return $res;
    }

    public function quote_smart($value)
    {
        if (get_magic_quotes_gpc()) {
            $value = stripslashes($value);
        }
        if (!is_numeric($value)) {
            $value = "'" . mysqli_real_escape_string($value) . "'";
        }
        return $value;
    }
}
