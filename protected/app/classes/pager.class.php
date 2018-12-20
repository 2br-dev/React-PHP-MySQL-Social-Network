<?php declare(strict_types = 1);

class Pager extends CPLoader
{
    use Singleton, Tools;

    public $pager = null;

    private $q = '';
    private $db = '';
    private $limit = 10;
    private $params = [];

    public function __construct($db = '', $q = '', $params = [], $limit = 10)
    {
        parent::__construct();

        $this->pager = new stdClass;

        $this->q = $q;
        $this->db = $db;
        $this->limit = $limit;
        $this->params = $params;

        return $this;
    }

    public function make()
    {
        $where = '';
        $added = '';

        # pager limit
        # 
        $this->pager->limit = $this->limit;

        if (!empty($this->params)) {
            foreach ($this->params as $k => $name) {
                if ($k !== 'page') {
                    $added .= '&'.$k.'='.$name;
                }
            }
        }

        if ($this->q !== '') {
            $where = 'WHERE '.$this->q;
        }

        # Текущая страница
        # 
        $this->pager->currPage = isset($_GET['page']) ? intval($_GET['page']) : 0;

        # Количество элементов
        # 
        $this->pager->allItems = Q("SELECT COUNT(`id`) AS `count` FROM `".$this->db."` ".$where." LIMIT 1")->row('count');

        # Стартовый элемент
        # 
        $this->pager->startItem = $this->pager->limit * $this->pager->currPage;

        # Количество страниц
        # 
        $this->pager->pageCount = ceil($this->pager->allItems / $this->pager->limit);

        # Максимальное количество выводимых страниц
        # 
        $this->pager->limitShow = 12;

        if ($this->pager->pageCount > 30)
        {
            if ($this->pager->allItems > $this->pager->limit) {
                $this->pager->advanced = 1;
                $this->pager->arrPages = [];

                $this->pager->firstPage = $this->page_root.'?page=0';
                $this->pager->lastPage = $this->page_root.'?page=' . ($this->pager->pageCount - 1);

                $first_pager = $this->pager->currPage - $this->pager->limitShow;
                $last_pager = $first_pager + $this->pager->limitShow * 2;

                if ($first_pager <= 0) {
                    $first_pager = 0;
                    $last_pager = $first_pager + $this->pager->limitShow + ($this->pager->limitShow / 2);
                }

                if ($last_pager >= $this->pager->pageCount) {
                    $last_pager = $this->pager->pageCount - 1;
                    $first_pager = $last_pager - $this->pager->limitShow - ($this->pager->limitShow / 2);
                }

                for ($i = $first_pager; $i <= $last_pager; $i++) {
                    $this->pager->arrPages[] = [
                        'point'     => $i,
                        'qstring'   => $this->page_root.'?page=' . $i . $added
                    ];
                }
            }
        } else {
            if ($this->pager->allItems > $this->pager->limit) {
                $this->pager->arrPages = [];

                for ($i = 0; $i < $this->pager->pageCount; $i++) {
                    $this->pager->arrPages[] = [
                        'point'     => $i,
                        'qstring'   => $this->page_root.'?page=' . $i . $added
                    ];
                }
            }
        }

        return $this->pager;
    }
}