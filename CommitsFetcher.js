var user_link = "https://api.github.com/users/Connor-jt";

// await UI open
window.addEventListener('DOMContentLoaded', function() {

    // init this
    setInterval(write_loop_loop, 10);
    // call the load to repos
    for (let repolink of repo_links)
        load_repos(repolink);

    // init project items
    init();
    // init resizer logic
    resizer_init();
});