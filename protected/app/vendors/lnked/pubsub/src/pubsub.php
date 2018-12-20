<?php

class PS
{
    private static $events = []; // all events

    /**
     * Prevent direct object creation
     */
    final private function  __construct() { }

    /**
     * Prevent object cloning
     */
    final private function  __clone() { }

    /**
     * Attach an event handler function for one or more events
     *
     * @param string   $name
     * @param callable $handler
     * 
     */
    public static function on(string $name, callable $handler)
    {
        if (empty(self::$events[$name]))
        {
            self::$events[$name] = [];
        }

        array_push(self::$events[$name], $handler);
    }

    /**
     * Remove an event handler
     *
     * @param string $name
     * 
     */
    public static function off($name)
    {
        if (!empty(self::$events[$name]))
        {
            unset(self::$events[$name]);
        }
    }

    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event
     *
     * @param string $name
     * 
     */
    public static function trigger(string $name)
    {
        if (empty(self::$events[$name]))
        {
            return false;
        }

        $args = func_get_args();

        array_shift($args);

        if (count(self::$events[$name]) === 1)
        {
            if (is_callable(self::$events[$name][0]))
            {
                if (!empty($args))
                {
                    return call_user_func_array(self::$events[$name][0], $args);
                }
                else
                {
                    return call_user_func(self::$events[$name][0], false);
                }
            }
            else
            {
                return false;
            }
        }

        foreach (self::$events[$name] as $event)
        {
            if (is_callable($event))
            {
                call_user_func_array($event, $args);
            }
        }
    }

    /**
     * List of events
     *
     */
    public static function list(string $name = '')
    {
        if ($name && !empty(self::$events[$name]))
        {
            return self::$events[$name];
        }

        return self::$events;
    }

    /**
     * Clears all existing events
     *
     */
    public static function flush()
    {
        if (!empty(self::$events))
        {
            foreach (self::$events as $name => $handler)
            {
                unset(self::$events[$name]);
            }
        }
    }
}
