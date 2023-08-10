

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
        img.src = src;
        img.style["display"] = "inline-block";
    } else {
        ui.className = "c_i_i_trioframe";
        img.src = null;
        img.style["display"] = "none";
}}
function expand_item(){
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

    document.getElementById("focus_overview").innerText = project.Basc;
    document.getElementById("focus_desc").innerText = project.Desc;

    // setup images
    //config_trio_image(document.getElementById("focus_imgF"), project.img1);
    config_trio_image(document.getElementById("focus_frame1"), project.img1);
    config_trio_image(document.getElementById("focus_frame2"), project.img2);
    config_trio_image(document.getElementById("focus_frame3"), project.img3);

    // reset selected image status
    select_image1();

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
    item.style["border-bottom"] = "2px solid #ff5c00";
    currently_expanded_item = item; // this so when pressed again, can be hidden
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
        imgp: "Resources/Examples/RE/RE_1.png",
        img1: "Resources/Examples/RE/RE_1.png",
        img2: "Resources/Examples/RE/RE_2.png",
        img3: "Resources/Examples/RE/RE_3.png",
        deps: ["visual_studio","cpp","ghidra"],
        Desc: 
`
`,
    },
    example2: {
        name: "Javasqiggle",
        Date: "2023",
        Basc: "Multiplayer 3D Browser Game",
        imgp: "Resources/Examples/JS/JS_1.png",
        img1: "Resources/Examples/JS/JS_1.png",
        img2: "Resources/Examples/JS/JS_2.png",
        img3: "Resources/Examples/JS/JS_3.png",
        deps: ["vs_code","javascript","htmlcss","opengl","peerjs"],
        Desc: 
`Javasqiggle
`,
    },
    example3: {
        name: "Codename Atriox",
        Date: "2023",
        Basc: "Array of WIP Halo-Infinite Tools",
        imgp: "Resources/Examples/CA/CA_1.png",
        img1: "Resources/Examples/CA/CA_1.png",
        img2: "Resources/Examples/CA/CA_2.png",
        img3: "",
        deps: ["visual_studio","cpp","directx","dear_imgui","csharp","wpf"],
        Desc: 
`Codename Atriox (CA) 
`,
    },

    // //////////////// //
    // 2022 HIGHLIGHTS //
    // ////////////// //
    example4: {
        name: "UE5 marching cubes",
        Date: "2022",
        Basc: "UE5 Procedural terrain",
        imgp: "Resources/Examples/MC/MC_3.png",
        img1: "Resources/Examples/MC/MC_3.png",
        img2: "Resources/Examples/MC/MC_1.png",
        img3: "Resources/Examples/MC/MC_2.png",
        deps: ["unreal_engine","blueprints"],
        Desc: 
`A revisitation to an older project of mine, where i had previously partially implemented the marching cubes algorithm in Unreal Engine 4.
The aim of this project was to fully implement the marching cubes algorithm into unreal engine 5, with full smoothing implemented.

Something that i've always enjoyed is making content that makes itself. Procedural generation or AI or any of that stuff.
On several occasions i had implemented different techniques of procedural terrain generation in game engines, most notable was my previous marching cubes implementation.

So given that the project was originally incomplete, i had decided to revisit & finally finish it. In the process i also upgraded to a newer game engine.

The marching cubes algorithm itself is a simple set of rules that dictate what type of shape should be generated, given 8 verticies on a cube.
Each vertex holds a single bit of data: whether it is inside or outside of the shape.
By knowning which of the 8 verticies are inside the mesh, we can calculate the shape inside that cube, for a total possible of 256 shapes.

If a more advanced algorithm is needed for smoother shapes, each vertex can represnt a floating point number, which defines how solid that vertex is.
by defining how solid each vertex is, we can calculate the exact contour offset between each pair of verticies, allowing smoother shapes.

Combine that algorithm with a 3d procedural noise algorithm and you have an interesting procedural terrain system.

In revisiting this project, i learnt of a flaw in the original marching cubes algorithm which i had previously faced. Which was the problem of ambiguous faces between adjucant cubes.
This time around i desinged a solution, resulting in a much better implementation.

Overall, the project turned out rather well. But due to it being built with the Unreal blueprints language, it did not perform as well as expected.
Which ultimately marked the end of this project, lest it be reimplemented again in a more performant language.
Otherwise, this project could have led to the development of a roguelike game that had been on my mind for a while.`,},


    example5: {
        name: "Megaloscript RE",
        Date: "2022",
        Basc: "Megaloscript RE & Documentation",
        imgp: "Resources/Examples/ME/ME_1.png",
        img1: "Resources/Examples/ME/ME_1.png",
        img2: "Resources/Examples/ME/ME_2.png",
        img3: "Resources/Examples/ME/ME_3.png",
        deps: ["ghidra","x64dbg"],
        Desc: 
`
`,},


    example6: {
        name: "Megaloscript Mods",
        Date: "2022",
        Basc: "Popular Megaloscript Mods",
        imgp: "Resources/Examples/MS/MS_1.png",
        img1: "Resources/Examples/MS/MS_1.png",
        img2: "Resources/Examples/MS/MS_2.png",
        img3: "Resources/Examples/MS/MS_3.png",
        deps: ["vs_code"],
        Desc: 
`After gaining expertise in the Megaloscript languages, i started working on more ambitous Megaloscript projects.
The goal of these projects were to bring entirely unqiue and new experiences to all players of Halo MCC.
Which mostly entailed bringing forms of AI to the Custom Game Browser.

The first and most popular of these projects was my attempt at a players vs zombies experience.
Oringially it was only designed as a test to see how convincing the AI could be. 
But was turned into a full scale project upon the realization that these AI could animate and behave as any user would expect them to.
Which was not expected, else the project would have been abandonded.

Following the development of this mode, a lot of interest was shown by the Halo community, as having AI in multiplayer was not a feature in the game.
With growing interest came growing demands for this project, which eventually lead this experience to be more than a simple mod.
The finished project ended up with countless features (objectives, AI customization, currency systems, etc), and complete customizability for users of the mod.
The users could completely customize how the experience played, what the objectives were, how easy it was and so on, even customizing what happened to players after they had died.

Another highly popular mod was the Scarab project, which was aimed to be a massive reimagination of the popular 'Invasion' experience. 
'Invasion' being an asymmetric PvP experience, where teams of players would take turns at attacking and defending numerous objectives, featuring probably the most immersive Halo PvP experience. 

The key idea behind the scarab project was the focus of the large AI controlled scarab vehicle (an iconic Halo quadruped vehicle).
Similar to Invasion there would be two teams, one who has to defend and the other attacking.
However as a part of this reimagination process, it was decided that both teams had the opportunity to defend and attack, simutaneously.
One team would be defending the scarab AI, while it would be attacking the base of the opposing team.
The other team would be defending their base, along with attacking the scarab AI.

In a way this allowed the gamemode to maintain its asymmetric objective, but have an opportunity for either team to win, without having to swap roles. Which was perfect for this mode as the average round time was around 30 minutes.

Aside from the gameplay, what really blew players away was the fact that the AI scarab was even possible.
For nearly 8 years, there had not been a single experience like it. Nor one anywhere as advanced.
And of course if not for my artistic genius of a friend, mr dr milk, the experience would not have been as nearly as fantastic.


Throughout my time spent working with Megaloscript, the limitations were pushed to incredible lengths to allow my projects to exist.
Partly due to flaws in the Language, and partly due to my effort to push the language as far as i possibly could.

One of my favorite flaws in the language was a way to compute floating point maths, in a language that lacked floating point numbers.
The exploit was relying on variables outside of the language to do the maths for us, which ended up being the shield & health values of playable characters.
The Megaloscript language had no float variables, but it did allow modifying the shield & health values of characters. Which as it turned out were floating point numbers.

The maths becomes slightly complicated, as the original devepers had made errors within the code interpretter, where regardless of the operator it would divide the opperand by 100.
so to half a floating point number, you would have to divide it by 200.
There were numerous limitations with this technique, but it did at least allow floating point calculations, which was just enough to implement the Arc cosine function into Megaloscript.
And by having the Arc cosine function, we could utilize inverse kinematics for the scarab vehicle's legs, which may be one of the most impressive feats in halo modding to date.


At the time those projects were developed and released, there were no PvE (Player vs Enemy) experiences available to the MCC Custom Game Browser.
Which 


These projects





... something 100,000 players
... something 1,000,000 viewers



`,},


    // //////////////// //
    // 2021 HIGHLIGHTS //
    // ////////////// //
    example7: {
        name: "Megalograph",
        Date: "2021",
        Basc: "Visual Megaloscript Compiler",
        imgp: "Resources/Examples/MG/MG_2.png",
        img1: "Resources/Examples/MG/MG_2.png",
        img2: "Resources/Examples/MG/MG_3.png",
        img3: "Resources/Examples/MG/MG_1.png",
        deps: ["visual_studio","csharp","wpf", "hxd"],
        Desc: 
`Megalograph is a fully graphical code compiler & decompiler targeted towards the propriety Megaloscript language. Supporting 3 unqiue variants of the target language.
To allow this, Megalograph hosts its own unique node-based programming language, which can be called "Megalograph", which can decompile/compile to either 3 Megaloscript variants.

The need for this project arose from the fact that there were no tools that filled its place. (at least until long after its release)
It filled the place of a compiler for the H2A variant of the Megaloscript language, a language which was previously unknown.

The project began with researching the H2A Megaloscript variant, when the differences between that version and the others were understood, the actual tool could begin development.
For the tool itself, it was decided that a graphical node-based language would be used to represent the unknown propriety Megaloscript language.
Which essentially meant designing the Megaloscript language myself, although since Megaloscript is an interpretted language, the core functionality didn't need designing. So it was merely a task of designing the language's syntax.

The idea for a node based language was inspired by Unreal Engine's Blueprint system, which provides a unique and intuitive programming experience.
It also allowed breaking the language down into something much simpler than can be achieved by text based code, which would help users understand the Megaloscript language much better.

By using a node based language, it means that the code is impossible to have syntax errors. Which means that its generally easier to work with.
However the code is slightly harder to work with, in a 2 dimensional state. Partly because it requires greater organization skills, and partly because it creates an excess of unneeded bloat, which just gets in the way of making code.

And for those reasons, is why this was a hobby project, and not intended for public use.

Once the language was desinged and implemented, then support was added for the 2 other Megaloscript variants.
Along with a plethora of helpful features, such as: block comments, node searching, variable names & so on.

The only other tool that matches compatibility with all major Megaloscript variants is the propriety Megaloscript compiler, developed by 343 industries as the official tool to compile Megaloscript.
That tool was recently released in 2022, more than a year after the release of Megalograph.

However, Megalograph provides the functionality to decompile Megaloscripts, meaning that it has native compatibility with every other tool that compiles Megaloscript.
Unlike the official compiler, which lacks support for reading Megalosrcipt compiled from other tools.

All-together this project was great opportunity to explore the C# WPF UI framework, and develop my programming & UI development skills`,},


    example8: {
        name: "IRTV",
        Date: "2021",
        Basc: "Halo-Infinite Realtime Modding Tool",
        imgp: "Resources/Examples/IRTV/IRTV_1.png",
        img1: "Resources/Examples/IRTV/IRTV_1.png",
        img2: "Resources/Examples/IRTV/IRTV_2.png",
        img3: "Resources/Examples/IRTV/IRTV_3.png",
        deps: ["visual_studio","csharp","wpf","cheat_engine"],
        Desc: 
`Halo Infinite Runtime Tag-Viewer (IRTV) is an intuitive, user friendly tool for creating & applying game modifications to Halo Infinite.

Initially this tool was designed as a research framework, to understand the underlying game engine behind the game Halo Infinite.
As demand grew for a functional modding tool for Halo Infinite, this tool recieved a lot of attention, and was soon modified to meet demands.

The attention grew not only from users interested in making modifications to the game, but also other modders who desired to be apart of the future of game modding for Halo Infinite.
within a few weeks the development team rose from just myself, to about 13 people, and countless other people who helped out from a less technical standpoint.

Following, millions of lines of code would be committed the project, and potentially thousands of users downloading and using the tool.

Due to popularity we even partnered with one of the largest Online Halo communities (HaloCustoms.com), to provide a convenient place for users to download & share their mods generated with this tool.

... fill in more here
... something pathway of halo modding
... something better than alternative tools

This was definitely one of my biggest projects, both in scope and demand. It provided an excellent opportunity to become familiar with the C# software development framework.
It also provided a great opportunity to learn about meeting and managing the demands of a moderate-to-large user-base.`,},


    example9: {
        name: "HPS",
        Date: "2021",
        Basc: "Halo-MCC Realtime Cosmetics Modifer",
        imgp: "Resources/Examples/HPS/HPS_1.png",
        img1: "Resources/Examples/HPS/HPS_1.png",
        img2: "Resources/Examples/HPS/HPS_2.png",
        img3: "Resources/Examples/HPS/HPS_3.png",
        deps: ["visual_studio","csharp","winforms","cheat_engine"],
        Desc: 
`HaloPogSwitch (HPS) is a realtime armor/cosmetics switching tool, supporting 3 seperate halo games: Halo Reach, Halo 4 & Halo 2 Anniversary.

Originally starting off as researching various hidden cosmetics & Halo's cosmetic synchronization system, it soon became a fully featured tool for users to change their characters mid-match. Including the possibility to use previosly unused/locked cosmetics.

After the concept was proven with the research, a few other members of the Halo community joined along to assist with the tool's development.
Because this was our first time developing software, we had opted to use a more basic framework for the tool. Which was the WinForms framework.
The WinForms framework provided a relatively simple set of tools which allowed easily building user interfaces.
However due to the simplicity of the framework, it lead to numerous issues with development, which were eventually resolved. 

For the actually functionality of the tool (providing realtime cosmetics switching) we had decided on using the Memory.dll nuget package.
Which provided a lot of out of the box functionality for reading & writing the RAM of another windows process. Allowing us to effectively interface our tool with the Halo windows processes.

It was the first standalone executable program i had worked on, although most of the interface & functionality was designed by team member Cozi. My part was mostly interfacing the tool with the Halo window processes.
But because of the opportunity to see firsthand how software could be developed, this inspired me to learn more about making software, which has since led me on a pathway to learning numerous programming frameworks and languages`,},

}


