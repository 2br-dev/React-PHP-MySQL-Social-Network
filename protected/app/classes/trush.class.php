<?php

class Trush
{
    private $table = "#__str_trush";
    private $mysql = null;
    private $trush_id = 0;
    
    public function __construct($desc)
    {
        $this->mysql = new Mysql();
        $sql = "INSERT INTO `".$this->table."` SET `desc`='".to_base($desc)."', `date`=NOW(), `uid`='".@$_SESSION['user']['id']."' ";
        $this->mysql->query($sql);
        $this->trush_id = $this->mysql->last_id();
    }
    
    //
    public function toTrush($table, $id, $field_name='id')
    {
        $log = new Log("admin-structure", "Удаление структуры сайта в корзину");
        $sql_code = $this->prepareData($table, $id, $field_name);
        $sql = "SELECT * FROM `".$this->table."` WHERE `id`='".$this->trush_id."' ";
        $this->mysql->query($sql);
        if (!$this->mysql->nf()) {
            return;
        }
        //
        $this->mysql->next_record();
        $tmp_sql = $this->mysql->f("sql");
        //
        $sql_code = $tmp_sql.$sql_code;
        $sql = "UPDATE `".$this->table."` SET `sql`='".mysql_real_escape_string($sql_code)."' WHERE `id`='".$this->trush_id."'";
        //
        $this->mysql->query($sql);
    }
    
    //	get data and prepare sql queries
    public function prepareData($table, $id, $field_name)
    {
        $sql = "SELECT * FROM `".$table."` WHERE `".$field_name."`='".intval($id)."'";
        $this->mysql->query($sql);
        $res = $this->mysql->getAll();
        if (isset($res[0])) {
            $res = $res[0];
        }
        $sql = "INSERT INTO `".$table."` VALUES (";
        foreach ($res as $k=>$v) {
            $sql .= " '".to_base($v)."' ,";
        }
        $sql = substr($sql, 0, -1);
        $sql .= ");";
        //	returns result
        return $sql;
    }
}
