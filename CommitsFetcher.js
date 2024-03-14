var user_link = "https://api.github.com/users/Connor-jt";

// await UI open
window.addEventListener('DOMContentLoaded', function() {

    // call the load to repos
    load_all_repos();

    // init project items
    init();
    // init resizer logic
    resizer_init();
    
    // init this
    setInterval(write_loop_loop, 10);
});