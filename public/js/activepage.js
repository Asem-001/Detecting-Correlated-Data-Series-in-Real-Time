const activePage =  window.location.pathname;
const navLinks = document.querySelectorAll('aside a').
forEach(link => {
    if(link.href.includes(`${activePage}`)){
        link.classList.remove('collapsed');
    }
})


// source of this code : https://www.youtube.com/watch?v=JkuiKeNS2mg