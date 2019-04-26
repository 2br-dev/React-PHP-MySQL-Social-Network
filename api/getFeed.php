<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../verify.php';
require_once '../vendor/autoload.php';
if (!verify()) header('location:/login');

$userid = parseUserId();
$feed = array();

$likes = array();
$comments = array();

$user_news_ids = Q("SELECT `id` FROM `#_mdd_news` WHERE `author_id` = ?s ORDER BY `id` DESC LIMIT 25", array($userid))->all();
if (count($user_news_ids) > 0) {
  foreach ($user_news_ids as $id) {
    $comment = Q("SELECT C.id, C.created_at, C.author_id, C.text, C.news_id, N.title, U.avatar, U.name, U.surname FROM db_mdd_comments C 
      LEFT JOIN db_mdd_news N ON C.news_id = N.id 
      LEFT JOIN db_mdd_users U ON C.author_id = U.id
      WHERE C.news_id = ?s  AND C.author_id != ?s ORDER BY id DESC LIMIT 25", array($id['id'], $userid))->all();
    $like = Q("SELECT L.id, L.created_at, L.user, L.news_id, N.title, U.avatar, U.name, U.surname FROM db_mdd_likes L
      LEFT JOIN db_mdd_news N ON L.news_id = N.id
      LEFT JOIN db_mdd_users U ON L.user = U.id 
      WHERE L.news_id = ?s AND L.user != ?s ORDER BY id DESC LIMIT 25", array($id['id'], $userid))->all();
    
    if (!empty($comment)) {
      foreach($comment as $item) {
        array_push($comments, $item);
      }
    } 
    if (!empty($like)) {
      foreach($like as $item) {
        array_push($likes, $item);   
      }
    }
  }
}

$results = Q("SELECT R.id, R.created_at, R.questions, R.user_id, R.estimated_time, R.result, U.avatar FROM db_mdd_tests R 
  LEFT JOIN db_mdd_users U ON R.user_id = U.id
  WHERE user_id = ?s AND completed = ?s ORDER BY `id` DESC LIMIT 25", array($userid, 1))->all();

$tasks = Q("SELECT T.`id`, T.`created_at`, `from`, `until_date`, U.name, U.surname, U.avatar, `until_time`, `text`, `importance` FROM `#_mdd_tasks` T LEFT JOIN db_mdd_users U ON T.`from` = U.id WHERE `for` = ?s ORDER BY T.`id` DESC LIMIT 20", array('for'.$userid))->all();

$news = Q("SELECT N.id, N.created_at, N.author_id, N.title, N.text, N.importance, U.name, U.surname, U.avatar FROM db_mdd_news N
  LEFT JOIN db_mdd_users U ON N.author_id = U.id WHERE N.author_id != ?s ORDER BY `id` DESC LIMIT 25", array($userid))->all();

$events = Q("SELECT C.id, C.created_at, C.creator, signed, U.name, U.surname, U.avatar, startDate, endDate, max, title FROM db_mdd_calendar C LEFT JOIN db_mdd_users U ON C.creator = U.id WHERE C.creator != ?s ORDER BY `id` DESC LIMIT 25", array($userid))->all();

$feed['results'] = $results;
$feed['tasks'] = $tasks;
$feed['news'] = $news;
$feed['events'] = $events;
$feed['likes'] = $likes;
$feed['comments'] = $comments;

$data = array();

$fakeid = 1;

foreach ($feed as $key => $value) {
  foreach ($feed[$key] as $item) {
    $item['type'] = $key;
    $item['fake_id'] = $fakeid;
    $fakeid++;
    array_push($data, $item);
  }
}

usort($data, function ($item1, $item2) {
  return $item2['created_at'] <=> $item1['created_at'];
});

if (count($data) > 0) {
  echo json_encode($data);
} else {
  echo json_encode(array());
}
