
var is_light_theme = false
function toggle_theme(){
    is_light_theme = !is_light_theme

    let theme_button = document.getElementById("theme_toggle")
    if (is_light_theme){
        document.body.className = "light-mode"
        theme_button.innerText = "Light Mode"
    }else {
        document.body.className = ""
        theme_button.innerText = "Dark Mode"
    }
    update_selected_thing() // update theme for selected trio frame thing
    update_medias_theme() // update any media link's github icons
}
document.onkeydown = bodykeyPress;
function bodykeyPress (e) {
    if(e.key === "Escape") {
        // pass info down to fullscreen to escape current fullscreened thing
        escape_fullscreen();
    }
}