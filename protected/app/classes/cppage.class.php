<?php

class cpPage extends CPLoader
{
    use Tools, Singleton;

    private $db		= [];
    private $user   = [];

    public function __construct($db = null)
    {
    	$this->db = $db;

        if (!empty($_SESSION['userinf']))
        {
            $this->user = $_SESSION['userinf'];
        }
    }

    public function get()
    {
        $args = func_get_args();

        $response = [];

        if (!empty($args))
        {
            $_keys = [];

            if (is_numeric($args[0]))
            {
                if (isset($args[1]) && is_array($args[1]))
                {
                    $_keys = $args[1];
                }

                $response = $this->_getItem($args[0], $_keys);
            }
            elseif (is_array($args[0]))
            {
                $_keys = $args[0];

                $_sort = [];

                $_page = 0;

                $_limit = 10;

                if (isset($args[1]) && is_array($args[1]) || is_string($args[1]))
                {
                    $_sort = $args[1];
                }

                if (isset($args[2]) && is_numeric($args[2]))
                {
                    $_page = $args[2];
                }

                if (isset($args[3]) && is_numeric($args[3]))
                {
                    $_limit = $args[3];
                }

                $response = $this->_getList($_keys, $_sort, $_page, $_limit);
            }
        }

        return $response;
    }

    public function delete(int $id = 0)
    {
        if ($id)
        {
            Q("DELETE FROM `" . $this->db['name'] . "` WHERE `id`=?i LIMIT 1", [
                $id
            ]);

            return true;
        }

        return false;
    }

    private function _getList(array $keys = [], $sort = [ 'id' => 'desc' ], int $page = 0, int $limit = 10)
    {
        $_sort = '';
        $_keys = '*';

        if (!empty($sort))
        {
            if (is_array($sort))
            {
                $_sort .= 'ORDER BY ';

                foreach ($sort as $key => $value)
                {
                    if ($this->_isAssoc($value))
                    {
                        foreach ($value as $k => $v)
                        {
                            $_sort .= sprintf("`%s` %s", $k, strtoupper($v));

                            if($k !== end($value))
                            {
                                $_sort .= ', ';
                            }
                        }
                    }
                    else
                    {
                        $_sort .= sprintf("`%s` %s", $key, strtoupper($value));
                    }
                }
            }
            elseif (is_string($sort))
            {
                $_sort .= sprintf("ORDER BY `%s`", $sort);
            }
        }

    	if (!empty($keys))
    	{
    		$_keys = sprintf("`%s`", implode('`, `', $keys));
    	}

        $list = Q("SELECT ". $_keys ." FROM `" . $this->db['name'] . "` ".$_sort." LIMIT ?i, ?i", [
            $page, $limit
        ])->all();

        return $list;
    }

    private function _getItem($id = 0, $keys = [])
    {
    	$item = [];
        $_keys = '*';

        if (!empty($keys))
        {
            $_keys = sprintf("`%s`", implode('`, `', $keys));
        }

    	if ($id)
    	{
	        $item = Q("SELECT ". $_keys ." FROM `" . $this->db['name'] . "` LIMIT 1", [
                $id
            ])->row();
    	}

        return $item;
    }

    /**
     * Проверяет наличие строковых ключей в массиве 
     * @param array $a
     * @return bool
     */
    private function _isAssoc($a = [])
    {
        if(!is_array($a))
        {
            return false;
        }

        return count(array_filter(array_keys($a), 'is_string')) > 0;
    }
}
