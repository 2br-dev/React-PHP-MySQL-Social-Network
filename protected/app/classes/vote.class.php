<?php
/*
lnk
Правки от 11.11.2009
*/
class Vote
{
    public $Link_ID  = 0;
    public $Query_ID = 0;
    public $tab_theme = "#__vote_theme";
    public $tab_quest = "#__vote_questions";
    public $tab_result = "#__vote_result";
    public $use_coockie = 0; #0 не использовать куки
    public $coockie_life_time = 155520000; //Время жизни куков 60 * 60 * 24 * 30 * 6 = 155520000 - 0.5 года
    public $error = [
        'err1'        =>        "empty",
        'err2'        =>        "Query error",
        'err3'        =>        "Вы уже голосовали",
        'err4'        =>        "Thank you for your vote",
        'err5'        =>        "Ощибка при выводе результатов",
        'err6'        =>        "Ощибка при удалении из таблицы",
        'err7'        =>        "Успешное удаление из базы",
        'err8'        =>        "Поля с таким id нет",
    ];

    public $mysql = null;

    # Конструктор
    #
    public function __construct()
    {
        if ($this->mysql === null) {
            $this->mysql = new Mysql();
        }
    }

    # Информация о голосующем
    #
    public function get_info($vote_id)
    {
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && $_SERVER['HTTP_X_FORWARDED_FOR'] != "") {
            $hash =    md5($_SERVER['REMOTE_ADDR'].$_SERVER['HTTP_X_FORWARDED_FOR'].$vote_id);
        } else {
            $hash =    md5($_SERVER['REMOTE_ADDR'].$vote_id);
        }
        return  $hash;
    }

    # Функция добавления голосования
    #
    public function add_vote($vote, $visible, $ord)
    {
        if ($vote != "") {
            $this->mysql->query("INSERT INTO `".$this->tab_theme."` 
								SET `title`='".stripslashes($vote)."',`created`=NOW(), `visible`='".$visible."', `ord`='".$ord."' ");
            if ($this->mysql->last_id()) {
                return 1;
            } else {
                return $this->error['err2'];
            }
        } else {
            return $this->error['err1'];
        }
    }
    
    #Добавление вопроса
    public function add_question($parent_id, $question, $ord, $visible)
    {
        if ($question != "") {
            $this->mysql->query("INSERT INTO `".$this->tab_quest."` 
								SET `title` = '".$question."', `parent_id` = '".$parent_id."', `visible` = '".$visible."', `ord` = '".$ord."'  ");
            if (!$this->mysql->last_id()) {
                return $this->error['err2'];
            } else {
                return $this->mysql->last_id();
            }
        } else {
            return 0;
        }
    }
    
    #Выборка вопросов для темы
    public function get_vote()
    {
        $this->mysql->query("SELECT `".$this->tab_theme."`.`id` as `vote_id`,
									`".$this->tab_theme."`.`title` as `vote_title`,
									`".$this->tab_quest."`.`id` as `vote_question_id`,
									`".$this->tab_quest."`.`title` as `vote_question_title`
									 FROM `".$this->tab_theme."`,`".$this->tab_quest."` 
									 WHERE 	`".$this->tab_theme."`.`visible` = '1' and 
											`".$this->tab_quest."`.`visible` = '1' and 
											`".$this->tab_quest."`.`parent_id` = `".$this->tab_theme."`.`id`  
									ORDER BY `".$this->tab_theme."`.`ord` ASC ");
        if ($this->mysql->nf()) {
            $array = [];
            $id = 0;
            while ($this->mysql->next_record()) {
                if ($id != $this->mysql->f('vote_id')) {
                    $id = $this->mysql->f('vote_id');
                }
                $array[$id][] = array(
                //$array[] = array(
                    'vote_id'                =>    $this->mysql->f('vote_id'),
                    'vote_title'            =>    $this->mysql->f('vote_title'),
                    'vote_question_id'        =>    $this->mysql->f('vote_question_id'),
                    'vote_question_title'    =>    $this->mysql->f('vote_question_title'),
                );
            }
            return $array;
        } else {
            return $this->error['err2'];
        }
    }
    
    #Функция обработки голосования
    public function pooling($vote_id, $pool_id)
    {
        if ($vote_id) {
            if ($pool_id != "") {
                $hash = $this->get_info($vote_id);
                $check = $this->checking($vote_id);
                if ($check == 1) {
                    $q0 = new Mysql("INSERT INTO `".$this->tab_result."` SET `ip_user` = '".$_SERVER['REMOTE_ADDR']."',
					`id_vote` = '".$vote_id."', `id_question` = '".$pool_id."', `hash` = '".$hash."', `date` = NOW() ");
                    if ($q0) {
                        #Если куки включены, помещаем в куки инфу о голосовании
                        if ($this->use_coockie != 0) {
                            $coockie_param = "vote_".$vote_id;
                            setcookie($coockie_param, $hash, time()+$this->coockie_life_time);
                        }
                        #Выводим результаты
                        $result_table = $this->get_result($vote_id);
                        $resArr = $this->parser($result_table, 0);
                        return $resArr;
                    } else {
                        return $this->error['err2'];
                    }
                } else {
                    $result_table = $this->get_result($vote_id);
                    $resArr = $this->parser($result_table, 1);
                    return $resArr;
                }
            } else {
                return $this->error['err1'];
            }
        } else {
            return $this->error['err1'];
        }
    }

    #Выводим таблицу результатов
    public function get_result($vote_id)
    {
        $arr = [];
        $this->mysql->query("SELECT `".$this->tab_quest."`.`title`, `".$this->tab_theme."`.`title` as question, `".$this->tab_theme."`.`id` as vote_theme_id,
		(SELECT count(id) FROM `".$this->tab_result."` WHERE `".$this->tab_result."`.`id_question` = `".$this->tab_quest."`.`id`) as numbs
		FROM `".$this->tab_quest."`, `".$this->tab_theme."` 
		WHERE `".$this->tab_quest."`.`parent_id` = '".$vote_id."' 
		and `".$this->tab_quest."`.`visible` = '1' and `".$this->tab_theme."`.`id` = '".$vote_id."' 
		GROUP BY `".$this->tab_quest."`.`title` 
		ORDER BY `".$this->tab_quest."`.`ord` DESC ");
        if ($this->mysql->nf()) {
            while ($this->mysql->next_record()) {
                $arr[] = array(
                    'vote_theme'            =>    $this->mysql->f('question'),
                    'vote_theme_id'            =>    $this->mysql->f('vote_theme_id'),
                    'vote_question_title'    =>    $this->mysql->f('title'),
                    'vote_question_count'    =>    $this->mysql->f('numbs'),
                );
            }
            return $arr;
        }
    }
    
    #Проверяем голосовал ли пользователь
    public function checking($vote_id)
    {
        $chk = 0;
        $hash = $this->get_info($vote_id);
        if ($this->use_coockie != 0) {
            $coockie_param = "vote_".$vote_id;
            if (isset($_COOKIE[$coockie_param]) && $_COOKIE[$coockie_param] == $hash) {
                $chk = 1;
            }
        }
        if ($chk == 0) {
            $this->mysql->query("SELECT * FROM `".$this->tab_result."` WHERE `hash` = '".$hash."' LIMIT 1");
            if ($this->mysql->nf() == 0) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
    
    #Рекурсивное удаление вопроса
    public function delete_theme($vote_id)
    {
        if ($vote_id != "") {
            $this->mysql->query("SELECT * FROM `".$this->tab_theme."` WHERE `id` = '".$vote_id."' ");
            if ($this->mysql->nf()== 1) {
                #Удалим тему
                if ($this->mysql->query("DELETE FROM `".$this->tab_theme."` WHERE `".$this->tab_theme."`.`id` = '".$vote_id."' LIMIT 1")) {
                    #Удалим все вопросы относящиеся к данной теме
                    if ($this->mysql->query("DELETE FROM `".$this->tab_quest."` WHERE `".$this->tab_quest."`.`parent_id` = '".$vote_id."' ")) {
                        #Удалим все результаты относящиеся к данной теме
                        if ($this->mysql->query("DELETE FROM `".$this->tab_result."` WHERE `".$this->tab_result."`.`id_vote` = '".$vote_id."' ")) {
                            return 1;
                        } else {
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
    
    #Удаление вопроса
    public function delete_question($quest_id)
    {
        if ($quest_id != "") {
            $this->mysql->query("SELECT * FROM `".$this->tab_quest."` WHERE `id` = '".$quest_id."' ");
            if ($this->mysql->nf() == 1) {
                #Удалим вопрос
                if ($this->mysql->query("DELETE FROM `".$this->tab_quest."` WHERE `".$this->tab_quest."`.`id` = '".$quest_id."' LIMIT 1")) {
                    #Почистим результаты
                    if ($this->mysql->query("DELETE FROM `".$this->tab_result."` WHERE `".$this->tab_result."`.`id_question` = '".$quest_id."' ")) {
                        return 1 ;
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
    
    #Выбор данных для обновления
    public function select_for_update($id)
    {
        $this->mysql->query("SELECT * FROM `".$this->tab_theme."` WHERE `id` = '".$id."' ");
        if ($this->mysql->nf()) {
            $this->mysql->next_record();
            $arr =  array(
                'id'         => $this->mysql->f('id'),
                'title'         => $this->mysql->f('title'),
                'created'     => $this->mysql->f('created'),
                'visible'     => $this->mysql->f('visible'),
                'ord'         => $this->mysql->f('ord'),
            );
            return $arr;
        } else {
            return 0;
        }
    }
    
    #Выбор тем
    public function select_questions($id)
    {
        $arr = [];
        $this->mysql->query("SELECT * FROM `".$this->tab_quest."` WHERE `parent_id` = '".$id."' ORDER BY `ord` DESC ");
        while ($this->mysql->next_record()) {
            $arr[] = array(
                'id'            =>    $this->mysql->f('id'),
                'parent_id'        =>    $this->mysql->f('parent_id'),
                'title'            =>    $this->mysql->f('title'),
                'visible'        =>    $this->mysql->f('visible'),
                'ord'            =>    $this->mysql->f('ord'),
            );
        }
        return $arr;
    }
    
    #Выбор тем
    public function select_theme()
    {
        $theme = [];
        $this->mysql->query("SELECT * FROM `".$this->tab_theme."` ORDER BY `ord` DESC ");
        while ($this->mysql->next_record()) {
            $theme[] = array(
                'theme_id'        =>    $this->mysql->f('id'),
                'theme_title'    =>    $this->mysql->f('title'),
                'theme_visible'    =>    $this->mysql->f('visible'),
                'theme_created'    =>    $this->mysql->f('created'),
                'theme_ord'        =>    $this->mysql->f('ord'),
            );
        }
        return $theme;
    }
    
    #Обновление тем
    public function update($value, $table)
    {
        $set = "";
        if ($table == $this->tab_theme) {
            $tab = $this->tab_theme;
            $set = "`created` = '".$value['created']."', `title` = '".$value['title']."', `visible` = '".$value['visible']."', `ord` = '".$value['ord']."'  WHERE `id` = '".$value['id']."' ";
        } else {
            $tab = $this->tab_quest;
            $set = "`parent_id` = '".$value['parent_id']."', `title` = '".$value['title']."', `visible` = '".$value['visible']."', `ord` = '".$value['ord']."'  WHERE `id` = '".$value['id']."' ";
        }
        $this->mysql->query("UPDATE `".$tab."` SET ".$set." ");
        if ($this->mysql->affected_rows()) {
            return 1;
        }
    }
    
    #Парсер результата
    public function parser($result, $param)
    {
        $result_table = [];
        if (!empty($result)) {
            if ($param == 1) {
                $status = $this->error['err3'];
            } else {
                $status = "0";
            }
            foreach ($result as $k => $v) {
                $arr = [];
                $array_result = [];
                $summ = 0;
                foreach ($result as $k1 => $v1) {
                    $summ += $v1['vote_question_count'];
                }
                foreach ($result as $key => $value) {
                    if ($value['vote_question_count'] == 0) {
                        $percent = 0;
                    } else {
                        $percent =($value['vote_question_count'] / $summ) * 100;
                    }
                    $array_result[] = array(
                        'title'        =>    $value['vote_question_title'],
                        'count'        =>    $value['vote_question_count'],
                        'percent'    =>    round($percent, 1),
                    );
                }
                $arr = array(
                    'status'    =>    $status,
                    'theme_id'    =>    $v['vote_theme_id'],
                    'theme'        =>    $v['vote_theme'],
                    'summ'        =>    $summ,
                    'question'    =>    $array_result,
                );
            }
            $result_table = $arr;
        }
        return $result_table;
    }
}
