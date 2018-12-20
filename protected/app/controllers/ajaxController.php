<?php

final class ajaxController extends CPLoader
{
    use Singleton;

    public function __construct()
    {
        parent::__construct();
    }
    
    public function dispatch()
    {
        if (count($_POST)) {
            $dispatch = new Dispatch() ;
            
            $action = __post("action", "post");
            $id    = __post("id", "post");
            
            if ($action == "get_fields" && $id) {
                exit(json_encode($dispatch->get_fields($id)));
            }
            
            if ($action == "moduleSending" && $id) {
                exit(json_encode($dispatch->get_fields($id, "all")));
            }
        }
    }

    public function filedelete()
    {
        $msg = [];
        $_id = __post('id');

        if ($_id) {
            $f = new Files;

            $gid = $f->getGroupByFileId($_id);

            //	Removing files
            $f->deleteFile($_id);

            //	Load files list
            $msg = $f->getFilesByGroup($gid);
        }

        return json_encode($msg);
    }

    public function document()
    {
        $id     = __post("id");
        $post_id = __post("post_id");
        $cont     = __post("cont");
        $d         = new Document();
        
        switch ($id) {
            case "document_edit":
                echo $d->editDocs(__post("docsid"), __post("title"), __post("ord"));
            break;
            
            case "update":
                exit(json_encode($d->pageUpdate($post_id)));
            break;
            
            case "document_del":
                echo $d->deleteDocs(__post("docsid"), 1);
            break;
            
            default:
                echo 0;
            break;
        }
    }

    public function structure()
    {
        $act = __post("act");

        if ($act == "tree") {
            $stc = new Structure();
            array_push($_SESSION['admin_struct'], intval($_POST['pid']));
            $stc->syncCookie();

            $mod_id = __post("mod_id");

            if ($mod_id) {
                $module = new Meta($mod_id);
                exit(json_encode($module->getModuleForStc(), 64 | 256));
            } else {
                exit(json_encode($stc->getChilds($_POST['pid']), 64 | 256));
            }
        } elseif ($act == "ajaxAddTemplate") {
            $name = __post("name");
            $file = __post("file");
            
            if ($name !== '' && $file !== '') {
                Q("INSERT INTO `#__str_templates` SET `name`=?s, `sys_name`=?s on duplicate key update `sys_name`=?s", [
                    $name,
                    $file,
                    $file
                ]);

                $result = Q("SELECT * FROM `#__str_templates` WHERE `name`!='' AND `sys_name`!=''")->all();

                exit(json_encode($result, 64 | 256));
            }
        } elseif ($act == "toggle_visible") {
            $mod_id = intval(__post('mod_id'));

            if ($mod_id) {
                $module = new Meta($mod_id);

                if ($module->toggleVis(__post("id"))) {
                    return 1;
                }
                
                return 0;
            } else {
                $id = intval(__post('id'));

                $stc = new Structure();

                if ($stc->toggleVis($id)) {
                    return 1;
                }

                return 0;
            }
        }
    }

    public function modules()
    {
        $act = __post('action');

        if ($act == "devisible") {
            $id       = __post("id");
            $visible   = __post("visible");
            
            if ($id) {
                Q("UPDATE `#__mdd_group` SET `visible`='".$visible."' WHERE `id`='".$id."' LIMIT 1");
                
                exit('1');
            }
            exit('0');
        }
    }
    
    public function vote()
    {
        $action = __post("action");
        $id    = __post("id");
        $title    = __post("title");
        $ord    = __post("ord");
        $visible = __post("visible");
        
        $vote = new Vote();

        if ($action == 'add_questions') {
            $result = $vote->add_question($id, $title, $ord, $visible);
            echo $result;
            return $result;
        } elseif ($action == 'update') {
            $result = $vote->update($_POST, "#_vote_questions");
        } elseif ($this == 'del') {
            $result = $vote->delete_question($id);
            if ($result == 1) {
                exit($id) ;
            }
        }
    }
    
    public function meta()
    {
        if (count($_POST)) {
            $act = __post('action');
            
            if ($act == 'renamefile') {
                $id        = __post('id');
                $name    = __post('namedocs');
                
                if ($id && $name) {
                    Q("UPDATE `#__sys_files` SET `title`='".$name."' WHERE `id`='".$id."' LIMIT 1");
                
                    exit('1');
                }
                
                exit('0');
            }

            if ($act == 'newfileord') {
                $id        = __post('id');
                $ord    = __post('neword');
                
                if ($id && $ord) {
                    Q("UPDATE `#__sys_files` SET `ord`=?i WHERE `id`='".$id."' LIMIT 1", array( $ord ));
                    Q("UPDATE `#__sys_files` SET `ord`=?i WHERE `fid`='".$id."'", array( $ord ));
                    exit('1');
                }
                
                exit('0');
            }
            exit;
        }
    }
}
