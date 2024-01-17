//*____________________________

(function() {
    "use strict";
  
    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
      el = el.trim()
      if (all) {
        return [...document.querySelectorAll(el)]
      } else {
        return document.querySelector(el)
      }
    }
  
    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
      if (all) {
        select(el, all).forEach(e => e.addEventListener(type, listener))
      } else {
        select(el, all).addEventListener(type, listener)
      }
    }
  
    /**
     * Easy on scroll event listener 
     */
    const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener)
    }
  
    /**
     * Sidebar toggle
     */
    if (select('.toggle-sidebar-btn')) {
      on('click', '.toggle-sidebar-btn', function(e) {
        select('body').classList.toggle('toggle-sidebar')
      })
    }
  
    /**
     * Search bar toggle
     */
    if (select('.search-bar-toggle')) {
      on('click', '.search-bar-toggle', function(e) {
        select('.search-bar').classList.toggle('search-bar-show')
      })
    }
  
    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
      let position = window.scrollY + 200
      navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return
        let section = select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          navbarlink.classList.add('active')
        } else {
          navbarlink.classList.remove('active')
        }
      })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)
  
    /**
     * Toggle .header-scrolled class to #header when page is scrolled
     */
    let selectHeader = select('#header')
    if (selectHeader) {
      const headerScrolled = () => {
        if (window.scrollY > 100) {
          selectHeader.classList.add('header-scrolled')
        } else {
          selectHeader.classList.remove('header-scrolled')
        }
      }
      window.addEventListener('load', headerScrolled)
      onscroll(document, headerScrolled)
    }
  
    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active')
        } else {
          backtotop.classList.remove('active')
        }
      }
      window.addEventListener('load', toggleBacktotop)
      onscroll(document, toggleBacktotop)
    }
  
    
  
    /**
     * Initiate Bootstrap validation check
     */
    var needsValidation = document.querySelectorAll('.needs-validation')
  
    Array.prototype.slice.call(needsValidation)
      .forEach(function(form) {
        form.addEventListener('submit', function(event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  
   
  
  })();

  document.addEventListener('DOMContentLoaded', function() {
    // Function to show the dialog
    function showDialog(title, userData = {}) {
      // Set the title
      document.querySelector('#dialog .dialog-title').textContent = title;
  
      // Populate form fields if userData is provided (for Edit)
      document.getElementById('validationCustom01').value = userData.id || '';
      document.getElementById('validationCustom02').value = userData.name || '';
      document.getElementById('validationCustom03').value = userData.email || '';
      document.getElementById('validationCustom04').value = userData.adminId || '';
      document.getElementById('validationCustom05').value = userData.accountDate || '';
  
      // Show the dialog
      document.getElementById('dialog').style.display = 'block';
    }
  
    // Function to hide the dialog
    function closeDialog() {
      document.getElementById('dialog').style.display = 'none';
    }
  
    // Attach event listener to Add User button
    document.getElementById('addUserBtn').addEventListener('click', function() {
      showDialog('Add New User');
    });
  
    // Attach event listeners to Edit buttons
    const editButtons = document.querySelectorAll('.bi-pen');
    editButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const row = this.closest('tr');
        const userData = {
          id: row.cells[0].innerText,
          name: row.cells[1].innerText,
          email: row.cells[2].innerText,
          adminId: row.cells[3].innerText,
          accountDate: row.cells[4].innerText
        };
        showDialog('Edit User', userData);
      });
    });
  
    // Attach event listener to close button in the dialog
    document.querySelector('#dialog .dialog-close-btn').addEventListener('click', closeDialog);
  
    // Handle form submission
    document.querySelector('#dialog form').addEventListener('submit', function(event) {
      event.preventDefault();
      // Retrieve form data
      const formData = {
        id: document.getElementById('validationCustom01').value,
        name: document.getElementById('validationCustom02').value,
        email: document.getElementById('validationCustom03').value,
        adminId: document.getElementById('validationCustom04').value,
        accountDate: document.getElementById('validationCustom05').value
      };
      
      // Here, add your logic to process formData, such as sending it to a server or updating the table
      console.log('Form Data:', formData);
  
      closeDialog();
    });
  });
  
  document.addEventListener('DOMContentLoaded', function() {
  // ... your existing functions for Add and Edit ...

  // Function to show the delete confirmation dialog
  function showDeleteDialog() {
    document.getElementById('deleteDialog').style.display = 'block';
  }

  // Function to hide the delete confirmation dialog
  function closeDeleteDialog() {
    document.getElementById('deleteDialog').style.display = 'none';
  }

  // Attach event listeners to Delete buttons
  const deleteButtons = document.querySelectorAll('.bi-trash');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      showDeleteDialog();
      // Store the row to be deleted
      const rowToDelete = this.closest('tr');
      
      // Attach a one-time event listener to the confirm delete button
      document.getElementById('confirmDeleteBtn').onclick = function() {
        // Logic to delete the user
        rowToDelete.remove();
        closeDeleteDialog();
        alert('User deleted successfully');
      };
    });
  });

  // Attach event listener to close button in the delete dialog
  document.querySelector('#deleteDialog .dialog-close-btn').addEventListener('click', closeDeleteDialog);
});


$(function() {
  $("#slider-range").slider({
    range: true,
    min: -1,
    max: 1,
    step: 0.05,
    values: [-1, 1], 
    slide: function(event, ui) {
      $("#range").val(ui.values[0] + " , " + ui.values[1]);
    }
  });
  $("#range").val($("#slider-range").slider("values", 0) +
    " , " + $("#slider-range").slider("values", 1));
});