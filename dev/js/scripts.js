// jquery scripts for DOM
$(function() {
    $(document).on("click", ".dropdown", function(e) {
        e.preventDefault();
        $(this).find(".dropdown-submenu").slideToggle(200);
    });

});