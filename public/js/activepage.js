const activePage =  window.location.pathname;
const navLinks = document.querySelectorAll('div a').
forEach(link => {
    if(link.href.includes(`${activePage}`)){
        link.classList.add('nav-link');
    }
})


// source of this code : https://www.youtube.com/watch?v=JkuiKeNS2mg