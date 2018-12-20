<?php

class AssetExtension extends \Twig_Extension
{
    public function getFunctions()
    {
        return [
            'assetCSS' => new \Twig_SimpleFunction('assetCSS', [$this, 'assetCSS'], [
                // 'needs_environment' => true,
                'needs_context' => true,
                'is_safe' => array(
                    'assetCSS' => true
                )
            ]),
            'assetJS' => new \Twig_SimpleFunction('assetJS', [$this, 'assetJS'], [
                // 'needs_environment' => true,
                'needs_context' => true,
                'is_safe' => array(
                    'assetJS' => true
                )
            ])
        ];
    }

    // public function assetFiles(\Twig_Environment $environment, $context, $files = '')
    public function assetCSS($context, $files = '', $attributes = [])
    {
        $code = '';

        if (!empty($files))
        {
            $attribute = '';

            if (!empty($attributes))
            {
                $attribute = sprintf(' %s', implode(' ', $attributes));
            }

            foreach ($files as $file)
            {
                $code .= '<link rel="preload" href="'.$file.'" as="style">';
                $code .= '<link rel="stylesheet" href="'.$file.'"'.$attribute.'>';
            }
        }

        echo $code;
    }

    public function assetJS($context, $files = '', $attributes = [])
    {
        $code = '';

        if (!empty($files))
        {
            $attribute = sprintf('nonce="%s" ', $context['_nonceToken']);

            if (!empty($attributes))
            {
                $attribute .= implode(' ', $attributes);
            }

            foreach ($files as $file)
            {
                $code .= '<link rel="preload" href="'.$file.'" as="script">';
                $code .= '<script src="'.$file.'" '.$attribute.'></script>';
            }
        }

        echo $code;

        // $assetDir = isset($this->options['asset.directory']) ?
        //     $this->options['asset.directory'] :
        //     null;
        // if ($assetDir) {
        //     $url = sprintf('%s/%s', $assetDir, ltrim($url, '/'));
        // }
        // $asset   = $this->assetsPath . '/' . $url;
        // $version = $this->version->getVersion($asset);
        // return $this->namer->getName($url, $version);
    }

    public function getName() {
        return 'asset';
    }
}
