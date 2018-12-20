<?php

class Lingua
{
    public static $use_cache = 1;
    private static $Stem_Cache = [];
    
    const VOWEL = '/аеиоуыэюя/u';
    const PERFECTIVEGROUND = '/((ив|ивши|ившись|ыв|ывши|ывшись)|((?<=[ая])(в|вши|вшись)))$/u';
    const REFLEXIVE = '/(с[яь])$/u';
    const ADJECTIVE = '/(ее|ие|ые|ое|ца|ими|ыми|ей|ий|ый|ой|ем|им|ым|ом|его|ого|ему|ому|их|ых|ую|юю|ая|яя|ою|ею)$/u';
    const PARTICIPLE = '/((ивш|ывш|ующ)|((?<=[ая])(ем|нн|вш|ющ|щ)))$/u';
    const VERB = '/((ила|ыла|ена|ейте|уйте|ите|или|ыли|ей|уй|ил|ыл|им|ым|ен|ило|ыло|ено|ят|ует|уют|ит|ыт|ены|ить|ыть|ишь|ую|ю)|((?<=[ая])(ла|на|ете|йте|ли|й|л|ем|н|ло|но|ет|ют|ны|ть|ешь|нно)))$/u';
    const NOUN = '/(а|ев|ов|ие|ье|е|иями|ями|ами|еи|ии|и|ией|ей|ой|ий|й|иям|ям|ием|ем|ам|ом|о|у|ах|иях|ях|ы|ь|ию|ью|ю|ия|ья|я)$/u';
    const RVRE = '/^(.*?[аеиоуыэюя])(.*)$/u';
    const DERIVATIONAL = '/[^аеиоуыэюя][аеиоуыэюя]+[^аеиоуыэюя]+[аеиоуыэюя].*(?<=о)сть?$/u';

    public static function s(&$s, $re, $to)
    {
        $orig = $s;
        $s = preg_replace($re, $to, $s);
        return $orig !== $s;
    }

    public static function stem_word($word)
    {
        $word = mb_strtolower($word);
        $word = str_replace('ё', 'е', $word); //strtr($word, 'ё', 'е');
        # Check against cache of stemmed words
        if (self::$use_cache && isset(self::$Stem_Cache[$word])) {
            return self::$Stem_Cache[$word];
        }
        $stem = $word;
        do {
            if (!preg_match(self::RVRE, $word, $p)) {
                break;
            }
            $start = $p[1];
            $RV = $p[2];
            if (!$RV) {
                break;
            }

            # Step 1
            if (!self::s($RV, self::PERFECTIVEGROUND, '')) {
                self::s($RV, self::REFLEXIVE, '');

                if (self::s($RV, self::ADJECTIVE, '')) {
                    self::s($RV, self::PARTICIPLE, '');
                } else {
                    if (!self::s($RV, self::VERB, '')) {
                        self::s($RV, self::NOUN, '');
                    }
                }
            }

            # Step 2
            self::s($RV, '/и$/u', '');

            # Step 3
            if (preg_match(self::DERIVATIONAL, $RV)) {
                self::s($RV, '/ость?$/u', '');
            }

            # Step 4
            if (!self::s($RV, '/ь$/u', '')) {
                self::s($RV, '/ейше?/u', '');
                self::s($RV, '/нн$/u', 'н');
            }

            $stem = $start . $RV;
        } while (false);
        if (self::$use_cache) {
            self::$Stem_Cache[$word] = $stem;
        }
        return $stem;
    }

    public function clear_stem_cache()
    {
        self::$Stem_Cache = [];
    }
}
