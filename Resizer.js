






var doc_scroll = undefined;
var content_scroll = undefined;
var c_sidebar = undefined;
var c_code = undefined;
var c_tiles = undefined;
var focus_tile = undefined;
var all_tiles = undefined;
function resizer_init(){ // call on window load
    window.addEventListener('resize', resize, true);
    doc_scroll = document.getElementById("d_scroll");
    content_scroll = document.getElementById("c_scroll");
    c_sidebar = document.getElementById("sidebar_content");
    c_code = document.getElementById("code_container");
    c_tiles = document.getElementById("projects_list");
    focus_tile = document.getElementById("focus_presenter");
    all_tiles = document.getElementById("projects_list");
    resize();
}


var last_width = -1;
var last_available_width = -1;
var last_ratio = -1;
/*
const collapse_width = 800;
const focus_tile_width = 800;

const _1ipr_width =  300;
const _2ipr_width =  600;
const _3ipr_width =  800;
const _4ipr_width = 1000;
const _5ipr_width = 1200;*/

const collapse_width = 800;
const collapse_ratio = 0.80;
const focus_tile_width = 800;
const focus_tile_ratio = 1.2;

const _1ipr_width =  300;
const _2ipr_width =  600;
const _3ipr_width =  800;
const _4ipr_width = 1000;
const _5ipr_width = 1200;


function resize(){ // run once on init, and then whenever 
    // determine whether to collpase sidebar
    
    // note this should be a ratio, not a fixed width?
    let available_height = this.innerHeight;
    let available_width = this.innerWidth;

    let aspect_ratio = available_width / available_height;

    // detemine if the sidebar can fit, or has to go up the top
    if (aspect_ratio < collapse_ratio || available_width < collapse_width){ // then collpase header
        if (last_ratio >= collapse_ratio || last_ratio == -1){
            doc_scroll.className = "page_scroll";
            content_scroll.className = "";
            c_sidebar.className = "collapsed_sidebar";
            c_code.className = "background_sample";
        }
    } 
    else{ // then expand header
        available_width -= 300; // size of the sidebar 
        if (last_ratio >= collapse_ratio || last_ratio == -1){
            doc_scroll.className = "";
            content_scroll.className = "content_scroll page_scroll";
            c_sidebar.className = "sidebar";
            c_code.className = "background_sample background_expand";
        }
    } 

    // determine whether tiles should be placed on the side
    if (aspect_ratio > focus_tile_ratio && available_width >= focus_tile_width + 300){ // then put tiles on the sidebar
        available_width -= focus_tile_width;
        if (last_ratio < focus_tile_ratio || last_ratio == -1){
            focus_tile.classList.remove("c_focused_item_collapsed");
            focus_tile.classList.add("c_focused_item_exand");
            all_tiles.className = "tiles_sidebar";
        }
    } else { // tiles go at the bottom
        if (last_ratio >= focus_tile_ratio || last_ratio == -1){
            focus_tile.classList.remove("c_focused_item_exand");
            focus_tile.classList.add("c_focused_item_collapsed");
            all_tiles.className = "";
        }
    }


    // determine tile size
    if      (available_width < _1ipr_width){
        if (last_available_width >= _1ipr_width || last_available_width == -1){
            assign_all_tiles_classes("c_item c_item_ipr1");
    }}else if (available_width < _2ipr_width){
        if ((last_available_width < _1ipr_width || last_available_width >= _2ipr_width) || last_available_width == -1){
            assign_all_tiles_classes("c_item c_item_ipr2");
    }}else if (available_width < _3ipr_width){
        if ((last_available_width < _2ipr_width || last_available_width >= _3ipr_width) || last_available_width == -1){
            assign_all_tiles_classes("c_item c_item_ipr3");
    }}else if (available_width < _4ipr_width){
        if ((last_available_width < _3ipr_width || last_available_width >= _4ipr_width) || last_available_width == -1){
            assign_all_tiles_classes("c_item c_item_ipr4");
    }}else{ // 5 items per row
        if (last_available_width < _4ipr_width || last_available_width == -1){
            assign_all_tiles_classes("c_item c_item_ipr5");
    }}

    last_width = this.innerWidth;
    last_available_width = available_width;
}
function assign_all_tiles_classes(classes){
    for (element of c_tiles.children)
        element.className = classes;
}