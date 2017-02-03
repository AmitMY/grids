import fs from "fs";
import {equals, isURL} from "./helper"

function getProp(grid, field = "") {
    let fields = field.split(".");
    let param = grid;
    while (fields.length != 0)
        if (typeof param === "object" && param !== null)
            param = param[fields.shift()];
        else return undefined;

    return param;
}

class Render {
    static link(str, title = "Link") {
        return "[" + title + "](" + str + ")";
    }

    static image(str, title = "Image") {
        return "![" + title + "](" + str + ")";
    }

    static stars(str) {
        return str + " :star:";
    }

    static framework(str) {
        return Render.image("https://raw.githubusercontent.com/AmitMY/grids/master/assets/frameworks/" + str.toLowerCase() + ".png", str);
    }

    static array(mapper = null) {
        return (arr) => {
            if (arr === null)
                return Render.boolStringNull(false);
            if (mapper !== null)
                arr = arr.map(mapper);
            return arr.join(", ");
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

        return "![" + color + "](http://placehold.it/20/" + c + "/000000?text=+)"
    }

    static boolStringNull(any) {
        if (typeof any === "string")
            return Render.color("green") + " " + Render.link(any, ":scroll:");

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
        renderer: Render.array(Render.framework)
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
        field: "info.repository.link",
        renderer: Render.link
    }, {
        title: "Stars",
        field: "info.repository.stars",
        renderer: Render.stars
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
        renderer: Render.boolStringNull
    }, clearRow(), clearRow("General"), {
        title: "Pivot Mode",
        field: "features.pivoting",
        renderer: Render.boolStringNull
    }, {
        title: "Print Mode",
        field: "features.print",
        renderer: Render.boolStringNull
    }, {
        title: "Export",
        field: "features.export",
        renderer: Render.array()
    }, {
        title: "Pagination",
        field: "features.pagination",
        renderer: Render.boolStringNull
    }, {
        title: "Virtual Pagination",
        field: "features.virtualPagination",
        renderer: Render.boolStringNull
    }, clearRow(), clearRow("Rows"), {
        title: "Rows Grouping",
        field: "features.rows.grouping",
        renderer: Render.boolStringNull
    }, {
        title: "Floating Rows",
        field: "features.rows.floating",
        renderer: Render.boolStringNull
    }, {
        title: "Context Menu",
        field: "features.rows.contextMenu",
        renderer: Render.boolStringNull
    }, {
        title: "Full Width Rows",
        field: "features.rows.fullWidth",
        renderer: Render.boolStringNull
    }, {
        title: "Rows Numbering",
        field: "features.rows.numbering",
        renderer: Render.boolStringNull
    }, {
        title: "Rows Selection",
        field: "features.rows.selection",
        renderer: Render.boolStringNull
    }, {
        title: "Virtual DOM",
        field: "features.rows.virtualDOM",
        renderer: Render.boolStringNull
    }, {
        title: "Dynamic Add Rows",
        field: "features.rows.dynamicInsert",
        renderer: Render.boolStringNull
    }, {
        title: "Dynamic Remove Rows",
        field: "features.rows.dynamicRemove",
        renderer: Render.boolStringNull
    }, {
        title: "Dynamic Row Height",
        field: "features.rows.dynamicHeight",
        renderer: Render.boolStringNull
    }, clearRow(), clearRow("Columns"), {
        title: "Filtering",
        field: "features.columns.filtering",
        renderer: Render.boolStringNull
    }, {
        title: "Filters",
        field: "features.columns.filterTypes",
        renderer: Render.array()
    }, {
        title: "Sorting",
        field: "features.columns.sorting",
        renderer: Render.boolStringNull
    }, {
        title: "Pinning",
        field: "features.columns.pinning",
        renderer: Render.boolStringNull
    }, {
        title: "Reordering",
        field: "features.columns.reorder",
        renderer: Render.boolStringNull
    }, {
        title: "Resizing",
        field: "features.columns.resizing",
        renderer: Render.boolStringNull
    }, {
        title: "Header Grouping",
        field: "features.columns.grouping",
        renderer: Render.boolStringNull
    }, {
        title: "Selection",
        field: "features.columns.selection",
        renderer: Render.boolStringNull
    }, {
        title: "Validation",
        field: "features.columns.validation",
        renderer: Render.boolStringNull
    }, {
        title: "Column Menu",
        field: "features.columns.menu",
        renderer: Render.boolStringNull
    }, {
        title: "Aggregation",
        field: "features.columns.aggregation",
        renderer: Render.array()
    }, {
        title: "Header Rendering",
        field: "features.columns.headerRendering",
        renderer: Render.boolStringNull
    }, clearRow(), clearRow("Cells"), {
        title: "Custom Rendering",
        field: "features.cells.customRendering",
        renderer: Render.boolStringNull
    }, {
        title: "Formula Support",
        field: "features.cells.formula",
        renderer: Render.boolStringNull
    }, {
        title: "Inline Editing",
        field: "features.cells.editing",
        renderer: Render.boolStringNull
    }, {
        title: "Custom styling",
        field: "features.cells.styling",
        renderer: Render.boolStringNull
    }, {
        title: "Clipboard",
        field: "features.cells.clipboard",
        renderer: Render.boolStringNull
    }, {
        title: "Keyboard Navigation",
        field: "features.cells.keyboardNavigation",
        renderer: Render.array()
    }, {
        title: "Range Selection",
        field: "features.cells.rangeSelection",
        renderer: Render.boolStringNull
    }, {
        title: "Merge Cells",
        field: "features.cells.merge",
        renderer: Render.boolStringNull
    }, clearRow(), clearRow("Nice To Have"), {
        title: "Animations",
        field: "features.animations",
        renderer: Render.boolStringNull
    }, {
        title: "Custom Icons",
        field: "features.customIcons",
        renderer: Render.boolStringNull
    }, {
        title: "Custom Overlays",
        field: "features.customOverlays",
        renderer: Render.boolStringNull
    }, {
        title: "Global Search",
        field: "features.globalSearch",
        renderer: Render.boolStringNull
    }, {
        title: "Internationalisation",
        field: "features.internationalisation",
        renderer: Render.boolStringNull
    }, {
        title: "Master/Slave",
        field: "features.masterSlave",
        renderer: Render.boolStringNull
    }, {
        title: "RTL Support",
        field: "features.RTLSupport",
        renderer: Render.boolStringNull
    }, {
        title: "Footer",
        field: "features.statusBar",
        renderer: Render.boolStringNull
    }, {
        title: "Touch support",
        field: "features.touchSupport",
        renderer: Render.boolStringNull
    }
];

function createRow(array, title = "") {
    return "|**" + title + "**|" + array.join("|") + "|";
}

function createTable(data) {
    let table = [];

    // Sort by name
    data = data.sort((a, b) => a.info.name < b.info.name);

    table.push(createRow(data.map(grid => grid.info.name), "/"));
    table.push(Array.from(table[0]).map(c => (c == "|") ? "|" : "-").join(""));

    rows.forEach(param => {
        let rowData = data.map(grid => getProp(grid, param.field));

        // Skip equal rows
        if (!param.mandatory && rowData.every(item => equals(item, rowData[0])))
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
    writeMainTable(createTable(grids));

    for (let i = 0; i < grids.length; i++)
        for (let j = i + 1; j < grids.length; j++) {
            let data = [grids[i], grids[j]];
            let name = grids[i].info.name + "." + grids[j].info.name;
            fs.writeFile("intersections/" + name + ".md", createTable(data));
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