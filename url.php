<?php

// http://uri.thephpleague.com/5.0/

use League\Uri;
use League\Uri\Schemes\Http;
use League\Uri\Components\HierarchicalPath;
use League\Uri\Components\Host;


use League\Uri\Modifiers\AppendSegment;
use League\Uri\Modifiers\Extension;
use League\Uri\Modifiers\Pipeline;
use League\Uri\Modifiers\ReplaceLabel;

use GuzzleHttp\Psr7\Uri as GuzzleUri;

use Zend\Diactoros\Uri as DiactorosUri;

var_export(Uri\parse('http://foo.com?@bar.com/'));
//returns the following array
//array(
//  'scheme' => 'http',
//  'user' => null,
//  'pass' => null,
//  'host' => 'foo.com',
//  'port' => null,
//  'path' => '',
//  'query' => '@bar.com/',
//  'fragment' => null,
//);


$uri = Uri\create("hTTp://www.ExAmPLE.com:80/hello/./wor ld?who=f 3#title");
echo $uri; //displays http://www.example.com/hello/./wor%20ld?who=f%203#title

$uri = Uri\Http::createFromComponent(parse_url("hTTp://www.bébé.be?#"));
echo $uri; //displays http://xn--bb-bjab.be?#


$uri = new DiactorosUri("http://www.example.com?fo.o=toto#~typo");
$new_uri = Uri\merge_query($uri, 'fo.o=bar&taz=');
echo $new_uri;
// display http://www.example.com?fo.o=bar&taz=#~typo
// $new_uri is a Zend\Diactoros\Uri instance

$host = new Host('www.example.co.uk');
echo $host->getPublicSuffix();        //display 'co.uk'
echo $host->getRegisterableDomain();  //display 'example.co.uk'
echo $host->getSubdomain();           //display 'www'
$host->isPublicSuffixValid();         //return a boolean 'true' in this example



$uri = Http::createFromString("http://uri.thephpleague.com/.././report/");
echo $uri->getPath(), PHP_EOL; //display "/.././report/"
$normalizedPath = (new HierarchicalPath($uri->getPath()))
    ->withoutLeadingSlash()
    ->withoutTrailingSlash()
    ->withoutDotSegments();
echo $normalizedPath, PHP_EOL; //display "report"

$host = new Host($uri->getHost());
var_dump($host->getLabels());
// display
// array(
//     0 => 'com',
//     1 => 'thephpleague',
//     2 => 'uri',
//);

echo $host, PHP_EOL; //display "uri.thephpleague.com"
echo $host->getLabel(2), PHP_EOL; //display "uri"
echo $host->getPublicSuffix(), PHP_EOL; //return com
echo $host->getRegisterableDomain(), PHP_EOL; //display 'thephpleague.com'
echo $host->getSubDomain(), PHP_EOL; //display 'uri'



//let's create the original URI
//The URI Middlewares works with any PSR-7 implementation
$uri = new GuzzleUri("http://www.example.com/report");

//using the Pipeline URI modifier class
//we register and apply the common transformations
$modifiers = (new Pipeline())
    ->pipe(new AppendSegment('/purchases/summary'))
    ->pipe(new ReplaceLabel(-1, 'download'));
$tmpUri = $modifiers->process($uri->withScheme('https'));

//the specific transformation are applied here
$links = [];
foreach (['csv', 'json', 'xml'] as $extension) {
    $links[$extension] = (new Extension($extension))->process($tmpUri);
}

// $links is an array of League\Uri\Schemes\Http objects
echo $uri, PHP_EOL;           // display "http://www.example.com/report"
echo $links['csv'], PHP_EOL;  // display "https://download.example.com/report/purchases/summary.csv"
echo $links['xml'], PHP_EOL;  // display "https://download.example.com/report/purchases/summary.xml"
echo $links['json'], PHP_EOL; // display "https://download.example.com/report/purchases/summary.json"
echo get_class($links['json']), PHP_EOL; // display "GuzzleHttp\Psr7\Uri"