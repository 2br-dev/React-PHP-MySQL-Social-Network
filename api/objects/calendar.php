<?php
class Calendar
{

    // database connection and table name
    private $conn;
    private $table_name = "db_mdd_calendar";

    // object properties
    public $id;
    public $max;
    public $title;
    public $startDate;
    public $endDate;
    public $creator;
    public $signed;
    public $interval;

    // constructor with $db as database connection
    public function __construct($db)
    {
        $this->conn = $db;
    }

    function read()
    {
        $data = Q("SELECT 
                    creator, 
                    signed, 
                    C.id, 
                    U.name, 
                    U.surname, 
                    U.position,
                    startDate, 
                    endDate,
                    max,
                    title
                  FROM db_mdd_calendar C 
                  LEFT JOIN db_mdd_users U
                  ON C.creator = U.id")->all();
        return $data;
    }

    function addEvent()
    {
        if (!empty($this->interval)) {
            $intervalHour = 0;
            $intervalMinutes = $this->interval;

            if ($this->interval >= 60) {
                $intervalHour = 1;
                $intervalMinutes = $this->interval - 60;
            }
            if ($this->interval == 120) {
                $intervalMinutes = 0;
                $intervalHour = 2;
            }

            $startTime = substr($this->startDate, 11, 5);
            $startTime = explode(':', $startTime);
            $hours = intval($startTime[0]);
            $minutes = intval($startTime[1]);

            $endTime = substr($this->endDate, 11, 5);
            $endTime = explode(':', $endTime);
            $endHours = intval($endTime[0]);
            $endMinutes = intval($endTime[1]);

            while ($this->isValidTime($hours, $minutes, $endHours, $endMinutes, $intervalMinutes)) {
                // formatting
                $hours = intval($hours);
                $minutes = intval($minutes);
                if ($minutes < 10) $minutes = '0' . $minutes;
                if ($hours < 10) $hours = '0' . $hours;
                //end

                $this->startDate = substr($this->startDate, 0, -5);
                $this->endDate = substr($this->endDate, 0, -5);
                $this->startDate = $this->startDate . $hours . ':' . $minutes;

                // formatting
                $hours = intval($hours);
                $minutes = intval($minutes);

                $minutes += $intervalMinutes;
                if ($minutes >= 60) {
                    $minutes -= 60;
                    $hours += 1;
                }
                if ($minutes < 10) $minutes = '0' . $minutes;
                $hours += $intervalHour;
                if ($hours < 10) $hours = '0' . $hours;
                //end

                // prevents to overtime
                if ($hours >= 18 && $minutes > 0) return;
                //

                $this->endDate = $this->endDate . $hours . ':' . $minutes;

                // query to insert record
                $query = "INSERT INTO " . $this->table_name . "
                SET 
                `creator`=:creator, 
                `startDate`=:startDate, 
                `endDate`=:endDate, 
                `max`=:max, 
                `title`=:title";

                // prepare query
                $stmt = $this->conn->prepare($query);

                // sanitize
                $this->creator = htmlspecialchars(strip_tags($this->creator));
                $this->startDate = htmlspecialchars(strip_tags($this->startDate));
                $this->endDate = htmlspecialchars(strip_tags($this->endDate));
                $this->max = htmlspecialchars(strip_tags($this->max));
                $this->title = htmlspecialchars(strip_tags($this->title));

                // bind values
                $stmt->bindParam(":creator", $this->creator);
                $stmt->bindParam(":startDate", $this->startDate);
                $stmt->bindParam(":endDate", $this->endDate);
                $stmt->bindParam(":max", $this->max);
                $stmt->bindParam(":title", $this->title);

                // execute query
                $stmt->execute();
            }

            return true;
        } else {
            // query to insert record
            $query = "INSERT INTO " . $this->table_name . "
            SET 
            `creator`=:creator, 
            `startDate`=:startDate, 
            `endDate`=:endDate, 
            `max`=:max, 
            `title`=:title";

            // prepare query
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->creator = htmlspecialchars(strip_tags($this->creator));
            $this->startDate = htmlspecialchars(strip_tags($this->startDate));
            $this->endDate = htmlspecialchars(strip_tags($this->endDate));
            $this->max = htmlspecialchars(strip_tags($this->max));
            $this->title = htmlspecialchars(strip_tags($this->title));

            // bind values
            $stmt->bindParam(":creator", $this->creator);
            $stmt->bindParam(":startDate", $this->startDate);
            $stmt->bindParam(":endDate", $this->endDate);
            $stmt->bindParam(":max", $this->max);
            $stmt->bindParam(":title", $this->title);

            // execute query
            if ($stmt->execute()) {
                $this->id = Q("SELECT `id` FROM `#_mdd_calendar` ORDER BY `id` DESC LIMIT 1")->row('id');
                return true;
            }
            return false;
        }
    }

    // sh - start hours
    // sm - start minutes
    // eh - end hours
    // em - end minutes
    function isValidTime($sh, $sm, $eh, $em, $interval)
    {
        if ($sh > $eh) return false;
        if ($sh == $eh) {
            if ($sm > $em) {
                return false;
            } elseif ($em - $sm <= $interval) {
                return false;
            } else {
                return true;
            }
        }
        return true;
    }

    function delete()
    {
        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));

        // bind id of record to delete
        $stmt->bindParam(1, $this->id);

        // execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function signUp($name)
    {
        $signed = Q("SELECT `signed` FROM `#_mdd_calendar` WHERE `id` = ?s", array($this->id))->row('signed');

        if ($signed == '' || $signed == null) {
            $signed = $name;
        } else {
            $signed = $signed. ', ' . $name;
        }

        $query = "UPDATE " . $this->table_name . "
                SET
                    signed = :signed
                WHERE
                    id = :id";

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':signed', $signed);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    function unSignUp($name)
    {
        $signed = Q("SELECT `signed` FROM `#_mdd_calendar` WHERE `id` = ?s", array($this->id))->row('signed');

        if (count(explode(',', $signed)) > 1) {
            if (explode(',', $signed)[0] == $name) {
                $name = $name . ',';
            } else {
                $name = ', ' . $name;
            }       
        } 
 
        echo $name;
        $signed = str_replace($name, '', $signed);
        $query = "UPDATE " . $this->table_name . "
                SET
                    signed = :signed
                WHERE
                    id = :id";

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':signed', $signed);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
