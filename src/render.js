import fs from "fs";
import {equals, isURL} from "./helper";
import request from "sync-request";

function getProp(grid, field = "") {
    let fields = field.split(".");
    let param = grid;
    while (fields.length != 0)
        if (typeof param === "object" && param !== null)
            param = param[fields.shift()];
        else return undefined;

    return param;
}

function getRepository(repository) {
    try {
        let res = request("GET", "https://api.github.com/repos/" + repository, {
            "headers": {
                "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36."
            }
        });
        return JSON.parse(res.getBody('utf8'));
    } catch (ex) {
        return null;
    }
}

class Render {
    static link(str, title = "Link") {
        return "[" + title + "](" + str + ")";
    }

    static image(str, title = "Image") {
        if (str === null)
            return "";
        return "![" + title + "](" + str + ")";
    }

    static repository(repository) {
        return Render.link("https://github.com/" + repository);
    }

    static stars(stars) {
        return Number(stars).toLocaleString() + " :star:";
    }

    static framework(str) {
        return Render.image("https://raw.githubusercontent.com/AmitMY/grids/master/assets/frameworks/" + str.toLowerCase() + ".png", str);
    }

    static format(str) {
        if (["XLS", "XLSX", "PDF"].indexOf(str) != -1)
            return Render.image("https://raw.githubusercontent.com/teambox/Free-file-icons/master/32px/" + str.toLowerCase() + ".png", str);
        return str;
    }

    static array(mapper = null, join = ",") {
        return (arr) => {
            if (arr === null)
                return Render.boolLinkNull(false);
            if (mapper !== null)
                arr = arr.map(mapper);
            return arr.join(join + " ");
        };
    }

    static color(color) {
        let c;
        switch (color) {
            case "green":
                c = "c5f015";
                break;
            case "red":
                c = "f03c15";
                break;
            default:
                c = "1589F0";
        }

        return "![" + color + "](http://placehold.it/23/" + c + "/000000?text=+)"
    }

    static boolLinkNull(any) {
        if (typeof any === "string")
            return Render.color("green") + " " + Render.link(any, ":book:");

        if (any === null)
            return Render.color("blue");

        if (any === true)
            return Render.color("green");

        return Render.color("red");
    }
}

let clearRow = (title = "-") => new Object({
    title: title,
    mandatory: true,
    renderer: () => ""
});

const rows = [
    {
        title: "Logo",
        field: "info.logo",
        renderer: Render.image
    }, {
        title: "Frameworks",
        field: "info.frameworks",
        renderer: Render.array(Render.framework, "")
    }, {
        title: "Description",
        field: "info.description"
    }, {
        title: "License",
        field: "info.license"
    }, {
        title: "Price",
        field: "info.price"
    }, {
        title: "Repository",
        field: "info.repository.html_url",
        renderer: Render.link
    }, {
        title: "Stars",
        field: "info.repository.stargazers_count",
        renderer: Render.stars
    }, {
        title: "Themes",
        field: "info.layoutThemes",
        renderer: Render.array()
    }, {
        title: "Website",
        field: "info.website.link",
        renderer: Render.link
    }, {
        title: "Demo",
        field: "info.website.demo",
        renderer: Render.link
    }, {
        title: "Tech Support",
        field: "info.techSupport",
        renderer: Render.boolLinkNull
    }, clearRow(), clearRow("General"), {
        title: "Pivot Mode",
        field: "features.pivoting",
        renderer: Render.boolLinkNull
    }, {
        title: "Print Mode",
        field: "features.print",
        renderer: Render.boolLinkNull
    }, {
        title: "Export",
        field: "features.export",
        renderer: Render.array(Render.format)
    }, {
        title: "Pagination",
        field: "features.pagination",
        renderer: Render.boolLinkNull
    }, {
        title: "Virtual Pagination",
        field: "features.virtualPagination",
        renderer: Render.boolLinkNull
    }, clearRow(), clearRow("Rows"), {
        title: "Rows Grouping",
        field: "features.rows.grouping",
        renderer: Render.boolLinkNull
    }, {
        title: "Floating Rows",
        field: "features.rows.floating",
        renderer: Render.boolLinkNull
    }, {
        title: "Context Menu",
        field: "features.rows.contextMenu",
        renderer: Render.boolLinkNull
    }, {
        title: "Full Width Rows",
        field: "features.rows.fullWidth",
        renderer: Render.boolLinkNull
    }, {
        title: "Rows Numbering",
        field: "features.rows.numbering",
        renderer: Render.boolLinkNull
    }, {
        title: "Rows Selection",
        field: "features.rows.selection",
        renderer: Render.boolLinkNull
    }, {
        title: "Virtual DOM",
        field: "features.rows.virtualDOM",
        renderer: Render.boolLinkNull
    }, {
        title: "Dynamic Add Rows",
        field: "features.rows.dynamicInsert",
        renderer: Render.boolLinkNull
    }, {
        title: "Dynamic Remove Rows",
        field: "features.rows.dynamicRemove",
        renderer: Render.boolLinkNull
    }, {
        title: "Dynamic Row Height",
        field: "features.rows.dynamicHeight",
        renderer: Render.boolLinkNull
    }, clearRow(), clearRow("Columns"), {
        title: "Filtering",
        field: "features.columns.filtering",
        renderer: Render.boolLinkNull
    }, {
        title: "Filters",
        field: "features.columns.filterTypes",
        renderer: Render.array()
    }, {
        title: "Sorting",
        field: "features.columns.sorting",
        renderer: Render.boolLinkNull
    }, {
        title: "Pinning",
        field: "features.columns.pinning",
        renderer: Render.boolLinkNull
    }, {
        title: "Reordering",
        field: "features.columns.reorder",
        renderer: Render.boolLinkNull
    }, {
        title: "Resizing",
        field: "features.columns.resizing",
        renderer: Render.boolLinkNull
    }, {
        title: "Header Grouping",
        field: "features.columns.grouping",
        renderer: Render.boolLinkNull
    }, {
        title: "Selection",
        field: "features.columns.selection",
        renderer: Render.boolLinkNull
    }, {
        title: "Column Menu",
        field: "features.columns.menu",
        renderer: Render.boolLinkNull
    }, {
        title: "Aggregation",
        field: "features.columns.aggregation",
        renderer: Render.array()
    }, {
        title: "Header Rendering",
        field: "features.columns.headerRendering",
        renderer: Render.boolLinkNull
    }, clearRow(), clearRow("Cells"), {
        title: "Custom Rendering",
        field: "features.cells.customRendering",
        renderer: Render.boolLinkNull
    }, {
        title: "Formula Support",
        field: "features.cells.formula",
        renderer: Render.boolLinkNull
    }, {
        title: "Inline Editing",
        field: "features.cells.editing",
        renderer: Render.boolLinkNull
    }, {
        title: "Validation",
        field: "features.cells.validation",
        renderer: Render.boolLinkNull
    }, {
        title: "Custom styling",
        field: "features.cells.styling",
        renderer: Render.boolLinkNull
    }, {
        title: "Clipboard",
        field: "features.cells.clipboard",
        renderer: Render.boolLinkNull
    }, {
        title: "Keyboard Navigation",
        field: "features.cells.keyboardNavigation",
        renderer: Render.array()
    }, {
        title: "Range Selection",
        field: "features.cells.rangeSelection",
        renderer: Render.boolLinkNull
    }, {
        title: "Merge Cells",
        field: "features.cells.merge",
        renderer: Render.boolLinkNull
    }, clearRow(), clearRow("Nice To Have"), {
        title: "Animations",
        field: "features.animations",
        renderer: Render.boolLinkNull
    }, {
        title: "Custom Icons",
        field: "features.customIcons",
        renderer: Render.boolLinkNull
    }, {
        title: "Custom Overlays",
        field: "features.customOverlays",
        renderer: Render.boolLinkNull
    }, {
        title: "Global Search",
        field: "features.globalSearch",
        renderer: Render.boolLinkNull
    }, {
        title: "Internationalisation",
        field: "features.internationalisation",
        renderer: Render.boolLinkNull
    }, {
        title: "Master/Slave",
        field: "features.masterSlave",
        renderer: Render.boolLinkNull
    }, {
        title: "RTL Support",
        field: "features.RTLSupport",
        renderer: Render.boolLinkNull
    }, {
        title: "Footer",
        field: "features.statusBar",
        renderer: Render.boolLinkNull
    }, {
        title: "Touch support",
        field: "features.touchSupport",
        renderer: Render.boolLinkNull
    }
];

function createRow(array, title = "") {
    return "|**" + title + "**|" + array.join("|") + "|";
}

function createTable(data) {
    let table = [];

    // Sort by name
    data = data.sort((a, b) => a.info.name.localeCompare(b.info.name));

    table.push(createRow(data.map(grid => grid.info.name), "/"));
    table.push(Array.from(table[0]).map(c => (c == "|") ? "|" : "-").join(""));

    rows.forEach(param => {
        let rowData = data.map(grid => getProp(grid, param.field));

        let parsedRowData = (param.renderer == Render.boolLinkNull) ?
            rowData.map(item => (typeof item == "string") ? true : item) :
            rowData;

        // Skip equal rows
        if (!param.mandatory && parsedRowData.every(item => equals(item, parsedRowData[0])))
            return;

        let row = createRow(rowData.map((item) => {
            if (item === undefined)
                return "";

            if (param.renderer)
                return param.renderer(item, param.title);

            if (isURL(item))
                return Render.link(item, param.title);

            return item;
        }), param.title);

        table.push(row);
    });

    return table.join("\n");
}

function writeMainTable(str) {
    fs.readFile("README-header.md", (err, data) => {
        fs.writeFile("README.md", data + "\n\n" + str);
    });
}

function createTables(grids) {
    grids.forEach(grid => {
        if(grid.info.repository !== null)
            grid.info.repository = getRepository(grid.info.repository);
    });

    writeMainTable(createTable(grids));

    for (let i = 0; i < grids.length; i++)
        for (let j = i + 1; j < grids.length; j++) {
            let data = [grids[i], grids[j]];
            let name = grids[i].info.name + "." + grids[j].info.name;
            fs.writeFile("differences/" + name + ".md", createTable(data));
        }
}

const gridsFolder = "grids";

fs.readdir(gridsFolder, (err, files) => {
    let grids = [];
    files.forEach(file => {
        fs.readFile(gridsFolder + "/" + file, (err, data) => {
            grids.push(JSON.parse(data));
            if (grids.length == files.length)
                createTables(grids);

        });
    });
});