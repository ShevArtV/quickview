//функция отправки ajax
export function sendAjax(url, params, callback, method, type) {
    const request = new XMLHttpRequest();
    url = url || document.location.href;
    method = method || 'POST';
    request.open(method, url, true);
    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    request.responseType = type || 'json';
    request.addEventListener('readystatechange', function () {
        if (request.readyState === 4 && request.status === 200) {
            callback(request.response);
        }
    });
    request.send(params);
}

// функция получения cookie по имени
export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// функция установки cookie
export function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

// загружаем дополнительные скрипты
export function loadScript(path, callback) {
    let done = false,
        scr = document.createElement('script');

    scr.onload = handleLoad;
    scr.onreadystatechange = handleReadyStateChange;
    scr.onerror = handleError;
    scr.src = path;
    document.body.appendChild(scr);

    function handleLoad() {
        if (!done) {
            done = true;
            callback(path, "ok");
        }
    }

    function handleReadyStateChange() {
        let state;

        if (!done) {
            state = scr.readyState;
            if (state === "complete") {
                handleLoad();
            }
        }
    }

    function handleError() {
        if (!done) {
            done = true;
            callback(path, "error");
        }
    }
}

// прокручиваем страницу до указанного блока
export function scrollIntoView(anchor) {
    let blockID = anchor.getAttribute('href').substr(1);
    if (document.getElementById(blockID)) {
        document.getElementById(blockID).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// определение видимости элемента
export function visible(target) {
    let targetPosition = {
            top: window.pageYOffset + target.getBoundingClientRect().top,
            bottom: window.pageYOffset + target.getBoundingClientRect().bottom
        },
        windowPosition = {
            top: window.pageYOffset,
            bottom: window.pageYOffset + document.documentElement.clientHeight
        };
    if (targetPosition.bottom > windowPosition.top && targetPosition.top < windowPosition.bottom) {
        return true;
    } else {
        return false;
    }
}

// ленивая загрузка
export function lazyLoad(lazyLoadAttr) {
    lazyLoadAttr = lazyLoadAttr || 'data-src';
    let media = document.querySelectorAll('[' + lazyLoadAttr + ']');
    media.forEach(function (elem) {
        if (visible(elem)) {
            if (elem.tagName == 'IMG' || elem.tagName == 'IFRAME' || elem.tagName == 'VIDEO' || elem.tagName == 'SOURCE') {
                elem.src = elem.dataset.src;
            } else {
                elem.style.backgroundImage = 'url(' + elem.dataset.src + ')';
            }
            elem.removeAttribute(lazyLoadAttr);
        }
    });
}

// Маска ввода номера телефона
export function phoneMask(event){
    if (!(event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'Backspace' || event.key == 'Tab')) {
        event.preventDefault()
    }
    let mask = '+7(111)111-11-11'; // Задаем маску

    if (/[0-9\+\ \-\(\)]/.test(event.key)) {

        let currentString = this.value;
        let currentLength = currentString.length;

        if (/[0-9]/.test(event.key)) {
            for (let i = currentLength; i < mask.length; i++) {
                let number = event.key;
                if (mask[i] == '1') {
                    if (i == 3 && number != '9') {
                        number = '';
                    }
                    this.value = currentString + number;
                    break;
                }
                currentString += mask[i];
            }
        }
    }
}

// функция разворачивания svg
export function expandSVG(el, response) {
    let svg = new DOMParser().parseFromString(response, "text/html").getElementsByTagName("svg")[0];
    svg.removeAttribute('xmlns');
    if (el.getAttribute('id')) {
        svg.setAttribute('id', el.getAttribute('id'));
    }
    if (el.getAttribute('class')) {
        svg.setAttribute('class', el.getAttribute('class'));
    }
    if (!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
        svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('height') + svg.getAttribute('width'));
    }
    el.replaceWith(svg);
}

// функция получения данных из svg
export function getImgData(selector) {
    const svgImg = document.querySelectorAll(selector);
    if(svgImg.length){
        svgImg.forEach(elem => {
            sendAjax(elem.src, {}, function (response) {
                expandSVG(elem, response);
            }, 'GET', 'text');
        });
    }
}