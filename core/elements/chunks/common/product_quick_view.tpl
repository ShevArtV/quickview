{'!msFavorites.initialize' | snippet:[]}
{set $countReviews = '!ecMessagesCount' | snippet: ['thread' => 'resource-'~$resource.id]}
<div class="row">
    <div class="col-12 col-md-6 col-lg-7">
        <div class="product-gallery">
            <div class="gallery-with-thumbs" data-nav-center="false">
                <div class="product-image-container">
                    <div class="product-full-image main-slider image-popup">

                        <!-- Slides -->
                        <div class="swiper-wrapper">
                            {foreach $resource.gallery['600x600']['jpeg'] as $image index=$i}
                                <figure class="swiper-slide">
                                    <img src="{$image['url']}" alt="{$resource.pagetitle}">
                                    <figcaption class="visually-hidden">
                                        <span>{$resource.pagetitle}</span>
                                    </figcaption>
                                </figure>
                            {/foreach}                           
                        </div>
                    </div> <!-- end of product-full-image -->
                </div>

                <div class="product-thumb-container">
                    <div class="product-thumb-image pos-r">
                        <div class="nav-slider">
                            <!-- Slides -->
                            <div class="swiper-wrapper">
                                {foreach $resource.gallery['150x150']['jpeg'] as $image index=$i}
                                    <div class="swiper-slide">
                                        <img src="{$image['url']}" alt="{$resource.pagetitle}">
                                    </div>
                                {/foreach}
                            </div>

                            <!-- Navigation -->
                            <div class="swiper-arrow next"><i class="fa fa-angle-down"></i></div>
                            <div class="swiper-arrow prev"><i class="fa fa-angle-up"></i></div>
                        </div>
                    </div> <!-- end of product-thumb-image -->
                </div>
            </div> <!-- end of gallery-with-thumbs -->
        </div> <!-- end of product-gallery -->
    </div>
    <div class="col-12 col-md-6 col-lg-5">
        <div class="product-details">
            <h3 class="product-name">{$resource.longtitle?:$resource.pagetitle}</h3>
            <div class="product-ratings d-flex">
                <div class="rating d-flex">
                    {'!ecThreadRating' | snippet: ['thread' => 'resource-'~$resource.id]}
                </div>
                <ul class="comments-advices list-inline d-flex">
                    <li class="list-inline-item me-3"><a href="#tabs">{$countReviews | decl: ('ec_fe_detailed_ratings' | lexicon) : true}</a></li>                    
                </ul>
            </div>
            <div class="product-price">
                <p class="d-flex align-items-center">
                    {set $price = '!msMultiCurrencyPrice' | snippet : ['price' => $resource.price]}
                    {set $old_price = '!msMultiCurrencyPrice' | snippet : ['price' => $resource.old_price]}
                    {if $old_price}
                    <span class="price-old">{$old_price} {$_modx->getPlaceholder('msmc.symbol_right')}</span>
                    {/if}
                    <span class="price-new">{$price} {$_modx->getPlaceholder('msmc.symbol_right')}</span>
                    {* TODO Render discounts *}
                    {if $discounts}
                        <span class="price-discount">-20%</span>
                    {/if}
                </p>
            </div>
            {if $resource.introtext}
                <div class="product-description">
                    <p>{$resource.introtext}</p>
                </div>
            {/if}
            {set $colorProps = $resource['color_op.properties'] | fromJSON}
            {foreach $colorProps['values'] as $item}
                {if $item.name === $resource['color_op.value']}
                    {set $color = $item.value}
                {/if}
            {/foreach}
            <form method="post" class="product-actions ms2_form">
                <input type="hidden" name="id" value="{$resource.id}"/>
                <input type="hidden" name="options[color]" value="{$color}"/>
                <div class="product-size-color d-flex">

                    <div class="product-size">
                        <label>{('ms2_product_size') | lexicon}</label>
                        <select name="options[size]" class="nice-select" id="option_size">
                            {foreach $resource.size as $value}
                                <option value="{$value}">{$value}</option>
                            {/foreach}
                        </select>
                    </div>

                    <div class="product-color">
                        <label>{('ms2_option_caption_color_op') | lexicon}</label>
                        <ul class="color-list">
                            <li><a style="background:{$color};" class="active"></a></li>
                        </ul>
                    </div>
                </div>
                <div class="product-stock">
                    <label>{'ms2_frontend_count' | lexicon}</label>
                    <ul class="d-flex flex-wrap align-items-center">
                        <li class="box-quantity">
                            <div class="cart-input">
                                <input class="cart-input-box" type="text" name="count" value="0">
                                <div class="dec qtybutton"><i class="fa fa-angle-down"></i></div>
                                <div class="inc qtybutton"><i class="fa fa-angle-up"></i></div>
                            </div>
                        </li>
                        <li>
                            <button type="submit" class="default-btn" name="ms2_action" value="cart/add">
                                {'ms2_frontend_add_to_cart' | lexicon}
                            </button>
                        </li>
                    </ul>
                </div>
            </form>
            <div class="wishlist-compare d-flex flex-column">
                <a class="msfavorites btn-wishlist mb-3"
                   data-click
                   data-data-list="default"
                   data-data-type="resource"
                   data-data-key="{$resource.id}"
                >
                    <span class="msfavorites-text-add">{('msfavorites_frontend_add' | lexicon)}</span>
                    <span class="msfavorites-text-remove">{('msfavorites_frontend_remove' | lexicon)}</span>
                </a>
                {set $offerType = $resource.offerType[0] | lower}
                {'!AjaxFormitLogin' | snippet:[
                    'snippet' => 'Comparision',
                    'id' => $resource.id,
                    'list' => $offerType,
                    'form' => '@FILE yourfit/chunks/forms/compare_single.tpl',
                    'formName' => 'Форма сравнения в карточке товара',
                ]}
            </div>
        </div> <!-- end of product-details -->
    </div>
</div> <!-- end of row -->