<?php

if(!function_exists('getResourceTVs')){
    function getResourceTVs($rid, $modx, $langKey = '')
    {
        $polylangTvs = array();
        $defaultTvs = array();
        $table_prefix = $modx->getOption('table_prefix');
        $sql1 = "SELECT {$table_prefix}site_tmplvars.name, {$table_prefix}polylang_tv.value FROM {$table_prefix}site_tmplvars 
                LEFT JOIN {$table_prefix}polylang_tv 
                ON {$table_prefix}site_tmplvars.id = {$table_prefix}polylang_tv.tmplvarid
                WHERE {$table_prefix}polylang_tv.content_id = {$rid} AND {$table_prefix}polylang_tv.culture_key = '{$langKey}'";

        $sql2 = "SELECT {$table_prefix}site_tmplvars.name, {$table_prefix}site_tmplvar_contentvalues.value FROM {$table_prefix}site_tmplvars 
                LEFT JOIN {$table_prefix}site_tmplvar_contentvalues 
                ON {$table_prefix}site_tmplvars.id = {$table_prefix}site_tmplvar_contentvalues.tmplvarid
                WHERE {$table_prefix}site_tmplvar_contentvalues.contentid = {$rid}";


        if ($statement = $modx->query($sql1)) {
            $tvs = $statement->fetchAll(PDO::FETCH_ASSOC);
            foreach ($tvs as $tv) {
                $polylangTvs[$tv['name']] = $tv['value'];
            }
        }

        if ($statement = $modx->query($sql2)) {
            $tvs = $statement->fetchAll(PDO::FETCH_ASSOC);
            foreach ($tvs as $tv) {
                $defaultTvs[$tv['name']] = $tv['value'];
            }
        }
        return array_merge($defaultTvs,$polylangTvs);
    }
}


$id = (int)$_POST['id'];
if($product = $modx->getObject('msProduct', $id)){
    $pdo = $modx->getService('pdoTools');
    $polylang = $modx->getService('polylang', 'Polylang');
    $langKey = $modx->getPlaceholder('+lang');
    $resource_data = $product->toArray();
    if ($polylangContent = $modx->getObject('PolylangContent', ['content_id' => $id, 'culture_key' => $langKey])) {
        $polylangData = $polylangContent->toArray();
        unset($polylangData['id']);
        $resource_data = array_merge($resource_data, $polylangData);
    }
    $resource_data['tvs'] = getResourceTVs($id, $modx, $langKey);

    if($files = $modx->getCollection('msProductFile', ['product_id' => $resource_data['id'], 'parent:!=' => 0])){
        foreach($files as $file){
            $fileData = $file->toArray();
            $type = str_replace('image/', '', $fileData['properties']['mime']);
            $width = $fileData['properties']['width'];
            $height = $fileData['properties']['height'];
            $resource_data['gallery']["{$width}x{$height}"][$type][] = $file->toArray();
        }
    }

    if($_POST['chunk']){
        $html = $pdo->parseChunk($_POST['chunk'], ['resource' => $resource_data]);
        return $AjaxFormitLogin->success('', ['html' => $html, 'target' => $_POST['target']]);
    }
    return $AjaxFormitLogin->success('Check the transmitted data', $_POST);
}