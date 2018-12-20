<?php

final class voteController extends CPLoader
{
    use Singleton;

    private $vote = null;

    public function __construct()
    {
        parent::__construct();
        
        $this->vote = new Vote();
    }
    
    public function index()
    {
        $info['vote_id'] = $this->element;

        if ($this->method == "edit" && $this->element) {
            $info['ItemVote'] = $this->vote->select_for_update($this->element);
        } elseif ($this->method == "del" && $this->element) {
            $info['DelVote'] = $this->vote->select_for_update($this->element);
        } else {
            $info['ListTheme'] = $this->vote->select_theme();
        }

        return $info;
    }

    public function questions()
    {
        $info['vote_id'] = $this->element;

        if ($this->method == "add" && $this->element) {
            $info['ListQuestions']   = $this->vote->select_questions($this->element);
            $info['result_vote_arr'] = $this->vote->get_result($this->element);
        }
    }

    public function post()
    {
        $post_id    = __post('id', $this->transfer);
        $action     = __post('action', $this->transfer);

        if ($action == "add_vote") {
            $visible = 1;

            if (!isset($this->transfer['visible'])) {
                $visible = 0;
            }
            
            $result = $this->vote->add_vote($this->transfer['title'], $visible, $this->transfer['ord']);
            redirect($info['base_path']);
        } elseif ($action == "edit_vote" && $post_id) {
            $this->vote->update($this->transfer, "#__vote_theme");
            redirect($info['base_path']);
        } elseif ($action == "del_vote" && $post_id) {
            $this->vote->delete_theme($post_id);
            redirect($info['base_path']);
        }
    }
}
