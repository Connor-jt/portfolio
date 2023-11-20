
var repo_links = [
    // //"https://api.github.com/users/Gamergotten/repos", // we dont really need this one + the code is old as
    // "https://api.github.com/users/Codename-Atriox/repos", // and for this one i think we actually need to update the code to support it, as it handles a little differently
    "https://api.github.com/users/Connor-jt/repos"
    // this lists all the repos
    // full_name : git directory
    // contents_url : https://api.github.com/repos/Gamergotten/RVT-UTILITY/contents/
];
var valid_file_types = [
    "h",
    "cpp",
    "cs",
    "css",
    "js",
    "html",
    "hlsl",
    "py"
];
var error_log = [];
var repos_loaded = [];

var is_awaiting_response = false;

function load_repos(link){

    let request = new XMLHttpRequest();
    request.onload = repos_info_loaded;
    request.ontimeout = (e) => { 
        is_awaiting_response = false; 
    };
    request.open('get', link);
    request.send();
}
function repos_info_loaded() {
    for (let repo of JSON.parse(this.responseText))
        if (repo.fork == false)
            repos_loaded.push(repo);
}



function get_random_code_file(){
    // get a random repo from the list
    let repo_index = Math.floor(Math.random() * repos_loaded.length);
    let target_repo = repos_loaded[repo_index];

    // recurse through directories and list all files // negative lets keep it simple
    // iterate ONLY through toplevel files
    content_to_write += "// requesting files from repository: \"" + target_repo.full_name + "\"...\n";
    let request = new XMLHttpRequest();
    request.onload = pick_repo_file;
    request.ontimeout = (e) => { 
        content_to_write += "// repo file list request timed out\n"
        is_awaiting_response = false; 
    };
    request.open('get', target_repo.contents_url.split('{')[0]);
    request.send();
}
var open_file_text = null
function pick_repo_file(){
    let repo_content = JSON.parse(this.responseText);

    let valid_files = 0;
    // iterate through files to see which are compatible
    for (let file of repo_content){
        if (file.type != "file") continue;
        if (is_valid_ext(file.name.substring(file.name.lastIndexOf('.') + 1))) 
            valid_files++;
    }
    if (valid_files == 0){
        is_awaiting_response = false;
        return;}

    // pick random file and then filter through the array to find it
    let random_file_index = Math.floor(Math.random() * valid_files);
    let curr_file_index = -1;
    for (let file of repo_content){
        if (file.type != "file") continue;
        if (is_valid_ext(file.name.substring(file.name.lastIndexOf('.') + 1))) {
            curr_file_index++;
            // check if this is the file
            if (random_file_index == curr_file_index){
                // write prelude header,
                content_to_write += "// beginning download of code file...\n";
                content_to_write += "// " + '/'.repeat(file.download_url.length+1) + " //\n";
                content_to_write += "// " + file.download_url + " //\n";
                content_to_write += "// " + '/'.repeat(file.download_url.length-1) + " //\n";
                open_file_text.innerText = file.download_url;


                let request = new XMLHttpRequest();
                request.onload = handle_file_contents;
                request.ontimeout = (e) => { 
                    // add to the prelude header that this file failed to load
                    content_to_write += "// download request timed out\n"
                    open_file_text.innerText = "No file open";
                    is_awaiting_response = false; 
                };
                request.open('get', file.download_url);
                request.send();
                return;
            }

        }
    }
    content_to_write += "// no code files in this repository.\n"
}
function is_valid_ext(ext){
    for (let valid_ext of valid_file_types)
        if (valid_ext == ext)
            return true;
    return false;
}
function handle_file_contents(){
    content_to_write += this.responseText;
    is_awaiting_response = false; 
}


var content_to_write = "";
var content_index = 0;

var current_span = null;
var container;

const ticks_per_line = 4;
var lines_to_delete = 0;

const chars_per_tick = 2;

function write_loop_loop(){
    for (let i = 0; i < chars_per_tick; i++)
        write_loop();
}

function write_loop(){
    if (repos_loaded.length == 0) return; // we cant generate code if no repos are loaded
    if (is_awaiting_response) return; // writing while waiting for a response back from the repos

    if (open_file_text == null)
        open_file_text = document.getElementById("opendoc_text");
    if (open_file_text == null)
        return; // fallback function


    // check whether we need to load a new repo
    if (content_to_write == ""){
        open_file_text.innerText = "No file open";
        get_random_code_file();
    }

    // check whether we have reached the end of this file
    if (content_index >= content_to_write.length){
        content_to_write = "";
        current_span = null;
        content_index = 0;
        return;
    }

    // make sure the container exists
    if (container  == null || container == undefined)
        container = document.getElementById("code_container");
    if (container  == null || container == undefined)
        return;

    // check if we assinged some lines to be removed
    if (lines_to_delete != 0){
        if (container.children.length == 0){
            lines_to_delete = 0;
            return;}

        lines_to_delete--;
        if (lines_to_delete % ticks_per_line == 0)
            container.removeChild(container.firstElementChild);
        return;
    }

    // check whether there is room left on the page to insert the new chars
    let isOverflowing = container.clientHeight < container.scrollHeight;
    if (isOverflowing){
        // then delete a random amount of lines from the top
        lines_to_delete = Math.floor(Math.random() * (container.children.length/2)) * ticks_per_line;
        return;
    }


    // get next char
    let char = "";
    let space_count = 0;
    while(true){
        char = content_to_write[content_index];
        content_index++; // anything past this point will succeed, thus progressing the character
    
        // check whether this piece is a newline character
        if (char == '\n'){
            current_span = null;
            return;
        }
        // check whether character is basically null
        if (char == '\0' || char == '\r'){
            return;
        }
        if (char != " ")
            break;
        space_count++;
    }

    


    // check whether we need a newline
    if (current_span == null){
        current_span = document.createElement('span');
        current_span.className = "codeline";
        container.appendChild(current_span);
    }

    // finally add our next character to the string
    current_span.innerText += " ".repeat(space_count) + char;
}


// //////////////////// //
// INTIALIZATION LOGIC //
// ////////////////// //
//setInterval(write_loop_loop, 10);
// call the load to repos
//for (let repolink of repo_links)
//    load_repos(repolink);
