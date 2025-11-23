const showWindowBtn = document.getElementById('showWindowBtn');
const showCardWindowBtn = document.getElementById('showCardWindowBtn');
const floatingWindow = document.getElementById('floatingWindow');
const floatingCardWindow = document.getElementById('floatingCardWindow');
const closeWindowBtn = document.getElementById('closeWindowBtn');
const closeCardWindowBtn = document.getElementById('closeCardWindowBtn');
const overlay = document.getElementById('overlay');

showWindowBtn.addEventListener('click', () => {
    floatingWindow.style.display = 'block';
    overlay.style.display = 'block';
});

showCardWindowBtn.addEventListener('click', () => {
    floatingCardWindow.style.display = 'block';
    overlay.style.display = 'block';
});

closeWindowBtn.addEventListener('click', () => {
    floatingWindow.style.display = 'none';
    overlay.style.display = 'none';
});

closeCardWindowBtn.addEventListener('click', () => {
    floatingCardWindow.style.display = 'none';
    overlay.style.display = 'none';
});

overlay.addEventListener('click', () => {
    floatingWindow.style.display = 'none';
    floatingCardWindow.style.display = 'none';
    overlay.style.display = 'none';
});
