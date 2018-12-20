<?php

declare(strict_types=1);

namespace Fastest\Core\Api;

/**
 * @SWG\Swagger(
 *   schemes={"https"},
 *   host=API_HOST,
 *   basePath="/api",
 *   info={
 *     "title"="Site API",
 *     "version"="1.0.0"
 *   }
 * )
 */
class Api extends \Fastest\Core\Entity
{
    protected $api = null;

    protected $method = null;

    protected $headers = [];

    protected $request = [];

    protected $errors = [
        'no_method' => 'No method supplied'
    ];

    /**
     * @SWG\Definition(
     *   definition="product_id",
     *   type="integer",
     *   format="int64",
     *   description="The unique identifier of a product in our catalog"
     * )
     */
    public function __construct()
    {
        $this->method = $this->getMethod();

        $this->headers[] = 'Content-Type: application/json';

        $this->request = json_decode(file_get_contents('php://input'), true);

        parent::__construct();
    }

    public function load($path = [])
    {
        $name = ucfirst($path[1]);

        if (!empty($path[2]))
        {
            $method = $path[2];
            $arguments = array_slice($path, 3);

            $className = sprintf('\%s\%s', __NAMESPACE__, $name);

            $instance = new $className();

            $params = $this->request;

            if (!$this->request) {
                $params = $arguments;
            }

            $this->api = call_user_func_array([$instance, $method], $params);
        }

        $this->response($this->errors['no_method']);
    }

    public function is_cli()
    {
        if ( defined('STDIN') )
        {
            return true;
        }

        if ( php_sapi_name() === 'cli' )
        {
            return true;
        }

        if ( array_key_exists('SHELL', $_ENV) ) {
            return true;
        }

        if ( empty($_SERVER['REMOTE_ADDR']) and !isset($_SERVER['HTTP_USER_AGENT']) and count($_SERVER['argv']) > 0) 
        {
            return true;
        } 

        if ( !array_key_exists('REQUEST_METHOD', $_SERVER) )
        {
            return true;
        }

        return false;
    }

    public function getMethod()
    {
        // return $_SERVER['REQUEST_METHOD'];
        return filter_input(INPUT_SERVER, 'REQUEST_METHOD', FILTER_SANITIZE_ENCODED);

        // switch ($method) {
        // case 'PUT':
        // do_something_with_put($request);
        // break;
        // case 'POST':
        // do_something_with_post($request);
        // break;
        // case 'GET':
        // do_something_with_get($request);
        // break;
        // case 'HEAD':
        // do_something_with_head($request);
        // break;
        // case 'DELETE':
        // do_something_with_delete($request);
        // break;
        // case 'OPTIONS':
        // do_something_with_options($request);
        // break;
        // default:
        // handle_error($request);
        // break;
        // }
    }

    public function response($response = [], $response_code = 200)
    {
        http_response_code($response_code);

        // header(':', true, $statusCode);
        // header('Temporary-Header: True', true, 404);
        // header_remove('Temporary-Header');

        array_walk($this->headers, function($header) {
            header($header);
        });

        exit(json_encode($response, 64 | 256));
    }
}
