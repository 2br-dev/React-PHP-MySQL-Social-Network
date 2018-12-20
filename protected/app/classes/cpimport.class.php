<?php

/**
* cpImport
*/

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class cpImport
{
    use Tools;

    protected $file = '';
    protected $basename = '';
    protected $sheetCount = 0;
    protected $activeSheet = 0;

    protected $support = [
        'xml',
        'yml',
        'csv',
        'xls',
        'xlsx'
    ];

    public function __construct() {}

    public function parse($file = '')
    {
        if (file_exists($file))
        {
            $this->file = $file;
            $this->basename = md5(basename($this->file));

            $session = Q("SELECT `data` FROM `#__import__session` WHERE `session` LIKE ?s LIMIT 1", [
                $this->basename
            ])->row('data');

            if (empty($session))
            {
                $extension = pathinfo($this->file, PATHINFO_EXTENSION);

                if (in_array($extension, $this->support) && method_exists($this, $extension))
                {
                    $data = $this->{$extension}();
                }
            }
        }
    }

    protected function yml()
    {
        exit(__('yml', $this->file));
    }

    protected function csv()
    {
        exit(__('csv', $this->file));
    }

    protected function xml()
    {
        $this->clean();

        // ">[\w\d\-\s]+$

        return $this->readXML();
    }

    protected function xls()
    {
        $pure = [];

        $settings = $this->getSettings(1);

        $sheets = $this->readXLS();

        $data = $this->mergeSheets($sheets);

        if (!empty($data))
        {
            $lastCategory = 0;

            $nestedCategory = '';
            $lastIsCategory = false;
            $lastCategoryItem = '';

            $category_count = count($settings['data']['category']);
            $products_count = count($settings['data']['products']);

            foreach ($data as $index => $cells)
            {
                if ($index >= $settings['row']['min'] && $index <= $settings['row']['max'])
                {
                    $name = 'products';
                    $slice = $this->sliceKey(array_diff($cells, ['']), $settings['col']['min'], $settings['col']['max']);

                    // if (empty($slice[9]) && isset($slice[0])) {
                    //     $slice = [
                    //         0 => $slice[0]
                    //     ];
                    // }

                    if (count($slice) == 1)
                    {
                        $name = 'category';
                    }

                    $filled = $this->fillData($slice, $settings['data'][$name], $settings['ignore']);

                    $count = count($filled);

                    if ($category_count > $count) {
                        $minCategory = $settings['data']['category'];
                        $maxCategory = $filled;
                    } else {
                        $minCategory = $filled;
                        $maxCategory = $settings['data']['category'];
                    }

                    if ($products_count > $count) {
                        $minProducts = $settings['data']['products'];
                        $maxProducts = $filled;
                    } else {
                        $minProducts = $filled;
                        $maxProducts = $settings['data']['products'];
                    }

                    $is_category = empty(array_diff_key($minCategory, $maxCategory));
                    $is_products = empty(array_diff_key($minProducts, $maxProducts));

                    if (!empty(array_filter($filled)))
                    {
                        if ($is_category && isset($filled[0]))
                        {
                            $categoryName = removeSpecials($filled[0]);

                            if ($lastIsCategory) {
                                $nestedCategory = removeSpecials($lastCategoryItem);
                            }

                            $nested = [];

                            if ($nestedCategory)
                            {
                                $nested[] = $nestedCategory;
                            }

                            $nested[] = $categoryName;

                            $lastCategory = md5(standardizeString(implode('.', $nested)));

                            $category = $this->productXLS($filled, $settings['data']['category']);

                            $category['name'] = removeSpecials($category['name']);

                            $pure[$lastCategory]['key'] = $index;
                            $pure[$lastCategory]['item'] = $category;

                            $lastIsCategory = true;
                            $lastCategoryItem = $categoryName;
                        }
                        else {
                            $lastIsCategory = false;
                        }

                        if ($is_products)
                        {
                            if (!isset($pure[$lastCategory]['tree']))
                            {
                                $pure[$lastCategory]['tree'] = [];
                            }

                            $product = $this->productXLS($filled, $settings['data']['products']);;
                            $product['category'] = $lastCategory;

                            $pure[$lastCategory]['tree'][] = $product;
                        }
                    }
                }
            }

            $this->insert($pure);
        }

        return $pure;
    }

    protected function xlsx()
    {
        return $this->xls();
    }

    protected function readXML()
    {
        $pure = [];

        if (file_exists($this->file))
        {
            $streamer = new SXmlStreamer($this->file, 16384, null, null, null, $this->basename, [
                'categories' => [
                    'category' => [
                        'attr',
                        'value'
                    ]
                ],
                'offers' => [
                    'offer' => [
                        'attr',
                        'name',
                        'rest',
                        'price',
                        'categoryId',
                        'НаименованиеПолное'
                    ]
                ]
            ]);

            $streamer->parse();
        }

        return $pure;
    }

    protected function readXLSIndex($objPHPExcel, $index = 0)
    {
        $array = [];

        $this->activeSheet = $index;

        $objPHPExcel->setActiveSheetIndex($index);

        $aSheet = $objPHPExcel->getActiveSheet();

        foreach ($aSheet->getRowIterator() as $row)
        {
            $cellIterator = $row->getCellIterator();

            $item = [];

            foreach ($cellIterator as $cell)
            {
                if (mb_detect_encoding($cell->getCalculatedValue()) !== 'utf-8')
                {
                    array_push($item, iconv(mb_detect_encoding($cell->getCalculatedValue()), 'utf-8', $cell->getCalculatedValue()));
                }
                else {
                    array_push($item, $cell->getCalculatedValue());
                }
            }

            array_push($array, $item);
        }

        return $array;
    }

    protected function readXLS()
    {
        $objPHPExcel = \PhpOffice\PhpSpreadsheet\IOFactory::load($this->file);

        $this->sheetCount = $objPHPExcel->getSheetCount();

        $array = [];

        if ($this->sheetCount > 0)
        {
            for ($i = 0; $i < $this->sheetCount; $i++)
            {
                $array[$i] = $this->readXLSIndex($objPHPExcel, $i);
            }
        }

        return $array;
    }

    protected function check($value, $type = '')
    {
        $response = true;

        switch ($type) {
            case 'int':
                $response = (is_int(intval($value))) && intval($value) !== 0;
            break;

            case 'float':
                $response = (is_float(floatval($value)) || is_int(intval($value))) && intval($value) !== 0;
            break;

            case 'string':
                $response = is_string($value);
            break;
        }

        return $response;
    }

    protected function productXLS($data = [], $settings = [])
    {
        $keys = [];
        $pure = [];

        foreach ($data as $k => $value)
        {
            $type = isset($settings[$k]['type']) ? $settings[$k]['type'] : 'string';

            if (!($this->check($value, $type)))
            {
                unset($data[$k]);
            }
        }

        foreach ($settings as $key => $value)
        {
            if (isset($data[$key]))
            {
                $pure[$value['name']] = $data[$key];
            }
        }

        if (isset($pure['real_price']))
        {
            $pure['real_price'] = floor($pure['real_price']);
        }

        return $pure;
    }

    protected function mergeSheets($data = [])
    {
        if (count($data))
        {
            $result = [];

            foreach ($data as $a)
            {
                $result = array_merge($result, $a);
            }

            return $result;
        }

        return $data;
    }

    protected function getSettings($variant = '')
    {
        $settings = [
            0 => [
                'col' => [
                    'min' => 0,
                    'max' => 18
                ],
                'row' => [
                    'min' => 0,
                    'max' => 30000
                ],
                'ignore' => [
                    'Наименование', 'Выход', 'Описание', 'Цена'
                ],
                'data' => [
                    'category' => [
                        # Наименование
                        0   =>  [
                            'name' => 'name',
                            'type' => 'string',
                            'require' => true
                        ],
                    ],
                    'products' => [
                        # Наименование
                        0   =>  [
                            'name' => 'name',
                            'type' => 'string',
                            'require' => true
                        ],

                        # Вес
                        3   =>  [
                            'name' => 'weight',
                            'type' => 'string',
                            'require' => true
                        ],

                        # Описание
                        5   =>  [
                            'name' => 'description',
                            'type' => 'string',
                            'require' => true
                        ],

                        # Цена
                        17  =>  [
                            'name' => 'price',
                            'type' => 'int',
                            'require' => true
                        ]
                    ]
                ]
            ],
            1 => [
                'col' => [
                    'min' => 0,
                    'max' => 8
                ],
                'row' => [
                    'min' => 1,
                    'max' => 30000
                ],
                'ignore' => [
                    'Наименование', 'Вес', 'Состав', 'Цена'
                ],
                'data' => [
                    'category' => [
                        # Наименование
                        0   =>  [
                            'name' => 'name',
                            'type' => 'string',
                            'require' => true
                        ],
                    ],
                    'products' => [
                        # Наименование
                        0   =>  [
                            'name' => 'name',
                            'type' => 'string',
                            'require' => true
                        ],

                        # Вес
                        2   =>  [
                            'name' => 'weight',
                            'type' => 'string',
                            'require' => true
                        ],

                        # Состав
                        3   =>  [
                            'name' => 'description',
                            'type' => 'string',
                            'require' => true
                        ],

                        # Цена
                        8  =>   [
                            'name' => 'price',
                            'type' => 'int',
                            'require' => true
                        ]
                    ]
                ]
            ]
        ];

        return $settings[$variant];
    }

    protected function ignoreData($input = [], $ignore = [])
    {
        if (!empty($input) && !empty($ignore))
        {
            foreach ($input as $k => $value)
            {
                if (in_array($value, $ignore)) {
                    $input[$k] = '';
                }
            }
        }

        return $input;
    }

    protected function fillData($input = [], $settings = [], $ignore = [])
    {
        $valid = true;

        $unrequired = array_keys($settings);

        if (!empty($unrequired))
        {
            foreach ($unrequired as $key) {
                if (!isset($input[$key]))
                {
                    $valid = false;
                }
            }
        }

        if (!$valid)
        {
            if (!empty($input) && !empty($settings))
            {
                foreach ($settings as $key => $opt)
                {
                    if ($opt['require'] && empty($input[$key]))
                    {
                        $input[$key] = '';
                    }
                }
            }

            ksort($input);
        }

        $input = $this->ignoreData($input, $ignore);

        return $input;
    }

    protected function sliceKey($input = [], $min = 0, $max = 0)
    {
        if (!empty($input) && $max > $min)
        {
            foreach ($input as $k => $v) {
                if ($k < $min || $k > $max)
                {
                    unset($input[$k]);
                }
            }

            return $input;
        }

        return [];
    }

    protected function clean()
    {
        Q("DELETE FROM `#__import__session` WHERE `session` LIKE ?s", [
            $this->basename
        ]);
    }

    protected function insert($data = [])
    {
        Q("INSERT `#__import__session` SET `session`=?s, `data`=?s", [
            $this->basename, serialize($data)
        ]);
    }
}
