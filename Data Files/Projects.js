

function init(){
    LoadDepends();
    LoadProjects();
    // get a random tile and expand it
    expand_target_item(document.getElementById("projects_list").firstElementChild); 
}
var currently_expanded_item = undefined;
function config_trio_image(ui, src){
    let img = ui.firstElementChild;
    if (src != null && src != ""){
        ui.className = "c_i_i_t_interactive c_i_i_trioframe";
        img.src = "";
        update_img_later(img, src)
        img.style["display"] = "inline-block";
    } else {
        ui.className = "c_i_i_trioframe";
        img.src = "";
        img.style["display"] = "none";
}}
const delay = ms => new Promise(res => setTimeout(res, ms));
async function update_img_later(img, new_src){
    await delay(30);
    img.src = new_src;
}
function expand_item(){
    // if we're doing this in squisheed or mobile mode, then we have to record the change in scroll position
    let elem = undefined;
    if (mobile_mode === true) elem = document.getElementById("d_scroll");
    else                      elem = document.getElementById("c_scroll");

    let prev_height = elem.scrollHeight;
    let prev_scroll = elem.scrollTop;
    expand_target_item(this);

    if (mobile_mode === true || tablet_mode === true){
        let curr_height = elem.scrollHeight;
        let curr_scroll = elem.scrollTop;
        let height_difference = curr_height - prev_height;
        elem.scrollTop = prev_scroll + height_difference;
    }
}
function expand_target_item(item){
    let focus_panel = document.getElementById("focus_presenter");
    if (currently_expanded_item == item){ // then close the thing entirely // we now do not allow closing
        //minimize_item(currently_expanded_item);
        //focus_panel.classList.add("c_focused_item_shrink");
        return;
    }
    let panel_was_open = (currently_expanded_item != undefined);
    if (panel_was_open){
        minimize_item(currently_expanded_item);
    }

    // mark this visually as open

    // find the project associated with this tile
    let project = Projects[item.getAttribute("project")];

    document.getElementById("focus_title").innerText = project.name;
    document.getElementById("focus_date").innerText = project.Date;
    document.getElementById("timestamp").innerText = project.Edit;

    document.getElementById("focus_overview").innerText = project.Basc;
    document.getElementById("focus_desc").innerText = project.Desc;

    // setup images
    //config_trio_image(document.getElementById("focus_imgF"), project.img1);
    config_trio_image(document.getElementById("focus_frame1"), project.img1);
    config_trio_image(document.getElementById("focus_frame2"), project.img2);
    config_trio_image(document.getElementById("focus_frame3"), project.img3);

    // reset selected image status
    select_image1(true);
    // and then because we wait a frame for the image to properly refresh, we have to manually set the focused image
    let focus_imgF = document.getElementById("focus_imgF");
    focus_imgF.src = project.img1;

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
    
    // cleanup any previous media links
    let media_container = document.getElementById('media_links');
    while(media_container.hasChildNodes())
        media_container.removeChild(media_container.lastChild);
    // init new media links
    for (let media_key in project.Link){
        let media = project.Link[media_key]
        // construct new media thing
        let wrapper = document.createElement('a');
        wrapper.href = media.url;
        //wrapper.style = "text-decoration:none;color:white;"
        wrapper.style = "color:#69a020;"
        let block = document.createElement('div');
        let text = document.createElement('u');
        block.className = "mediabox";
        text.innerText = media.desc;
        let image = document.createElement('img');
        image.className = "c_i_i_f_media_img"
        if (media.type === "youtube")     image.src = "Resources\\Icons\\yt.png";
        else if (media.type === "github") 
            if (is_light_theme)           image.src = "Resources\\Icons\\gh_dark.png";
            else                          image.src = "Resources\\Icons\\gh.png";

        block.appendChild(image)
        block.appendChild(text)



        wrapper.appendChild(block)
        media_container.appendChild(wrapper);
    }


    if (!panel_was_open){
        focus_panel.classList.remove("c_focused_item_shrink");
    }
    item.style["border-bottom"] = "2px solid #ff5c00";
    currently_expanded_item = item; // this so when pressed again, can be hidden
}
function update_medias_theme(){ // used to change the image of github icons
    let elem = document.getElementById("media_links");
    for (let index = 0; index < elem.childNodes.length; index++){
        let media = elem.childNodes[index].childNodes[0];

        let image = media.getElementsByTagName('img')[0];
        if (!image.src.endsWith("gh.png") && !image.src.endsWith("gh_dark.png"))
            continue; // youtube medias don't need changing

        if (is_light_theme) image.src = "Resources\\Icons\\gh_dark.png";
        else                image.src = "Resources\\Icons\\gh.png";
    }
}

function minimize_item(item){
    item.removeAttribute("style"); // this will clear the forced selected visual effect
    currently_expanded_item = undefined;
}
function select_image1(force_set){
    select_image("focus_img1", "focus_frame1", force_set);
}
function select_image2(force_set){
    select_image("focus_img2", "focus_frame2", force_set);
}
function select_image3(force_set){
    select_image("focus_img3", "focus_frame3", force_set);
}
function select_fullscreen(){
    let focus_imgF = document.getElementById("focus_imgF");
    let fullscreen_panel = document.getElementById("fullscreen_img_border");
    fullscreen_panel.style.visibility = "visible";
    fullscreen_panel.className = "fullscreen";
    document.getElementById("fullscreen_img").src = focus_imgF.src;
}
function escape_fullscreen(){ // either by clicking or esc?
    let fullscreen_panel = document.getElementById("fullscreen_img_border");
    fullscreen_panel.style.visibility = "collapse";
    fullscreen_panel.className = "fullscreen fullscreen_shrink";
    document.getElementById("fullscreen_img").src = "";
}

var last_selected_frame = undefined;
function select_image(image_id, frame, force_set){
    let focus_imgF = document.getElementById("focus_imgF");
    let new_src = document.getElementById(image_id);
    let new_frame = document.getElementById(frame);

    if (force_set != true && (new_src.src == "" || new_src.src == null))
        return; // if we tried to select an image with no source, then dont bother selecting it?

    if (new_src.style["display"] == "none") 
        return;

    focus_imgF.src = new_src.src;
    if (last_selected_frame != undefined){
        last_selected_frame.style = "";
    }
    last_selected_frame = new_frame;
    update_selected_thing();
}
function update_selected_thing(){
    if (last_selected_frame == undefined) return;
    if (is_light_theme)
        last_selected_frame.style = "border-color: rgb(255, 81, 0)";
    else 
        last_selected_frame.style = "border-color: white";
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
                    image_preview_img.src = null;
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
    godot:              { name: "Godot",         color: "#448abb", alt_color: "#000000", category: "Development Tool",    usage:"Game Development" },
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
    blueprints:         { name: "Blueprints",    color: "#3660d6", alt_color: "#000000", category: "Language",            usage:"Game Development" },
    gdscript:           { name: "GDScript",      color: "#448abb", alt_color: "#000000", category: "Language",            usage:"Game Development" },
    rust:               { name: "Rust",          color: "#f54900", alt_color: "#000000", category: "Language",            usage:"Web Development" },
    asm:                { name: "Assembly",      color: "#70ac69", alt_color: "#000000", category: "Language",            usage:"Software Development / Reverse engineering" },
    megalo:             { name: "Megaloscript",  color: "#b28d00", alt_color: "#000000", category: "Language",            usage:"Game Development" },

    // frameworks
    opengl:             { name: "OpenGL",        color: "#ffdec4", alt_color: "#000000", category: "Framework",           usage:"Software/Game Development" },
    wpf:                { name: "WPF",           color: "#56177a", alt_color: "#000000", category: "Framework",           usage:"Software/Game Development" },
    dear_imgui:         { name: "Dear ImGUI",    color: "#1a272e", alt_color: "#000000", category: "Framework",           usage:"Software/Game Development" },
    winforms:           { name: "WinForms",      color: "#c6c6c6", alt_color: "#000000", category: "Framework",           usage:"Software/Game Development" },
    directx:            { name: "DirectX",       color: "#1ec200", alt_color: "#000000", category: "Framework",           usage:"Software/Game Development" },
    peerjs:             { name: "PeerJS",        color: "#d86800", alt_color: "#000000", category: "Framework",           usage:"Software/Game Development" },
    blender_api:        { name: "Blender API",   color: "#eb7a08", alt_color: "#000000", category: "Framework",           usage:"Software/Game Development" },
    gamebar_api:        { name: "Gamebar API",   color: "#107c10", alt_color: "#000000", category: "Framework",           usage:"Software/Game Development" },
    wasm:               { name: "Web Assembly",  color: "#6751f4", alt_color: "#000000", category: "Framework",           usage:"Web Development" },
}



var Projects ={
    // //////////////// //
    // 2024 HIGHLIGHTS //
    // ////////////// //
    example10: {
        name: "Rust Engine",
        Date: "2024",
        Basc: "Asm86-64 Reading Tool",
        Edit: "Jan 24th 2024",
        Link: [{desc:"basic video showcase", type:"youtube", url:"https://www.youtube.com/watch?v=MC_tofnZsRo"},
               {desc:"project source files", type:"github", url:"https://github.com/Connor-jt/wasm-engine"}],
        imgp: "Resources/Examples/AR/AR_1.png",
        img1: "Resources/Examples/AR/AR_1.png",
        img2: "Resources/Examples/AR/AR_2.png",
        img3: "Resources/Examples/AR/AR_3.png",
        deps: ["vs_code","htmlcss","javascript","python","rust","asm","wasm"],
        Desc: 
`Rust Engine is a simplistic web program designed to read compiled assembly/machine code from windows executable files.

Originally, it was intended to emulate the functionality of the x86 processor, effectively being capable of running any regular desktop programs.
Additionally, it would be operating from within a web based environment, allowing it to run on any platform with a standard web browser.

The program itself wouldn't be incredibly useful for this purpose, as there are likely already numerous programs out there for that purpose, but it was the knowledge to be learned that was the primary goal. Exe file formats, how assembly bytecode works, CPU instruction optimizations, etc.


The project itself was based around the concept of using one of web development's more recent languages, Web Assembly, to achieve a highly performant & efficient program. 
Performance of course, would be key for this program to be any use at all, slow response times would drastically decrease functionality & drastically decrease the rate at which users could interact with the program's console.
For this reason, it was necessary to have all the functionality contained within the web assembly portion of the program, with minor things like user input handled by the front end and then passed along. 
So a fair amount of abstraction and problem solving was required, which resulted in having the entire program be run & rendered to a pixel buffer via web assembly, and then having that buffer passed back to the front end to have it draw the image, resulting in a very fluid & efficient implementation.

The interesting thing about drawing the entire program pixel by pixel was being able to draw characters/letters, and fonts typically don't come in image files. 
So, to account for this, I devised my own font data that would allow me to design my own characters and convert each of them into an array of pixel coordinates, which could be efficiently indexed and drawn.

The biggest problem with this project was that while it was an achievable concept, the required amount of work didn't match the desired timeline for this project.
Which inevitably lead to minimizing the scope of this project, which meant disregarding the ability to execute interpreted code & replacing it with the functionality to print the code into a human readable format instead.

The rest of the project turned out pretty much as expected, the console interface rendered pixel by pixel with inputs, outputs & errors. Frontend user interface powered by JavaScript, for user inputs & file handling.
Even the assembly turned out to be relatively straightforward to interpret, I simply used some JavaScript to convert an online database of assembly instructions into usable rust code. The code would allow me to read 3 adjacent bytes and return the details of the assembly code within those bytes, further data like offsets & registers would usually be read outside of those bytes though.
The main assembly interpreter would start at a loaded exe file's entry point (defined by the executable header) and then would read instructions one by one, increasing the instruction pointer with each instruction.

The program itself offers several useful functions that make it easier to navigate an exe's bytecode, namely: 'offs', 'rip', & 'read'
The first two would allow either setting the exact instruction address, or offsetting the current address. The read function allows printing the byte contents from a specified address without reading any instructions, which is a crucial feature for debugging any inconsistencies that may exist with the program's assembly database.


Ultimately, leveraging several different languages for this project allowed me to easily achieve what I sought. JavaScript for frontend & converting instruction data from the web, Python for processing raw files & Rust for efficient code.
Although from the results, it felt almost entirely unnecessary to use Rust (compiled to web assembly) as the program did operate rather fast, but not so fast that it could likely be comparable to JavaScript in speed.

As per the primary goal of this project, there was quite a bit to learn about compiled assembly code & executable files, and I can say that I feel fairly confident in my understanding of it now, and will maybe be able to apply that knowledge to some deeper projects in the future.`},




    // //////////////// //
    // 2023 HIGHLIGHTS //
    // ////////////// //
    example3: {
        name: "Codename Atriox",
        Date: "2023",
        Basc: "Slipspace Mod Tools",
        Edit: "Jan 30th 2024",
        Link: [{desc:"showcase of asset loading capabilities", type:"youtube", url:"https://www.youtube.com/watch?v=IAZV11uO2vM"},
               {desc:"demo footage of import assets into the game", type:"youtube", url:"https://www.youtube.com/watch?v=cD979uZTxe8"},
               {desc:"project source files", type:"github", url:"https://github.com/orgs/Codename-Atriox/repositories"}],
        imgp: "Resources/Examples/CA/CA_1.png",
        img1: "Resources/Examples/CA/CA_1.png",
        img2: "Resources/Examples/CA/CA_2.png",
        img3: "Resources/Examples/CA/CA_3.png",
        deps: ["visual_studio","cpp","directx","dear_imgui","csharp","wpf"],
        Desc: 
`Codename Atriox (CA) was designed as a feature-rich, reimagination of the older developer/modding tools for the 'Blam!' & 'Slipspace' game engines.

The goal of the project was to replace the older modding tools with community driven, developer level tools, which would allow users to create content for the engine (essentially just for the game Halo Infinite), as the official developers can.

The need for this project arose from the fact that the Slipspace engine is a closed source project, and there are no publicly available developer tools. Meaning all content creation tools must be made entirely from scratch. And prior to this, there were no tools made.


The first tool in this collection is the heavily Visual Studio inspired content file viewer, intended for viewing and editing Slipspace content files. Which serves as the backbone of developing any content for the engine.
It features an internal file/folder browser & finder, along with an intuitive, text-based content file editor, which is where you make modifications to any of the content files. 

The goal with the editor was to convincingly represent the binary content as a plain text file, which makes the data much clearer, and makes it significantly easier to navigate. 
It could also then support exporting into actual plaintext, which can then be used for a lot of different analytical tasks, like data comparison between content files and the likes.

For the features this tool lacks, they would be covered in various helper command-line tools, which would be stuff like model/texture importing/exporting, and tools to dump various data from the game engine.
It was initially planned for all these helper tools to be bundled up into a singular helper tool (to simplify the processes), but as it stands all the tools remain individual because of the projects decline.


The other main tool in this project is the tag tester, which attempts to simulate how the data would be processed by the Slipspace game engine.
For example, the tool will load, process & render textures and geometry from the exact propriety data formats that Slipspace uses.

This allows for relatively rapid manual error detection. Otherwise, you'd have to painstakingly reload the content files in engine (typically restarting the entire game) to detect any issues.
It also provides the ability to examine already existing assets without having to access the data with the Slipspace engine, which can be rather inconvenient in most cases. 
And in some cases (like textures) it allows you to export the data so you can examine/use it with other tools.


Eventually my interest in the project faded, and led to an early completion, where several features & functionalities would be excluded, and most tools would not be polished or compiled for the end user.
But for the sheer magnitude of the project, it made it a very long way and hit many huge milestones that had never been reached before.

For the most part, this was an interesting project to take on, as most of the research & reversal had to be conducted by myself, but it provided me with a fun opportunity to learn a lotta interesting things, like directX11, DearImGUI & a LOT of advanced data compression techniques, and really just a lot of super technical things about game engines and content and all that.`,},


example2: {
    name: "Javasqiggle",
    Date: "2023",
    Basc: "Multiplayer Web Game",
    Edit: "Jan 30th 2024",
    Link: [{desc:"general showcase footage", type:"youtube", url:"https://www.youtube.com/watch?v=ETITCZBJEp8"},
           {desc:"project source files", type:"github", url:"https://github.com/Connor-jt/JavaSqiggle"}],
    imgp: "Resources/Examples/JS/JS_1.png",
    img1: "Resources/Examples/JS/JS_1.png",
    img2: "Resources/Examples/JS/JS_2.png",
    img3: "Resources/Examples/JS/JS_3.png",
    deps: ["vs_code","javascript","htmlcss","opengl","peerjs","blender"],
    Desc: 
`Javasqiggle is an online multiplayer, interactable strategy game designed to run on the web. 

The purpose being, to familiarize myself with JavaScript and web development, while allowing myself to express various talents, like game design, graphics, UI and all that.


The premise of the game is relatively simple, eliminate the other players to win. Which can be achieved by draining all their points & taking out all their pieces.
As for the gameplay, it partially falls under the RTS style, but moving/playing pieces is turn based, all players play during the same turn, so round based I guess.
Each player (and any player who joins in progress) will start off with 4 pieces, which they can use to attack other players' pieces & to control objective tiles.

The objectives provides a set amount of points each turn, which players can use to create more pieces with, with there being 4 unique pieces that each play different roles. 
The objectives are cumulatively, periodically generated on random tiles, after set amounts of turns (e.g., turn 5 might spawn a new objective).

The game's play space consists of an infinitely sized world of hexagons, where each piece can move a varying amount of times to a neighbouring tile each turn (depending on the type of piece).
By using hexagon tiles instead of square tiles, it would allow a more interesting visual & gameplay experience, which would really give this game its unique style.
And to further the visual factor, the hexagon tiles have a depth component powered by noise generation, which actually helps as a way to recognise specific areas of the play space (making it less likely for players to become disorientated while moving around the place).


The actual multiplayer aspect is powered by PeerJS, which greatly simplifies the networking process & generally makes it easy for players to setup game sessions, which for this game is as simple as loading up the server page and sharing the game code with the other players. 

Once players join, they are pretty much sent feet first right into the session, mainly because this game was designed to be heavily join in progress, where players could always join in the game later, opposed to most games where players would have to be there when the session begins. 
However, the user hosting the game always has the option to pause/unpause the game timer when need be, and by default the game initially is setup paused, so to begin the session, the host must use the command “/start”.
The server's console also has a bunch of other useful commands & functionalities, such as "pause", "action_time" or the "help" command to display all possible commands.


The website itself is open sourced and utilizes Github's pages feature for publish hosting, allowing anyone to use the link to access the game.

Surprisingly, this project managed to reach a feature complete & bug free state, pretty much nailing the concept.
And as per the goal of this project, it greatly helped with developing my JavaScript and other web related skills, which will (and already have) come to great use in the future.`,},


    // //////////////// //
    // 2022 HIGHLIGHTS //
    // ////////////// //
    example4: {
        name: "UE5 Voxels",
        Date: "2022",
        Basc: "Proc Gen Project",
        Edit: "Jan 30th 2024",
        Link: [{desc:"in-engine gameplay", type:"youtube", url:"https://www.youtube.com/watch?v=iddGwBH25kE"},
               {desc:"animation of the voxels algorithm", type:"youtube", url:"https://www.youtube.com/watch?v=aL0p8CMEh3g"},],
        imgp: "Resources/Examples/MC/MC_3.png",
        img1: "Resources/Examples/MC/MC_3.png",
        img2: "Resources/Examples/MC/MC_1.png",
        img3: "Resources/Examples/MC/MC_2.png",
        deps: ["unreal_engine","blueprints"],
        Desc: 
`This was a remake of an older project where I had partially implemented procedurally generated terrain systems with the marching cubes algorithm in Unreal Engine 4.
The aim was to get a fully functional implementation this time, but with unreal engine 5 and with proper contour smoothing as well.
Although, unreal engine 5 isn't that much different from 4 workflow wise, so recreating what I already had wouldn't be too difficult of a task (and I probably could have just copy pasted), it would be improving it that would be potentially challenging.


The terrain generation algorithm (marching cubes) is a simple set of rules that dictate the type of shape to generate when given of each of 8 vertices on a cube.
Each vertex holds a single bit of data: whether it is inside or outside of the shape.
By knowing which of the 8 vertices are inside the shape, we can calculate the mesh/shape inside that cube, meaning a total of 256 possible shapes (most are just rotated versions of the possible unique shapes). 

The amazing thing about the marching cubes algorithm is it allows you to calculate the shape inside any cube, completely independent to any other cube. Which allows things like parallel processing, which can drastically improve performance & increase compute speeds when generating the shapes within many cubes.

But doing just that gives pretty undesirable results, so instead of that I used a slightly more advanced version where each vertex would instead represent a floating-point number, which defines how solid that vertex is.
By defining how solid each vertex is, we can calculate the contour position between each pair of vertices, basically the middle point between a solid and non solid vertex. Whereas storing each vertex as a single bit (either solid or not solid) only allows us to specify the 50% mark between a solid and non solid vertex.

When you combine that with a 3d noise generation system, you can very easily generate these infinite voxel-ly cave kind of worlds, or you could use 2D noise to generate a surface to your 3d world.
On top of that, this system could also support regenerating the same chunks of data, with any sort of modifications, which allows effectively editing & recalculating the generated terrain at runtime, post initial generation.


Midst remaking, I learnt of a flaw in the algorithm which I had originally unknowingly ran into. Which was the problem of ambiguous faces between adjacent cubes. Where two adjacent cubes might share similar shapes, but both shapes are designed so that the other cube would fill in the hole in this cube's mesh/shape, meaning that neither shape covers the hole, and thus a hole would exist in the generated mesh where it should not have been.
This time around since I had realized the issue, I was able to solve it and that allowed my generated meshes to turn out great.


Overall, the project turned out rather well, it surpassed the aim of the project, but due to it being built with the Unreal Blueprints language, it did not perform very well at all. Which ultimately marked the end of this project, because rewriting it once again with a faster language really would not have been worth it.`,},

// removed as we're going to merge this in with the megalo mods section
//     example5: {
//         name: "Megaloscript RE",
//         Date: "2022",
//         Basc: "Reversal & Documentation",
//         imgp: "Resources/Examples/ME/ME_1.png",
//         img1: "Resources/Examples/ME/ME_1.png",
//         img2: "Resources/Examples/ME/ME_2.png",
//         img3: "Resources/Examples/ME/ME_3.png",
//         deps: ["ghidra","x64dbg"],
//         Desc: 
// `To conclude my time spent learning Megaloscript (a language native to various Halo games), I reverse engineered unknown machine code & then released documentation for the majority of the language.
// Featuring a full 60-page document, Covering almost every notable aspect of Megaloscript.

// The reverse engineering was mostly targeted at converting the machine code into human readable code.
// Which first started off with simple things like understanding how the compiled code was processed in game.
// Next up was investigating opcodes that did either nothing or didn't work as expected, and as it would turn out some of them were intentionally disabled by the developers.
// In fact, I discovered a fair few mistakes that I was able to contact the developers about and let them know exactly what the problem was.
// Allowing them to rapidly fix the issues.

// There were a lot of interesting things that were discovered about the language, upon unscrambling the machine code that interprets it.
// For example, a unique code compression technique was discovered, which utilizes null actions & conditions to adjust relative offsets of the following conditions & actions. 
// Meaning the functions can share the same bytes of code, but with different arrangements.
// However, that technique is only theoretical and untested in practice, so may be flawed.

// Finally came the documentation. 
// While there was already good documentation out there for a Megaloscript variant, that only covered content for somewhat experienced users.
// The intention with my documentation was to provide a source of knowledge that could benefit users of any level, all the way from just beginning to the most advanced.

// Within the documentation is a brief history of the language - what I managed to learn about it,
// Variables and how they work (variable limits, semi object oriented variable storage system),
// The syntactic/compiled code structures, how plaintext code is compiled, best practice code optimizations.
// Most importantly it covers all code techniques that drastically expand the language's capabilities.

// This ranges from things as simple as techniques to create smooth object movement, to bypassing synchronized states between multiplayer clients.
// For context, a large quantity of things are synchronized between every user in a Halo multiplayer session (like visible objects, variables, etc).
// By breaking synchronization, you can achieve so many things that were never possible. Which can be achieved by finding a player state that does not synchronize between clients and using that to identify the local player.
// As if that state does not synchronize, then the state can only exist for the local client's player, allowing us to determine which in game player is the local one.
// We can then use simple logic gates and synchronized states to feed data from the server to selected clients (through synchronized player states), where previously it was only ever possible to feed data to all clients simultaneously.

// Thats the kind of techniques featured in the documentation, fully detailed with ready to go sample code provided.
// And of course, things that were discovered with reversal were also featured, bugs, discoveries, and all that.

// This project was a good learning experience for machine code reversal, and then the documentation of findings.`,},


    example6: {
        name: "Megaloscripting",
        Date: "2022",
        Basc: "H:MCC Megalo Mods",
        Edit: "Feb 1st 2024",
        Link: [{desc:"channel dedicated to my creations", type:"youtube", url:"https://www.youtube.com/@gamergotten/videos"},
               {desc:"complete collection of source files", type:"github", url:"https://github.com/Gamergotten/RVT-Gametypes"}],
        imgp: "Resources/Examples/MS/MS_1.png",
        img1: "Resources/Examples/MS/MS_1.png",
        img2: "Resources/Examples/MS/MS_2.png",
        img3: "Resources/Examples/MS/MS_3.png",
        deps: ["vs_code","megalo"],
        Desc: 
`Megaloscript is a programming language native to several of the video games from the Halo franchise, designed as a means for modular creation of & easily reworking in game experiences.
This language was a huge interest of mine at the time, and having substantial experience, I was able to create some very unique & interesting things.
My main goal whenever I was working on one of these projects was to bring something entirely new & unique to the game.


One of the most notable examples was my attempt at a players vs zombies experience, which was originally only designed to test how interesting the AI (zombies) could be. But with how well the results turned out, I just had to turn this into a fully featured experience.
And as it would turn out the general Halo community also loved the idea, as it would bring a lot of awesome things had never really been in a halo game before. 

With the huge community interest, the project turned out really well and with loads of extra requested features (objectives, AI customization, currency systems, etc).
With so many requests & features, users could completely customize how the experience played, what the objectives were, how easy it was and so on, even customizing the player death mechanic in various ways, and coupled with the game's forge feature, it really allowed users to create their own unique experience using this mod.
I ended up adding so many features that most of them would rarely find use. Although for me, it was more about enabling creativity, where users could find & play with these features to really get a feel for how they wanted their personalized experience to play. And even if most people never used certain features, there might have actually been one person who absolutely loved it, and that's what it was really about when it comes to putting the power of creativity into the hands of others.


Another great mod was the Scarab project, which was aimed to be a massive reimagination of Halo's popular 'Invasion' experience. 
'Invasion' being an asymmetric player vs player game mode, where 1 team attacks objectives and the another defends them, with the roles alternating between 2 rounds, featuring probably the most immersive & loved Halo multiplayer experience. 

The key idea behind the scarab project was the focus of this large AI controlled scarab vehicle (a large vehicle iconic to Halo).
Like Invasion there would be two teams, one defending and the other attacking.
However, as a part of this reimagination process, it was decided that both teams should have the opportunity to simultaneously defend and attack, which would really branch out the ways that you could play this experience.
One team would be defending the AI scarab, while they would also be attacking the massive base of the opposing team.
The other team would be defending their base, as well as trying to destroy the scarab.

In a way this allowed the game mode to maintain its asymmetric objective, with the goal of defending the scarab, and the other team attacking it.
And the added functionality of destroying the attacking team's base, acts almost as an organic round time limit, where inevitably the attackers base will be destroyed. 
But to reach that effective time limit, the defenders of course must defend, but at the same time it acts as an opportunity for either team to play the role of the attacker, without having to run another round to swap attacking/defending roles. Which was perfect for this mode as playtime for rounds averaged around 30 minutes.

For the most part, all of that was actually an afterthought, as this project was designed as a sort of tech demo to show off recent huge breakthroughs in Megaloscripting technologies that allowed the scarab to even exist. 
But again, the community loved it, so I couldn't pass up the opportunity to turn this thing into a full scale in game experience.
For this project I was joined by one of the most talented map forgers, Mr Dr Milk, to really bring this project together. We would work in tandem tailoring map to mode and mode to map, resulting in a really great fit between the two. Really bringing the best of both worlds.

When the release came, we didn't even really have to organize anything, we just sent out the notification to a group of friends, and within minutes we had more than enough people jump online to host a full session. Players were so amazed they opted to share their experiences online and by the next day, 10's of thousands of people had seen and been amazed by this project, which was an insane feat for a mod designed for a 12-year-old, low population game.  
Within the next week or so, with the help of several big names in the community sharing our work, we'd spread into the 100's of thousands of people amazed.
It would mark probably one of the craziest things to have ever to be seen for a halo game. And it really went to show how far others and I had managed to push this effectively ancient technology.


To conclude my time with Megaloscript, I decided to concentrate all of my knowledge into a massive piece of technical documentation, covering somewhere in the range of 60 pages worth of history, fundamental/beginner concepts, scripting syntaxes, best practices, optimizations, advanced & 'dark magic' scripts and even experimental code compiling compression techniques.
Released in a hope that it would keep the flame of Megaloscripting alight, and to enable future generations to continue the path that I paved. 


All in all, Megaloscript really helped me develop my passion for programming & development, and it was an amazing experience to be able to share that passion with the million or so people who at some point had either watched video showcases, joined me/others in game, or those who had helped & cheered along the way.
It was a great opportunity to really understand what it is to be a player, the needs, the wants, the playstyles, the goods, the bads. I received probably 1000's of pieces of feedback across the span of my 100's of projects, some projects were good, some bad, and it became quite easy to tell the two apart, ultimately allowing me to spend more time on the things that people would come to love. `,},


    // //////////////// //
    // 2021 HIGHLIGHTS //
    // ////////////// //
    example7: {
        name: "Megalograph",
        Date: "2021",
        Basc: "Megaloscript Compiler",
        Edit: "Jan 24th 2024",
        Link: [{desc:"walkthrough of one of the major versions", type:"youtube", url:"https://www.youtube.com/watch?v=2KovZYexA7w"},
               {desc:"project source files", type:"github", url:"https://github.com/Gamergotten/Megalograph"}],
        imgp: "Resources/Examples/MG/MG_2.png",
        img1: "Resources/Examples/MG/MG_2.png",
        img2: "Resources/Examples/MG/MG_3.png",
        img3: "Resources/Examples/MG/MG_1.png",
        deps: ["visual_studio","csharp","wpf", "hxd","megalo"],
        Desc: 
`Megalograph is a fully graphical code compiler & decompiler targeted towards the propriety (Halo) Megaloscript language. Supporting 3 unique variants of the target language.
To allow this, Megalograph hosts its own unique node-based programming language, which can be called "Megalograph". Which can be decompiled/compiled to any of those 3 Megaloscript variants.

The need for this project arose from the fact that there were no tools that filled its place. (at least until long after its release)
It filled the place of a compiler for the H2A variant of the Megaloscript language, a language which was previously unknown.

The project began with researching the H2A Megaloscript variant, when the differences between that version and the other more documented variants were understood, the actual tool could begin development.
For the tool itself, it was decided that a graphical node-based language would be used to represent the unknown propriety Megaloscript language.
Which essentially meant designing the Megaloscript language myself, although since Megaloscript is an interpreted language, the core functionality didn't need designing. So, it was merely a task of designing the language's syntax.

The idea for a node-based language was inspired by Unreal Engine's Blueprint system, which provides a unique and intuitive programming experience.
It also allowed breaking the language down into something much simpler than can be achieved by text-based code, which would help users understand the Megaloscript language much better.

By using a node-based language, it means that the code is impossible to have syntax errors. Which means that its generally easier to work with.
However, the code is slightly harder to work with in a 2-dimensional state. Partly because it requires greater organization skills, and partly because it creates an excess of unneeded bloat, which just gets in the way of making code.

And for those reasons, is why this was a hobby project, and not really intended for public use.

Once the language was designed and implemented, then support was added for the 2 other Megaloscript variants.
Along with a plethora of helpful features, such as: block comments, node searching, variable names & so on.

The only other tool that matches compatibility with all major Megaloscript variants is the propriety Megaloscript compiler, developed by 343 industries as the official tool to compile Megaloscript.
That tool was recently released in 2022, more than a year after the release of Megalograph.

However, Megalograph provides the functionality to decompile Megaloscripts, meaning that it has native compatibility with every other tool that compiles Megaloscript. Unlike the official compiler, which lacks support for reading Megalosrcipt compiled from other tools.

All-together this project was great opportunity to explore the C# WPF UI framework, and develop my programming & UI development skills.`,},


    example8: {
        name: "IRTV",
        Date: "2021",
        Basc: "H:Infinite Mod Tool",
        Edit: "Jan 24th 2024",
        Link: [{desc:"playlist of creations using this tool", type:"youtube", url:"https://www.youtube.com/watch?v=-WL5zU1mXcE&list=PLHq7Y0BiaVnbRmMFdWTRVQJzXwLZHYMUF"},
               {desc:"project source files", type:"github", url:"https://github.com/Gamergotten/Infinite-runtime-tagviewer"}],
        imgp: "Resources/Examples/IRTV/IRTV_1.png",
        img1: "Resources/Examples/IRTV/IRTV_1.png",
        img2: "Resources/Examples/IRTV/IRTV_2.png",
        img3: "Resources/Examples/IRTV/IRTV_3.png",
        deps: ["visual_studio","csharp","wpf","cheat_engine"],
        Desc: 
`Halo Infinite Runtime Tag-Viewer (IRTV) is an intuitive, user-friendly tool for creating & applying simple game modifications to Halo Infinite.

Initially this tool was designed as a research framework, to understand the underlying game engine behind the game Halo Infinite.
As demand grew for a functional modding tool for Halo Infinite, this tool received a lot of attention, and was soon modified to meet demands.

The attention grew not only from users interested in making modifications to the game, but also other modders who desired to be a part of the future of game modding for Halo Infinite.
within a few weeks the development team rose from just me, to about 13 people, and countless other people who helped from a less technical standpoint.

Following, millions of lines of code would be committed the project, and somewhere around thousands of users would download & use the tool.

Due to popularity, we even partnered with one of the largest Online Halo communities (HaloCustoms.com), to provide a convenient place for users to download & share their mods generated with this tool.

Because of how early into Halo Infinite's lifespan this tool was developed, we spearheaded virtually all research into the game engine, the only previous knowledge out there was reverse engineered knowledge for a much older version of the game engine.
Ultimately because of this, we paved the pathway for modding Halo Infinite, for future modding endeavours.
And as of writing there is still no tool which supersedes or replaces the functionality of this tool.

This was one of my biggest projects, both in scope and demand. It provided an excellent opportunity to become familiar with the C# software development framework & working in a team-based environment.
It also provided a great opportunity to learn about meeting and managing the demands of a moderate-to-large userbase.`,},


    example9: {
        name: "HPS",
        Date: "2021",
        Basc: "H:MCC Cosmetics Tool",
        Edit: "Jan 24th 2024",
        Link: [{desc:"project source files", type:"github", url:"https://github.com/COZITIME/HaloPogSwitch"}],
        imgp: "Resources/Examples/HPS/HPS_1.png",
        img1: "Resources/Examples/HPS/HPS_1.png",
        img2: "Resources/Examples/HPS/HPS_2.png",
        img3: "Resources/Examples/HPS/HPS_3.png",
        deps: ["visual_studio","csharp","winforms","cheat_engine"],
        Desc: 
`HaloPogSwitch (HPS) is a real-time armour/cosmetics switching tool, supporting 3 separate halo games: Halo Reach, Halo 4 & Halo 2 Anniversary.

Originally starting off as research for various hidden cosmetics & Halo's cosmetic synchronization system, it soon became a fully featured tool for users to change their characters mid-match. Including the possibility to use previously unused/locked cosmetics.

After the concept was proven with the research, a few other members of the Halo community joined along to assist with the tool's development.
Because this was our first-time developing software, we had opted to use a more basic framework for the tool. Which was the WinForms framework.
The WinForms framework provided a relatively simple set of tools which allowed easily building user interfaces.
However due to the simplicity of the framework, it led to numerous issues with development, which were eventually resolved. 

For the actual functionality of the tool (providing real-time cosmetics switching) we had decided on using the Memory.dll NuGet package.
Which provided a lot of out of the box functionality for reading & writing the RAM of another windows process. Allowing us to effectively interface our tool with the Halo windows processes.

It was the first standalone executable program I had worked on, although most of the interface & functionality was designed by team member Cozi. My part was mostly interfacing the tool with the Halo window processes.
But because of the opportunity to see firsthand how software could be developed, this inspired me to learn more about making software, which has since led me on a pathway to learning numerous programming frameworks and languages.`,},

}


