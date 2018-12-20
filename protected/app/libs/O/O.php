<?php

function O()
{
    $args = func_get_args();
    $object = null;
    switch (count($args)) {
        case 0:
            $object = new O(); break;
        case 1:
            $object = new O($args[0]); break;
        case 2:
            $object = new O($args[0], $args[1]); break;
        case 3:
            $object = new O($args[0], $args[1], $args[2]); break;
        case 4:
            $object = new O($args[0], $args[1], $args[2], $args[3]); break;
        case 5:
            $object = new O($args[0], $args[1], $args[2], $args[3], $args[4]); break;
        case 6:
            $object = new O($args[0], $args[1], $args[2], $args[3], $args[4], $args[5]); break;
        case 7:
            $object = new O($args[0], $args[1], $args[2], $args[3], $args[4], $args[5], $args[6]); break;
    }

    return $object;
}

class O
{
    protected $_table = '';
    protected $_where = '';
    protected $_args = [];

    public function __construct($table)
    {
        $args = func_get_args();
        $buf = explode(':', array_shift($args));
        $this->_table = $buf[0];

        $nargs = count($args);
        if (count($buf) > 1) {
            $buf = preg_split('#(\|\|)|(\&\&)#', $buf[1], -1, PREG_SPLIT_NO_EMPTY|PREG_SPLIT_DELIM_CAPTURE);
            //__($buf);

            for ($i = 0, $n = count($buf); $i < $n; $i++) {
                $buf[$i] = trim($buf[$i]);
                if ($buf[$i] == '||') {
                    $this->_where .= ' OR ';
                } elseif ($buf[$i] == '&&') {
                    $this->_where .= ' AND ';
                } elseif ($nargs) {
                    if (preg_match('#^(\w+)$#', $buf[$i])) {
                        $this->_where .= $buf[$i].' = ?x';
                    } else {
                        $this->_where .= $buf[$i].' ?x';
                    }
                } else {
                    $this->_where .= $buf[$i];
                }
            }
            //__($this->_where);
        }
        
        for ($i = 0; $i < $nargs; $i++) {
            if (is_array($args[$i])) {
                $this->_args = array_merge($this->_args, $args[$i]);
            } else {
                $this->_args[] = $args[$i];
            }
        }
        
        //__($this->_args);
    }
    
    public function create($params)
    {
        $fields = [];
        $place_holders = [];
        foreach ($params as $f => $v) {
            $buf = explode(':', $f);
            $type = '?x';
            if (count($buf) > 1) {
                $f = $buf[1];
                $type = '?'.$buf[0];
            }

            $fields[] = $f;
            $place_holders[] = $type;
        }

        $q = 'INSERT INTO #'.$this->_table.'(`'.implode('`,`', $fields).'`) VALUES('.implode(',', $place_holders).')';

        //__($params, $fields, $place_holders, $q);
        return Q($q, $params);
    }

    public function update($params)
    {
        if (empty($this->_where)) {
            $this->_where = 'id = ?x';
        }

        $update = [];
        foreach ($params as $f => $v) {
            $buf = explode(':', $f);
            $type = '?x';
            if (count($buf) > 1) {
                $f = $buf[1];
                $type = '?'.$buf[0];
            }

            $update[] = '`'.$f.'` = '.$type;
        }

        $q = 'UPDATE #'.$this->_table.' SET '.implode(',', $update).' WHERE '.$this->_where;
        //__($q, array_merge($params, $this->_args));
        return Qb($q, array_merge($params, $this->_args));
    }

    public function delete()
    {
        if (empty($this->_where)) {
            $this->_where = 'id = ?x';
        }

        $q = 'DELETE FROM #'.$this->_table.' WHERE '.$this->_where;
        return Q($q, $this->_args);
    }

    public function find($fields = [])
    {
        $needle = '*';

        if (!empty($fields)) {
            $needle = sprintf('`%s`', implode('`, `', $fields));
        }

        if (empty($this->_where)) {
            $this->_where = 'id = ?x';
        }

        $q = 'SELECT '. $needle .' FROM #'.$this->_table.' WHERE '.$this->_where;

        return Q($q, $this->_args);
    }
}

if (!function_exists('__')) {
    function __()
    {
        $args = func_get_args();
        $nargs = func_num_args();
        $trace = debug_backtrace();
        $caller = array_shift($trace);

        $key = $caller['file'].':'.$caller['line'];

        echo '<pre>', $key, "\n";
        for ($i=0; $i<$nargs; $i++) {
            echo print_r($args[$i], 1), "\n";
        }
        
        echo '</pre>';
    }
}
