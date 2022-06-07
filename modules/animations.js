export function setAnimation(type, elements, delay, endOffset = 0) {
    type = getAnimation(type);
    elements = elements.length ? [...elements] : [elements]
    elements.map((el, i) => setTimeout(() => type(el), i * delay));
    delay = elements.length * delay + endOffset;
    return new Promise(resolve => setTimeout(resolve, delay))
}

function getAnimation(type) {
    if (type === 'bounceOut') { return bounceOut }
    if (type === 'bounceIn') { return bounceIn }

    function bounceOut(el) {
        el.classList.toggle('bounce-out');
    }
    function bounceIn(el) {
        el.classList.toggle('bounce-in');
    }
}