
var is_light_theme = false
function toggle_theme(){
    is_light_theme = !is_light_theme

    if (is_light_theme)
         document.body.className = "light-mode"
    else document.body.className = ""
}