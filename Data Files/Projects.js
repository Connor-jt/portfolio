

function init(){
    LoadDepends();
    LoadProjects();

}
var currently_expanded_item = undefined;
function config_trio_image(ui, src){
    if (src != null && src != ""){
        ui.style["display"] = "inline-block";
        ui.src = src;
    } else ui.style["display"] = "none";
}
function expand_item(){
    let focus_panel = document.getElementById("focus_presenter");
    if (currently_expanded_item == this){ // then close the thing entirely
        minimize_item(currently_expanded_item);
        focus_panel.classList.add("c_focused_item_shrink");
        return;
    }
    let panel_was_open = (currently_expanded_item != undefined);
    if (panel_was_open){
        minimize_item(currently_expanded_item);
    }

    // mark this visually as open

    // find the project associated with this tile
    let project = Projects[this.getAttribute("project")];

    document.getElementById("focus_title").innerText = project.name;
    document.getElementById("focus_date").innerText = project.Date;

    document.getElementById("focus_overview").innerText = project.Basc;
    document.getElementById("focus_desc").innerText = project.Desc;

    // setup images
    config_trio_image(document.getElementById("focus_imgF"), project.img1);
    config_trio_image(document.getElementById("focus_img1"), project.img1);
    config_trio_image(document.getElementById("focus_img2"), project.img2);
    config_trio_image(document.getElementById("focus_img3"), project.img3);

    // cleanup previous tags if any
    let tag_container = document.getElementById('focus_tags');
    while(tag_container.hasChildNodes())
        tag_container.removeChild(tag_container.lastChild);
    // init new tags
    for (let tag in project.deps){
        let dependency_name = project.deps[tag];
        let dependency = Depends[dependency_name];
        tag_container.appendChild(create_tag(dependency.name, dependency.color, dependency.alt_color));
    }

    if (!panel_was_open){
        focus_panel.classList.remove("c_focused_item_shrink");
    }
    this.style["border-bottom"] = "2px solid #ff5c00";
    currently_expanded_item = this; // this so when pressed again, can be hidden
}
function minimize_item(item){
    item.removeAttribute("style"); // this will clear the forced selected visual effect
    currently_expanded_item = undefined;
}
function select_image1(){
    select_image("focus_img1", "focus_frame1");
}
function select_image2(){
    select_image("focus_img2", "focus_frame2");
}
function select_image3(){
    select_image("focus_img3", "focus_frame3");
}

var last_selected_frame = undefined;
function select_image(image_id, frame){
    let focus_imgF = document.getElementById("focus_imgF");
    let new_src = document.getElementById(image_id);
    let new_frame = document.getElementById(frame);

    focus_imgF.src = new_src.src;
    if (last_selected_frame != undefined){
        last_selected_frame.style = "";
    }
    last_selected_frame = new_frame;
    last_selected_frame.style = "border: 1px solid white";
}

function create_tag(name, colr1, colr2){ // maybe someday we'll beable to use the second color, but it seems its not very possible to use the second color 
    let dep = document.createElement('div');
    dep.className = "tagbox";
    dep.innerText = name;
    dep.style = "border-color: " + colr1 + ";";
    return dep;
}
function create_trio_image(id, content){
    let frame = document.createElement('div');
    //frame.setAttribute("id", id);
    frame.className = "c_i_i_trioframe";
    frame.style = "display: none;";
    if (content != null || content != ""){
        let image = document.createElement('img');
        image.className = "c_i_img_preview";
        image.src = content;
        frame.appendChild(image);
    }
    return frame;
}

function LoadDepends(){
    let tools_container = document.getElementById("dev_tools");
    let RE_container = document.getElementById("RE_tools");
    let langs_container = document.getElementById("languages");
    for (let item in Depends){
        let dep = Depends[item];

        let new_dep = create_tag(dep.name, dep.color, dep.alt_color);
        if (dep.category == "Development Tool"){
            tools_container.appendChild(new_dep);
        } else if (dep.category == "Reverse Engineering"){
            RE_container.appendChild(new_dep);
        } else if (dep.category == "Language"){
            langs_container.appendChild(new_dep);
        }
    }
}

function LoadProjects(){
    let projects_container = document.getElementById("projects_list");
    for (let item_name in Projects){
        let item = Projects[item_name];

        let new_project = document.createElement('button');
        new_project.setAttribute("project", item_name);
        new_project.onclick = expand_item;
        new_project.className = "c_item";

            let header = document.createElement('div');
            header.className = "c_i_header";
                let name = document.createElement('span');
                name.className = "c_i_h_name";
                name.innerText = item.name;
                header.appendChild(name);

                let date = document.createElement('span');
                date.className = "c_i_h_date";
                date.innerText = item.Date;
                header.appendChild(date);
            new_project.appendChild(header);

            
            let overview_wrapper = document.createElement('div');
            overview_wrapper.className = "c_i_o_wrapper";
                let overview = document.createElement('span');
                overview.innerText = item.Basc;
                overview.className = "c_i_overview";
                overview_wrapper.appendChild(overview);
            new_project.appendChild(overview_wrapper);

            let images = document.createElement('div');
            images.className = "c_i_images";
                let image_preview = document.createElement('div');
                //image_preview.setAttribute("id", "imgp");
                image_preview.className = "c_i_i_wholeframe";
                if (item.imgp != null || item.imgp != ""){
                    let image_preview_img = document.createElement('img');
                    image_preview_img.className = "c_i_img_preview";
                    image_preview_img.src = item.imgp;
                    image_preview.appendChild(image_preview_img);
                }
                images.appendChild(image_preview);
            new_project.appendChild(images);

            let tags = document.createElement('div');
            tags.className = "c_i_tags";
                for (let tag in item.deps){
                    let dependency_name = item.deps[tag];
                    let dependency = Depends[dependency_name];
                    tags.appendChild(create_tag(dependency.name, dependency.color, dependency.alt_color));
                }
            new_project.appendChild(tags);


        projects_container.appendChild(new_project);
    }
}
var Depends = {
    visual_studio:      { name: "Visual Studio", color: "#cf9af9", alt_color: "#644992", category: "Development Tool",    usage:"Software Development" },
    vs_code:            { name: "VS Code",       color: "#44adf3", alt_color: "#2379b2", category: "Development Tool",    usage:"Web Development" },
    unity:              { name: "Unity",         color: "#ffffff", alt_color: "#29333d", category: "Development Tool",    usage:"Game Development" },
    unreal_engine:      { name: "Unreal Engine", color: "#080808", alt_color: "#ffffff", category: "Development Tool",    usage:"Game Development" },
    blender:            { name: "Blender",       color: "#eb7a08", alt_color: "#2d5c8b", category: "Development Tool",    usage:"Game Development" },

    ghidra:             { name: "Ghidra",        color: "#e22c22", alt_color: "#ffa11f", category: "Reverse Engineering", usage:"Assembly reversal" },
    cheat_engine:       { name: "Cheat Engine",  color: "#086491", alt_color: "#082d3e", category: "Reverse Engineering", usage:"Runtime Memory reversal" },
    x64dbg:             { name: "x64dbg",        color: "#333333", alt_color: "#e40707", category: "Reverse Engineering", usage:"Runtime functionality reversal" },
    hxd:                { name: "HxD",           color: "#f1a53f", alt_color: "#62b876", category: "Reverse Engineering", usage:"Binary structure analysis" },
    wireshark:          { name: "Wireshark",     color: "#1471da", alt_color: "#0f41a8", category: "Reverse Engineering", usage:"Net traffic analysis" },

    // languages
    cpp:                { name: "C++",           color: "#6a9dd3", alt_color: "#084a86", category: "Language",            usage:"Software/Game Development" },
    csharp:             { name: "C#",            color: "#a47edd", alt_color: "#32086f", category: "Language",            usage:"Software/Game Development" },
    javascript:         { name: "Javascript",    color: "#efda4d", alt_color: "#302f33", category: "Language",            usage:"Web Development" },
    htmlcss:            { name: "Html/CSS",      color: "#f66637", alt_color: "#1b87c7", category: "Language",            usage:"Web Development" },
    python:             { name: "Python",        color: "#fdcd3d", alt_color: "#3474a9", category: "Language",            usage:"Software Development" },
    blueprints:         { name: "Blueprints",    color: "#3660d6", alt_color: "#3474a9", category: "Language",            usage:"Game Development" },

    // frameworks
    opengl:             { name: "OpenGL",        color: "#ffdec4", alt_color: "#084a86", category: "Framework",           usage:"Software/Game Development" },
    wpf:                { name: "WPF",           color: "#56177a", alt_color: "#084a86", category: "Framework",           usage:"Software/Game Development" },
    dear_imgui:         { name: "Dear ImGUI",    color: "#1a272e", alt_color: "#084a86", category: "Framework",           usage:"Software/Game Development" },
    winforms:           { name: "WinForms",      color: "#c6c6c6", alt_color: "#084a86", category: "Framework",           usage:"Software/Game Development" },
    directx:            { name: "DirectX",       color: "#1ec200", alt_color: "#084a86", category: "Framework",           usage:"Software/Game Development" },
    peerjs:             { name: "PeerJS",        color: "#d86800", alt_color: "#084a86", category: "Framework",           usage:"Software/Game Development" },
    blender_api:        { name: "Blender API",   color: "#eb7a08", alt_color: "#084a86", category: "Framework",           usage:"Software/Game Development" },
    gamebar_api:        { name: "Gamebar API",   color: "#eb7a08", alt_color: "#084a86", category: "Framework",           usage:"Software/Game Development" },
}



var Projects ={
    // //////////////// //
    // 2023 HIGHLIGHTS //
    // ////////////// //
    example: {
        name: "Xbox Texture RE",
        Date: "2023",
        Basc: "Reversal of XBOX Tex Formats",
        Desc: "Detailed Overview 1",
        imgp: "Resources/Examples/RE/RE_1.png",
        img1: "Resources/Examples/RE/RE_1.png",
        img2: "Resources/Examples/RE/RE_2.png",
        img3: "Resources/Examples/RE/RE_3.png",
        deps: ["visual_studio","cpp","ghidra"]
    },
    example2: {
        name: "Javasqiggle",
        Date: "2023",
        Basc: "Multiplayer 3D Browser Game",
        Desc: "Detailed Overview 2",
        imgp: "Resources/Examples/JS/JS_1.png",
        img1: "Resources/Examples/JS/JS_1.png",
        img2: "Resources/Examples/JS/JS_2.png",
        img3: "Resources/Examples/JS/JS_3.png",
        deps: ["vs_code","javascript","htmlcss","opengl","peerjs"]
    },
    example3: {
        name: "Codename Atriox",
        Date: "2023",
        Basc: "Array of WIP Halo-Infinite Tools",
        Desc: "Detailed Overview 3",
        imgp: "Resources/Examples/CA/CA_1.png",
        img1: "Resources/Examples/CA/CA_1.png",
        img2: "Resources/Examples/CA/CA_2.png",
        img3: "",
        deps: ["visual_studio","cpp","directx","dear_imgui","csharp","wpf"]
    },

    // //////////////// //
    // 2022 HIGHLIGHTS //
    // ////////////// //
    example4: {
        name: "UE5 marching cubes",
        Date: "2022",
        Basc: "UE5 Procedural terrain",
        Desc: "Detailed Overview 4",
        imgp: "Resources/Examples/MC/MC_3.png",
        img1: "Resources/Examples/MC/MC_3.png",
        img2: "Resources/Examples/MC/MC_1.png",
        img3: "Resources/Examples/MC/MC_2.png",
        deps: ["unreal_engine","blueprints"]
    },
    example5: {
        name: "Megaloscript RE",
        Date: "2022",
        Basc: "Megaloscript RE & Documentation",
        Desc: "Detailed Overview 5",
        imgp: "Resources/Examples/ME/ME_1.png",
        img1: "Resources/Examples/ME/ME_1.png",
        img2: "Resources/Examples/ME/ME_2.png",
        img3: "Resources/Examples/ME/ME_3.png",
        deps: ["ghidra","x64dbg"]
    },
    example6: {
        name: "Megaloscript Mods",
        Date: "2022",
        Basc: "Popular Megaloscript Mods",
        Desc: "Detailed Overview 6\nthis desc in particular will be longer than the rest\n\n\n\ntest\ntest\ntest\ntest\ntest\ntest\ntest",
        imgp: "Resources/Examples/MS/MS_1.png",
        img1: "Resources/Examples/MS/MS_1.png",
        img2: "Resources/Examples/MS/MS_2.png",
        img3: "Resources/Examples/MS/MS_3.png",
        deps: ["vs_code"]
    },

    // //////////////// //
    // 2021 HIGHLIGHTS //
    // ////////////// //
    example7: {
        name: "Megalograph",
        Date: "2021",
        Basc: "Visual Megaloscript Compiler",
        Desc: "Detailed Overview 4",
        imgp: "Resources/Examples/MG/MG_2.png",
        img1: "Resources/Examples/MG/MG_2.png",
        img2: "Resources/Examples/MG/MG_3.png",
        img3: "Resources/Examples/MG/MG_1.png",
        deps: ["visual_studio","csharp","wpf", "hxd"]
    },
    example8: {
        name: "IRTV",
        Date: "2021",
        Basc: "Halo-Infinite Realtime Modding Tool",
        Desc: "Detailed Overview 5",
        imgp: "Resources/Examples/IRTV/IRTV_1.png",
        img1: "Resources/Examples/IRTV/IRTV_1.png",
        img2: "Resources/Examples/IRTV/IRTV_2.png",
        img3: "Resources/Examples/IRTV/IRTV_3.png",
        deps: ["visual_studio","csharp","wpf","cheat_engine"]
    },
    example9: {
        name: "HPS",
        Date: "2021",
        Basc: "Halo-MCC Realtime Cosmetics Modifer",
        Desc: "Detailed Overview 6\nthis desc in particular will be longer than the rest\n\n\n\ntest\ntest\ntest\ntest\ntest\ntest\ntest",
        imgp: "Resources/Examples/HPS/HPS_1.png",
        img1: "Resources/Examples/HPS/HPS_1.png",
        img2: "Resources/Examples/HPS/HPS_2.png",
        img3: "Resources/Examples/HPS/HPS_3.png",
        deps: ["visual_studio","csharp","winforms","cheat_engine"]
    },

}


