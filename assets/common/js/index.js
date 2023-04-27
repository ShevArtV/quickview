import * as savFunctions from "./modules/functions.js";
import AjaxFormitLogin from "../../components/ajaxformitlogin/js/modules/ajaxformitlogin.class.js";

document.addEventListener('DOMContentLoaded', (e) => {

    const projectScripts = {}

    function documentReady() {

    }

    documentReady();

    document.addEventListener('afl_complete', (e) => {
        console.log(e.detail.response);
        const form = e.detail.form;
        if (e.detail.response.success) {
            if (form.classList.contains('js-quickview-form')) {
                if (e.detail.response.data.target && e.detail.response.data.html) {
                    const quickviewModalEl = document.querySelector(e.detail.response.data.target);
                    const quickviewModal = new bootstrap.Modal(quickviewModalEl);
                    quickviewModalEl.querySelector('.modal-body').innerHTML = e.detail.response.data.html;
                    const aflConfigs = quickviewModalEl.querySelectorAll('input[name="afl_config"]');
                    if (aflConfigs.length) {
                        aflConfigs.forEach(el => {
                            let config = JSON.parse(el.value);
                            window.aflForms[config.formSelector] = new AjaxFormitLogin('.' + config.formSelector, config);
                        });
                    }

                    /*
                     инициализировать прочие плагины типа кастомного select или swiper
                     */

                    quickviewModal.show();
                } else {
                    console.log(e.detail.response);
                }
            }
        }
    });

});

