document.addEventListener('DOMContentLoaded', () => {
    // let stylesheet = getParameterByName('site') || 'Medborgarskolan'
    // let oldHref = document.getElementById('stylesheet').href;
    // let hrefSplit = oldHref.split('/');
    // let oldStyle = hrefSplit[hrefSplit.length-1];
    // let newStyle = oldHref.replace(oldStyle, stylesheet + '.css')
    // document.getElementById('stylesheet').href = newStyle;

    // let sel = document.getElementById('themeselect');
    // let opts = sel.options;
    // for (let opt, j = 0; opt = opts[j]; j++) {
    //     if (opt.value === stylesheet) {
    //         sel.selectedIndex = j;
    //         break;
    //     }
    // }
});

function getParameterByName(name, url) {
    if (!url) {url = window.location.href;}
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) {return null;}
    if (!results[2]) {return '';}
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}