

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
    
    expand_target_item(this);
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
        else if (media.type === "github") image.src = "Resources\\Icons\\gh.png";
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
    document.getElementById("fullscreen_img_border").style.visibility = "visible";
    document.getElementById("fullscreen_img").src = focus_imgF.src;
}
function escape_fullscreen(){ // either by clicking or esc?
    document.getElementById("fullscreen_img_border").style.visibility = "collapse";
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
        Edit: "Jan 24th 2024",
        Link: [{desc:"showcase of asset loading capabilities", type:"youtube", url:"https://www.youtube.com/watch?v=IAZV11uO2vM"},
               {desc:"demo footage of import assets into the game", type:"youtube", url:"https://www.youtube.com/watch?v=cD979uZTxe8"},
               {desc:"project source files", type:"github", url:"https://github.com/orgs/Codename-Atriox/repositories"}],
        imgp: "Resources/Examples/CA/CA_1.png",
        img1: "Resources/Examples/CA/CA_1.png",
        img2: "Resources/Examples/CA/CA_2.png",
        img3: "Resources/Examples/CA/CA_3.png",
        deps: ["visual_studio","cpp","directx","dear_imgui","csharp","wpf"],
        Desc: 
`Codename Atriox (CA) was designed as a feature-rich, reimagination of the older developer/modding tools for working with the 'Blam!' & 'Slipspace' game engines.
The goal of the project was to replace the older modding tools with community driven developer level tools, that would allow users to create content for the engine (particularly for the game Halo Infinite), as the developers can.

The reasoning behind this, is because the Slipspace game engine is closed-source & no developer tools are available. Meaning all tools have to be created & maintained by the community.
And the secondary factor was that there were no other community powered tools that enabled users to create new content, opposed to making edits to the existing content.


The first tool in the collection was our heavily Visual Studio inspired Tag file viewer (Tag files being the files that store the game-asset's data).

The purpose of this tool is to view and edit the game-assets' container files (module files), which is the fundamental feature of being able to make/modify content for the game engine.
Its the core tool for modding the game. However there are already numerous tools that serve the same role as this one, but they do not support recompiling Modules. Limiting the amount of content you can possibly create with those tools.

It features an internal file browser for tag file navigation & searching, along with an intuitive, user-friendly text-based tag file property editor. 
The goal with that was to at first glance, convince users that the binary content is stored in plaintext, which would make navigation much easier than an interface that presented the binary data in structures.
By having the data formatted like this, it could support easily exporting this data into actual plaintext, which can then be used for a lot of different analysis related tasks. IE. comparing differences between two assets.

For the features this tool lacks, they would be covered in various helper command-line tools, which would be stuff like model/texture importing/exporting, module file compiling/decompiling, and tools to dump various datas from the game engine.
It was initially planned for all these helper tools to be bundled up into a singler helper tool (to simplify the processes), but as it stands all the tools remain individial.


The other main tool in this project is the tag tester (& exporter).
This tool provides the functionality to simulate how the data would be processed if accessed by the Slipspace game engine.
For example, the tool will load, process & render textures and geometry from the exact propriety data formats that Slipspace uses.
This allows for rapid error detection. Otherwise, you'd have to constantly reload the modified data into the release build of Halo Infinite to detect any issues.
It also provides the ability to view/preview assets without having to access the data with the Slipspace engine, which can be rather inconvenient in most cases.

It also provides the functionality to convert specific data types into non-propreity, standard formats, such as image assets.
Which can be useful if users want to extract & modify those specific assets. Or it can also be useful for exporting the data to other programs to better inspect any errors/details. 

For the most part, this was an interesting project to take on, as most of the research has to be conducted by myself.
And from it, i gained a fair level of experience with a lot of different languages & frameworks, a few of which include: C++, directX11 & DearImGUI.`,},


example2: {
    name: "Javasqiggle",
    Date: "2023",
    Basc: "Multiplayer Web Game",
    Edit: "Jan 24th 2024",
    Link: [{desc:"general showcase footage", type:"youtube", url:"https://www.youtube.com/watch?v=ETITCZBJEp8"},
           {desc:"project source files", type:"github", url:"https://github.com/Connor-jt/JavaSqiggle"}],
    imgp: "Resources/Examples/JS/JS_1.png",
    img1: "Resources/Examples/JS/JS_1.png",
    img2: "Resources/Examples/JS/JS_2.png",
    img3: "Resources/Examples/JS/JS_3.png",
    deps: ["vs_code","javascript","htmlcss","opengl","peerjs","blender"],
    Desc: 
`Javasqiggle is a simple web browser game utilizing PeerJS multiplayer & OpenGl (ThreeJS) web graphics.
The purpose of this project was to become familiar with JavaScript and web development, while also creating something fun/interesting that i can share with others.

The premise of the game is simple: eliminate all opposing players to win. Which you can do by taking out all their pieces & denying them resource points.

One of the main ideas behind this was to make it a turn-based RTS style game, but everyone makes their moves simultaneously. Making the gameplay more unique.
Each player (and any player who join in progress) will initially start off with 4 pieces, which they must use to capture the objective tiles.

By controlling objectives, that provides a set amount of resource points each turn, allowing players to develop their armies.
So, priority would be controlling objectives, and then cutting the opposing players off from their objectives.

The objectives themselves are periodically placed on random tiles, after set amounts of turns (e.g., turn 5 might spawn a new objective).

The game's 'Board' consists of an infinitely sized array of hexagons, opposed to square tiles. Which allows pieces to have a wider selection of possible moves.
The Board also has a depth component, powered by simplex-noise.js. The depth is the visual height of each tile. 
However, the tile height has no gameplay impact, primarily it acts as a way to recognise specific areas of the board (aka, making it less likely for players to become disorientated while navigating the board).

The actual multiplayer aspect is powered by PeerJS, as anything other than Peer2Peer connections would overly complicate the process.
The player desiring to host a session would load the server webpage, which facilitates all online connectivity. Players who want to participate can load the standard game webpage and then enter the game session code generated by the server webpage.
This will connect them to the server, allowing them to join the game.

There is no lobby mechanic, so the game effectively starts when players join. However the hosting player must enter "/start" in the server's console for turns to occur (starting the game).
There are also various other commands that can be entered into the server's console, such as "pause", "action_time" or the "help" command to display all possible commands.

The website itself utilizes GitHub's free website hosting feature "GitHub Pages". Meaning the website will exist so long as GitHub pages functionality does.

As per the goal of this project, I gained a lot of experience in web development and the end product yielded a good demonstration of my skills.`,},


    // //////////////// //
    // 2022 HIGHLIGHTS //
    // ////////////// //
    example4: {
        name: "UE5 Voxels",
        Date: "2022",
        Basc: "Proc Gen Project",
        Edit: "Jan 24th 2024",
        Link: [{desc:"in-engine gameplay", type:"youtube", url:"https://www.youtube.com/watch?v=iddGwBH25kE"},
               {desc:"animation of the voxels algorithm", type:"youtube", url:"https://www.youtube.com/watch?v=aL0p8CMEh3g"},],
        imgp: "Resources/Examples/MC/MC_3.png",
        img1: "Resources/Examples/MC/MC_3.png",
        img2: "Resources/Examples/MC/MC_1.png",
        img3: "Resources/Examples/MC/MC_2.png",
        deps: ["unreal_engine","blueprints"],
        Desc: 
`A revisitation to an older project of mine, where I had previously (partially) implemented procedurally generated terrain systems with the marching cubes algorithm in Unreal Engine 4.
The aim of this project was to fully implement the marching cubes algorithm into unreal engine 5, with full contour smoothing implemented.

Something that I've always enjoyed is making content that makes itself. Procedural generation or AI or any of that stuff.
On several occasions I had implemented different techniques of procedural terrain generation in various game engines, most notable was my previous marching cubes implementation.

So given that the project was originally incomplete, I had decided to revisit & finally finish it. In the process I also upgraded to a newer game engine.

The marching cubes algorithm itself is a simple set of rules that dictate what type of shape should be generated, given 8 vertices of a cube.
Each vertex holds a single bit of data: whether it is inside or outside of the shape.
By knowing which of the 8 vertices are inside the shape, we can calculate the mesh segment inside that cube, meaning a total of 256 possible shapes. With this algorithm, we can simply calculate the mesh from within as many adjacent cubes as we need, hence 'marching'.

If a more advanced algorithm is needed for smoother shapes, each vertex can represent a floating point number, which defines how solid that vertex is.
By defining how solid each vertex is, we can calculate the exact contour position between each pair of vertices, allowing us to generate smoother meshes (or rather, a much larger array of possible meshes).

Combine that algorithm with a 3d procedural noise algorithm and you have an interesting procedural terrain system.

In revisiting this project, I learnt of a flaw in the original marching cubes algorithm which I had previously faced. Which was the problem of ambiguous faces between adjacent cubes.
Which simply put, is an issue where two adjacent cubes might share similar shapes but both shapes assume the other has a triangle covering the hole in between. (So neither shape covers the hole).
This time around I designed a solution, resulting in a much better implementation.

Overall, the project turned out rather well. But due to it being built with the Unreal Blueprints language, it did not perform as well as expected.
Which ultimately marked the end of this project, lest it be reimplemented again in a more performant language.`,},

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
        Edit: "Jan 24th 2024",
        Link: [{desc:"channel dedicated to my creations", type:"youtube", url:"https://www.youtube.com/@gamergotten/videos"},
               {desc:"complete collection of source files", type:"github", url:"https://github.com/Gamergotten/RVT-Gametypes"}],
        imgp: "Resources/Examples/MS/MS_1.png",
        img1: "Resources/Examples/MS/MS_1.png",
        img2: "Resources/Examples/MS/MS_2.png",
        img3: "Resources/Examples/MS/MS_3.png",
        deps: ["vs_code","megalo"],
        Desc: 
`After gaining expertise in the Megaloscript languages, i started working on more ambitious Megaloscript projects.
The goal of these projects were to bring entirely new & unique experiences to all players of Halo MCC.
Which mostly entailed bringing various forms of AI/NPCs to the Custom Games Browser.

The first and most popular of these projects was my attempt at a players vs zombies experience.
Originally it was only designed as a test to see how convincing the AI could be. 
But was turned into a full-scale project upon the realization that these AI could animate and behave almost exactly as users would expect them to.

Following the development of this mode, a lot of interest was shown by the Halo community, as having AI in multiplayer was not currently a feature in the game.
With growing interest came growing demands for this project, which eventually lead this experience to be more than a simple mod.
The finished project ended up with countless features (objectives, AI customization, currency systems, etc), and complete customizability for users of the mod.
The users could completely customize how the experience played, what the objectives were, how easy it was and so on, even customizing the player death mechanic in various ways.


Another highly popular mod was the Scarab project (although not as popular), which was aimed to be a massive reimagination of the popular 'Invasion' experience. 
'Invasion' being an asymmetric player vs player game mode, where 2 teams of players would take turns at attacking and defending numerous objectives, featuring probably the most immersive Halo multiplayer experience. 

The key idea behind the scarab project was the focus of the large AI controlled scarab vehicle (an iconic Halo quadruped vehicle).
Like Invasion there would be two teams, one who has to defend and the other attacking.
However, as a part of this reimagination process, it was decided that both teams should have the opportunity to defend and attack, simultaneously.
One team would be defending the scarab AI, while it would be attacking the base of the opposing team.
The other team would be defending their base, as well as attacking the scarab AI.

In a way this allowed the game mode to maintain its asymmetric objective, but have an opportunity for either team to win, without having to run another round to swap roles. Which was perfect for this mode as the average round time was around 30 minutes.

Aside from the gameplay, what really blew players away was the fact that the AI scarab was even possible.
For nearly 8 years, there had not been a single experience like it. Nor one anywhere as advanced.
And of course if not for my artistic genius of a friend, Mr Dr Milk, the experience would not have been as nearly as fantastic.


Throughout my time spent working with Megaloscript, the limitations were pushed to incredible lengths to allow these things to even exist.
Partly due to flaws in the Language, and partly due to my effort to push the language as far as i possibly could.

One of my favourite flaws in the language was a way to compute floating point maths, in this language that lacked floating point number support.
The exploit was relying on variables outside of the language to do the maths for me, which ended up being the shield & health values of playable characters.
The Megaloscript language had no float variables, but it did allow modifying the shield & health values of characters. Which as it turned out were stored in-engine as floating-point numbers.

The maths becomes slightly complicated, as the original developers had made errors within the code interpreter, where regardless of the operator it would divide the operand by 100.
So, to half a floating point number, you would have to divide it by 200 (because 'X / 200' would then become 'X / 2').
There were numerous limitations with this technique, but it did at least allow floating point calculations, which was just enough to implement the Arc Cosine function into Megaloscript.
And by having the Arc cosine function, we could utilize inverse kinematics for the scarab vehicle's legs, which may be one of the most impressive feats in halo modding to date.


Collectively these projects reached millions of viewers, and somewhere in the realm of hundreds of thousands of players.
It proved a great opportunity to hear from so many players, what they did like, and what they did not.
Which allowed me to continually improve the experiences so that everyone could get what they wanted out of them.`,},


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


