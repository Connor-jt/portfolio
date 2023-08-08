var user_link = "https://api.github.com/users/Connor-jt";

// await UI open
window.addEventListener('DOMContentLoaded', function() {

    // init this
    fetch_user_details();
    setInterval(write_loop_loop, 10);
    // call the load to repos
    for (let repolink of repo_links)
        load_repos(repolink);

    // init project items
    init();
    // init resizer logic
    resizer_init();
});

// fetch repo count
function fetch_user_details(){
    let request = new XMLHttpRequest();
    request.onload = read_user_repo_count;
    request.ontimeout = (e) => { 
    };
    request.open('get', user_link);
    request.send();
}
function read_user_repo_count(){
    let repodesc = document.getElementById("repo_text");
    repodesc.innerText = JSON.parse(this.responseText).public_repos + " Repositories";
}


