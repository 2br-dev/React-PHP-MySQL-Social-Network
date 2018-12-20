<?php
// https://twig.symfony.com/doc/2.x/advanced.html
// src/AppBundle/Twig/AppExtension.php
namespace AppBundle\Twig;

class AppExtension extends \Twig_Extension
{
    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('price', array($this, 'priceFilter')),
        );
    }

    public function priceFilter($number, $decimals = 0, $decPoint = '.', $thousandsSep = ',')
    {
        $price = number_format($number, $decimals, $decPoint, $thousandsSep);
        $price = '$'.$price;

        return $price;
    }
}



class Project_Twig_Extension extends Twig_Extension
{
    public function getFunctions()
    {
        return array(
            new Twig_Function('lipsum', 'generate_lipsum'),
        );
    }

    // ...
}


class Project_Twig_Extension extends Twig_Extension
{
    public function getFilters()
    {
        return array(
            new Twig_Filter('rot13', 'str_rot13'),
        );
    }

    // ...
}


class Project_Twig_Extension extends Twig_Extension
{
    public function getTokenParsers()
    {
        return array(new Project_Set_TokenParser());
    }

    // ...
}


class Project_Twig_Extension extends Twig_Extension
{
    public function getOperators()
    {
        return array(
            array(
                '!' => array('precedence' => 50, 'class' => 'Twig_Node_Expression_Unary_Not'),
            ),
            array(
                '||' => array('precedence' => 10, 'class' => 'Twig_Node_Expression_Binary_Or', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
                '&&' => array('precedence' => 15, 'class' => 'Twig_Node_Expression_Binary_And', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
            ),
        );
    }

    // ...
}


class Project_Twig_Extension extends Twig_Extension
{
    public function getTests()
    {
        return array(
            new Twig_Test('even', 'twig_test_even'),
        );
    }

    // ...
}


class Project_Twig_Extension extends Twig_Extension
{
    private $rot13Provider;

    public function __construct($rot13Provider)
    {
        $this->rot13Provider = $rot13Provider;
    }

    public function getFunctions()
    {
        return array(
            new Twig_Function('rot13', array($this, 'rot13')),
        );
    }

    public function rot13($value)
    {
        return $rot13Provider->rot13($value);
    }
}


class RuntimeLoader implements Twig_RuntimeLoaderInterface
{
    public function load($class)
    {
        // implement the logic to create an instance of $class
        // and inject its dependencies
        // most of the time, it means using your dependency injection container
        if ('Project_Twig_RuntimeExtension' === $class) {
            return new $class(new Rot13Provider());
        } else {
            // ...
        }
    }
}

$twig->addRuntimeLoader(new RuntimeLoader());


class Project_Twig_RuntimeExtension
{
    private $rot13Provider;

    public function __construct($rot13Provider)
    {
        $this->rot13Provider = $rot13Provider;
    }

    public function rot13($value)
    {
        return $rot13Provider->rot13($value);
    }
}

class Project_Twig_Extension extends Twig_Extension
{
    public function getFunctions()
    {
        return array(
            new Twig_Function('rot13', array('Project_Twig_RuntimeExtension', 'rot13')),
            // or
            new Twig_Function('rot13', 'Project_Twig_RuntimeExtension::rot13'),
        );
    }
}


class MyCoreExtension extends Twig_Extension
{
    public function getFilters()
    {
        return array(
            new Twig_Filter('date', array($this, 'dateFilter')),
        );
    }

    public function dateFilter($timestamp, $format = 'F j, Y H:i')
    {
        // do something different from the built-in date filter
    }
}

$twig = new Twig_Environment($loader);
$twig->addExtension(new MyCoreExtension());

