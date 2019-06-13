<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object file
include_once '../config/database.php';
include_once '../shared/utilities.php'; 
require_once '../../vendor/autoload.php';

// get database connection
$database = new Database();
$db = $database->getConnection();
$utilities = new Utilities();

//$id = __post('id');
$filename = $_FILES['file']['name'];
$size = $_FILES['file']['size'];

if (!file_exists("../../frontend/public/upload/news/")) {
   mkdir("../../frontend/public/upload/news/", 0777, true);
}
/* Location */
$location = "../../frontend/public/upload/news/" . $filename;

$uploadOk = 1;
$imageFileType = pathinfo($location, PATHINFO_EXTENSION);

/* Valid Extensions */
$valid_extensions = array("jpg", "jpeg", "png");
/* Check file extension */
if (!in_array(strtolower($imageFileType), $valid_extensions)) {
   $uploadOk = 0;
}

if ($uploadOk == 0) {
   echo 'error';
} else {

      //The name of the folder.
   $folder = "../../frontend/public/upload/news/";
 
      //Get a list of all of the file names in the folder.
   $files = glob($folder . '/*');
 
      //Loop through the file list.
   /* foreach ($files as $file) {
      //Make sure that this is a file and not a directory.
      if (is_file($file)) {
        //Use the unlink function to delete the file.
         unlink($file);
      }
   } */

   $file = $_FILES['file']['tmp_name'];
   $sourceProperties = getimagesize($file);
   $fileNewName = time();
   $folderPath = "../../frontend/public/upload/news/";
   $ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
   $imageType = $sourceProperties[2];


   switch ($imageType) {


      case IMAGETYPE_PNG:
         $imageResourceId = imagecreatefrompng($file);
         $targetLayer = $utilities->imageResize($imageResourceId, $sourceProperties[0], $sourceProperties[1]);
         imagepng($targetLayer, $folderPath . $fileNewName . "." . $ext);
         break;


      case IMAGETYPE_GIF:
         $imageResourceId = imagecreatefromgif($file);
         $targetLayer = $utilities->imageResize($imageResourceId, $sourceProperties[0], $sourceProperties[1]);
         imagegif($targetLayer, $folderPath . $fileNewName . "." . $ext);
         break;


      case IMAGETYPE_JPEG:
         $imageResourceId = imagecreatefromjpeg($file);
         $targetLayer = $utilities->imageResize($imageResourceId, $sourceProperties[0], $sourceProperties[1]);
         imagejpeg($targetLayer, $folderPath . $fileNewName . "." . $ext);
         break;


      default:
         echo "Invalid Image type.";
         exit;
         break;
   }


   move_uploaded_file($file, $folderPath . $fileNewName . "." . $ext);

   echo json_encode(array('location' => $folderPath . $fileNewName . "." . $ext));

}


