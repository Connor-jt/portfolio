






var doc_scroll = undefined;
var content_scroll = undefined;
var c_sidebar = undefined;
var c_code = undefined;
var c_tiles = undefined;
function resizer_init(){ // call on window load
    window.addEventListener('resize', resize, true);
    doc_scroll = document.getElementById("d_scroll");
    content_scroll = document.getElementById("c_scroll");
    c_sidebar = document.getElementById("sidebar_content");
    c_code = document.getElementById("code_container");
    c_tiles = document.getElementById("projects_list");
    last_width = -1;
    resize();
}


var last_width = -1;
const collapse_width = 800;

const _2ipr_width =  600;
const _3ipr_width = 1200;
const _4ipr_width = 1400;
const _5ipr_width = 1600;


function resize(){ // run once on init, and then whenever 
    // determine whether to collpase sidebar
    
    // note this should be a ratio, not a fixed width?
    let test1 = this.innerHeight;
    let test2 = this.innerWidth;

    if (this.innerWidth < collapse_width && (last_width >= collapse_width || last_width == -1)){ // then collpase header
        doc_scroll.className = "page_scroll";
        content_scroll.className = "";
        c_sidebar.className = "collapsed_sidebar";
        c_code.className = "background_sample";
    } 
    else if (this.innerWidth >= collapse_width && (last_width < collapse_width || last_width == -1)){ // then expand header
        doc_scroll.className = "";
        content_scroll.className = "content_scroll page_scroll";
        c_sidebar.className = "sidebar";
        c_code.className = "background_sample background_expand";
    } 


    // determine tile size
    if      (this.innerWidth < _2ipr_width){
        if (last_width >= _2ipr_width || last_width == -1){
            assign_all_tiles_classes("c_item c_item_ipr2");
    }}else if (this.innerWidth < _3ipr_width){
        if ((last_width < _2ipr_width || last_width >= _3ipr_width) || last_width == -1){
            assign_all_tiles_classes("c_item c_item_ipr3");
    }}else if (this.innerWidth < _4ipr_width){
        if ((last_width < _3ipr_width || last_width >= _4ipr_width) || last_width == -1){
            assign_all_tiles_classes("c_item c_item_ipr4");
    }}else{ // 5 items per row
        if (last_width < _4ipr_width || last_width == -1){
            assign_all_tiles_classes("c_item c_item_ipr5");
    }}
    last_width = this.innerWidth;
}
function assign_all_tiles_classes(classes){
    for (element of c_tiles.children)
        element.className = classes;
}