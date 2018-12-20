<?php

declare(strict_types=1);

namespace Fastest\Core\Api;

final class Policies extends \Fastest\Core\Api\Api
{
    public function __construct()
    {
        parent::__construct();
    }

    /*
     * report-uri-expect-ct.php
     *
     * From <https://shaunc.com/go/Xdf4cU8EurV1>
     *
     * This script accepts incoming Expect-CT browser reports and emails their
     * contents to the site administrator. For more about the Expect-CT header, see:
     *
     * <https://tools.ietf.org/html/draft-ietf-httpbis-expect-ct-02>
     * <https://scotthelme.co.uk/a-new-security-header-expect-ct/>
     *
     * Point to this script in the "report-uri" parameter of your Expect-CT header.
     *
     * Some browsers send an OPTIONS request first, prior to POSTing the report,
     * to ensure the server is willing to accept a POST in the first place. This
     * is known as a "pre-flight," as defined here:
     *
     * <https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Preflighted_requests>
     *
     * The appropriate response will be sent depending upon the HTTP verb.
     */
    public function expect_ct()
    {
        //Test for a CORS preflight
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

            //Confirm we accept POST in addition to OPTIONS
            header('Access-Control-Allow-Methods: OPTIONS, POST');

            //Numerous domains point here, so indicate that any origin is acceptable
            header('Access-Control-Allow-Origin: *');

            //Explicitly allow whatever custom headers, if any, the requestor hinted
            foreach (getallheaders() as $key=>$val) {
                if (strcasecmp($key, 'Access-Control-Request-Headers') == 0) {
                    header('Access-Control-Allow-Headers:' . htmlentities($val, ENT_QUOTES));
                    break;
                }
            }
            exit;
        }
        elseif ($_SERVER['REQUEST_METHOD'] == 'POST' && strlen($json = @file_get_contents('php://input')) > 0) {

            //Turn the JSON report into a slightly more readable array
            $report = var_export(json_decode($json, true), true);

            //Grab the headers, too
            $headers = var_export(getallheaders(), true);

            //Build a message
            $body =
<<<EOT
        An Expect-CT report was posted by {$_SERVER['REMOTE_ADDR']}.

        Headers follow:

        $headers

        Report follows:

        $report
EOT;

            //Send the email
            @mail(ADMIN_EMAIL, '[' . $_SERVER['SERVER_NAME'] . '] Expect-CT Report', $body, 'From: ' . ADMIN_EMAIL);
            exit;
        }

        exit;
    }

    public function report()
    {
        http_response_code(204);

        $report = file_get_contents('php://input');
        $report = json_decode($report, true);

        if (empty($report))
        {
            exit;
        }

        $report = $report['csp-report'];

        $delimiter = '|';
        $csvLine = '';
        $csvLine .= !empty($report['document-uri']) ? $report['document-uri'] : $delimiter;
        $csvLine .= !empty($report['referrer']) ? $delimiter . $report['referrer'] : $delimiter;
        $csvLine .= !empty($report['violated-directive']) ? $delimiter . $report['violated-directive'] : $delimiter;
        $csvLine .= !empty($report['original-policy']) ? $delimiter . $report['original-policy'] : $delimiter;
        $csvLine .= !empty($report['blocked-uri']) ? $delimiter . $report['blocked-uri'] : $delimiter;
        $csvLine .= !empty($report['status-code']) ? $delimiter . $report['status-code'] : $delimiter;
        $csvLine .= "\r\n";

        file_put_contents(PATH_ROOT.DS.'report.csv', $csvLine, FILE_APPEND);


        // $data = json_decode($HTTP_RAW_POST_DATA,true);
        // $to = 'myemail@example.com';
        // $subject = 'CSP Violations';
        // $message="Following violations occured:<br/><br/>";
        // if($document_uri!="")
        //     $message.="<b>Document URI:</b> ".$data['csp-report']['document-uri']."<br/><br/>";
        // if($referrer!="")
        //     $message.="<b>Referrer:</b> ".$data['csp-report']['referrer']."<br/><br/>";
        // if($blocked_uri!="")
        //     $message.="<b>Blocked URI:</b> ".$data['csp-report']['blocked_uri']."<br/><br/>";
        // if($violated_directive!="")
        //     $message.="<b>Violated Directive:</b> ".$data['csp-report']['violated_directive']."<br/><br/>";
        // if($original_policy!="")
        //     $message.="<b>Original Policy:</b> ".$data['csp-report']['original_policy']."<br/><br/>";
        // // To send HTML mail, the Content-type header must be set
        // $headers  = 'MIME-Version: 1.0' . "\r\n";
        // $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
        // $headers .= 'From: Example Website <noreply@example.com>' . "\r\n";
        // // Mail it
        // mail($to, $subject, $message, $headers);
    }

    public function p3p()
    {
        header("Content-type: text/xml");

        echo
        '<META xmlns="http://www.w3.org/2002/01/P3Pv1">',
            '<POLICY-REFERENCES>',
                '<EXPIRY max-age="172800"/>',
                '<POLICY-REF about="/api/policies/p3p#first">',
                    '<INCLUDE>/*</INCLUDE>',
                    '<EXCLUDE>/catalog/*</EXCLUDE>',
                    '<EXCLUDE>/cgi-bin/*</EXCLUDE>',
                    '<EXCLUDE>/servlet/*</EXCLUDE>',
                '</POLICY-REF>',
                '<POLICY-REF about="/api/policies/p3p#second">',
                    '<INCLUDE>/catalog/*</INCLUDE>',
                '</POLICY-REF>',
                '<POLICY-REF about="/api/policies/p3p#third">',
                    '<INCLUDE>/cgi-bin/*</INCLUDE>',
                    '<INCLUDE>/servlet/*</INCLUDE>',
                    '<EXCLUDE>/servlet/unknown</EXCLUDE>',
                '</POLICY-REF>',
            '</POLICY-REFERENCES>',
        '</META>';

        exit;
    }
}
