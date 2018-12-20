<?php

final class Captcha
{
    public $keystring = '';

    # CAPTCHA image colors (RGB, 0-255)
    public $foreground_color = [0, 0, 0];
    public $background_color = [255, 255, 255];

    # CAPTCHA string length
    public $length = 5;

    # CAPTCHA image siz
    public $width  = 120;
    public $height = 60;

    # JPEG quality of CAPTCHA image (bigger is better quality, but larger file size)
    public $quality = 90;

    protected $captcha = null;

    protected $alphabet_length;

    protected $alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

    # symbols used to draw CAPTCHA
    protected $allowed_symbols = "abdefhknrstyz23456789";

    # font files
    protected $fonts = [];

    # symbol's vertical fluctuation amplitude
    protected $fluctuation_amplitude = 2;

    # increase safety by prevention of spaces between symbols
    protected $no_spaces = true;

    public function __construct()
    {
        $this->length           = mt_rand(4, 6);
        $this->foreground_color = [mt_rand(0, 80), mt_rand(0, 80), mt_rand(0, 80)];
        $this->background_color = [mt_rand(220, 255), mt_rand(220, 255), mt_rand(220, 255)];

        $this->initFonts();

        $this->generate();

        $this->drawText();

        $this->setKeyString();

        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Cache-Control: no-store, no-cache, must-revalidate');
        header('Cache-Control: post-check=0, pre-check=0', false);
        header('Pragma: no-cache');

        if (function_exists("imagejpeg")) {
            header("Content-Type: image/jpeg");
            imagejpeg($this->captcha, null, $this->quality);
        } elseif (function_exists("imagegif")) {
            header("Content-Type: image/gif");
            imagegif($this->captcha);
        } elseif (function_exists("imagepng")) {
            header("Content-Type: image/x-png");
            imagepng($this->captcha);
        }

        exit;
    }

    public function checkCaptcha($keystring = '')
    {
        if ($keystring) {
            if (isset($this->keystring) && $this->keystring === $keystring) {
                return true;
            }

            $this->clearKeyString();
        }

        return false;
    }

    private function drawText()
    {
        while (true) {
            $font_file = $this->fonts[mt_rand(0, count($this->fonts) - 1)];
            $font      = imagecreatefrompng($font_file);
            imagealphablending($font, true);
            $fontfile_w     = imagesx($font);
            $fontfile_h     = imagesy($font) - 1;
            $font_metrics   = [];
            $symbol         = 0;
            $reading_symbol = false;

            // loading font
            for ($i = 0; $i < $fontfile_w && $symbol < $this->alphabet_length; $i++) {
                $transparent = (imagecolorat($font, $i, 0) >> 24) == 127;

                if (!$reading_symbol && !$transparent) {
                    $font_metrics[$this->alphabet{$symbol}] = array('start' => $i);
                    $reading_symbol                         = true;
                    continue;
                }

                if ($reading_symbol && $transparent) {
                    $font_metrics[$this->alphabet{$symbol}]['end'] = $i;
                    $reading_symbol                                = false;
                    $symbol++;
                    continue;
                }
            }

            $this->captcha = imagecreatetruecolor($this->width, $this->height);
            imagealphablending($this->captcha, true);
            $white = imagecolorallocate($this->captcha, 255, 255, 255);
            // $black=imagecolorallocate($this->captcha, 0, 0, 0);

            imagefilledrectangle($this->captcha, 0, 0, $this->width - 1, $this->height - 1, $white);

            // draw text
            $x = 1;
            for ($i = 0; $i < $this->length; $i++) {
                $m = $font_metrics[$this->keystring{$i}];

                $y = mt_rand(-$this->fluctuation_amplitude, $this->fluctuation_amplitude) + ($this->height - $fontfile_h) / 2 + 2;

                if ($this->no_spaces) {
                    $shift = 0;
                    if ($i > 0) {
                        $shift = 1000;
                        for ($sy = 7; $sy < $fontfile_h - 20; $sy += 1) {
                            //for($sx=$m['start']-1;$sx<$m['end'];$sx+=1){
                            for ($sx = $m['start'] - 1; $sx < $m['end']; $sx += 1) {
                                $rgb     = imagecolorat($font, $sx, $sy);
                                $opacity = $rgb >> 24;
                                if ($opacity < 127) {
                                    $left = $sx - $m['start'] + $x;
                                    $py   = $sy + $y;
                                    if ($py > $this->height) {
                                        break;
                                    }

                                    for ($px = min($left, $this->width - 1); $px > $left - 12 && $px >= 0; $px -= 1) {
                                        $color = imagecolorat($this->captcha, $px, $py) & 0xff;
                                        if ($color + $opacity < 190) {
                                            if ($shift > $left - $px) {
                                                $shift = $left - $px;
                                            }
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        if ($shift == 1000) {
                            $shift = mt_rand(4, 6);
                        }
                    }
                } else {
                    $shift = 1;
                }
                imagecopy($this->captcha, $font, $x - $shift, $y, $m['start'], 1, $m['end'] - $m['start'], $fontfile_h);
                $x += $m['end'] - $m['start'] - $shift;
            }
            if ($x < $this->width - 10) {
                break;
            }
            // fit in canvas
        }

        $center = $x / 2;

        // periods
        $rand1 = mt_rand(750000, 1200000) / 10000000;
        $rand2 = mt_rand(750000, 1200000) / 10000000;
        $rand3 = mt_rand(750000, 1200000) / 10000000;
        $rand4 = mt_rand(750000, 1200000) / 10000000;
        // phases
        $rand5 = mt_rand(0, 31415926) / 10000000;
        $rand6 = mt_rand(0, 31415926) / 10000000;
        $rand7 = mt_rand(0, 31415926) / 10000000;
        $rand8 = mt_rand(0, 31415926) / 10000000;
        // amplitudes
        $rand9  = mt_rand(330, 420) / 110;
        $rand10 = mt_rand(330, 450) / 110;

        # wave distortion

        for ($x = 0; $x < $this->width; $x++) {
            for ($y = 0; $y < $this->height; $y++) {
                $sx = $x + (sin($x * $rand1 + $rand5) + sin($y * $rand3 + $rand6)) * $rand9 - $this->width / 2 + $center + 1;
                $sy = $y + (sin($x * $rand2 + $rand7) + sin($y * $rand4 + $rand8)) * $rand10;

                if ($sx < 0 || $sy < 0 || $sx >= $this->width - 1 || $sy >= $this->height - 1) {
                    continue;
                } else {
                    $color    = imagecolorat($this->captcha, $sx, $sy) & 0xFF;
                    $color_x  = imagecolorat($this->captcha, $sx + 1, $sy) & 0xFF;
                    $color_y  = imagecolorat($this->captcha, $sx, $sy + 1) & 0xFF;
                    $color_xy = imagecolorat($this->captcha, $sx + 1, $sy + 1) & 0xFF;
                }

                if ($color == 255 && $color_x == 255 && $color_y == 255 && $color_xy == 255) {
                    continue;
                } elseif ($color == 0 && $color_x == 0 && $color_y == 0 && $color_xy == 0) {
                    $newred   = $this->foreground_color[0];
                    $newgreen = $this->foreground_color[1];
                    $newblue  = $this->foreground_color[2];
                } else {
                    $frsx  = $sx - floor($sx);
                    $frsy  = $sy - floor($sy);
                    $frsx1 = 1 - $frsx;
                    $frsy1 = 1 - $frsy;

                    $newcolor = (
                        $color * $frsx1 * $frsy1 +
                        $color_x * $frsx * $frsy1 +
                        $color_y * $frsx1 * $frsy +
                        $color_xy * $frsx * $frsy);

                    if ($newcolor > 255) {
                        $newcolor = 255;
                    }

                    $newcolor  = $newcolor / 255;
                    $newcolor0 = 1 - $newcolor;

                    $newred   = $newcolor0 * $this->foreground_color[0] + $newcolor * $this->background_color[0];
                    $newgreen = $newcolor0 * $this->foreground_color[1] + $newcolor * $this->background_color[1];
                    $newblue  = $newcolor0 * $this->foreground_color[2] + $newcolor * $this->background_color[2];
                }
            }
        }
    }

    private function initFonts()
    {
        $this->alphabet_length   = strlen($this->alphabet);
        $this->fontsdir_absolute = PATH_RESOURCE . DS . 'captcha';

        if ($handle = opendir($this->fontsdir_absolute)) {
            while (false !== ($file = readdir($handle))) {
                if (preg_match('/\.png$/i', $file)) {
                    $this->fonts[] = $this->fontsdir_absolute . DS . $file;
                }
            }
            closedir($handle);
        }
    }

    private function generate()
    {
        $symbols = strlen($this->allowed_symbols) - 1;

        while (true) {
            $this->keystring = '';

            for ($i = 0; $i < $this->length; $i++) {
                $this->keystring .= $this->allowed_symbols{mt_rand(0, $symbols)};
            }

            if (!preg_match('/cp|cb|ck|c6|c9|rn|rm|mm|co|do|cl|db|qp|qb|dp|ww/', $this->keystring)) {
                break;
            }
        }
    }

    private function clearKeyString()
    {
        unset($_SESSION[CAPTCHA_KEYSTRING]);
    }

    private function setKeyString()
    {
        $_SESSION[CAPTCHA_KEYSTRING] = $this->getKeyString();
    }

    public function getKeyString()
    {
        return $this->keystring;
    }
}
