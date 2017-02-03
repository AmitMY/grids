import fs from "fs";

function getProp(grid, field = "") {
    let fields = field.split(".");
    let param = grid;
    while (fields.length != 0)
        param = param[fields.shift()];

    return param;
}

class Render {
    static link(str, title = "Link") {
        return "["+title+"](" + str + ")";
    }

    static image(str, title = "Image") {
        return "!["+title+"](" + str + ")";
    }

    static stars(str) {
        return str + " :star:";
    }

    static framework(str) {
        return Render.image("assets/frameworks/" + str.toLowerCase() + ".png", str);
    }

    static array(mapper) {
        return (arr) => arr.map(mapper).join(", ");
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

        return "!["+color+"](http://placehold.it/20/"+c+"/000000?text=+)"
    }

    static boolStringNull(any) {
        if (typeof any === "string")
            return Render.link(any);

        if (any === null)
            return Render.color("yellow");

        if (any === true)
            return Render.color("green");

        return this.color("red");
    }
}

let clearRow = {
    title: "-",
    renderer: () => "-"
};

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
    },{
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
    }, clearRow
];

function createRow(array, title = "") {
    return "|**" + title + "**|" + array.join("|") + "|";
}

function createTable(data) {
    let table = [];

    table.push(createRow(data.map(grid => grid.info.name), "/"));
    table.push(Array.from(table[0]).map(c => (c == "|") ? "|" : "-").join(""));

    rows.forEach(param => {
        table.push(createRow(data.map(grid => getProp(grid, param.field)).map((item) => {
            if (param.renderer)
                return param.renderer(item, param.title);
            return item;
        }), param.title));
    });

    return table;
}

function writeTable(str) {
    fs.readFile("README-header.md", (err, data) => {
        fs.writeFile("README.md", data + "\n\n" + str);
    });
}

const gridsFolder = "grids";

fs.readdir(gridsFolder, (err, files) => {
    let grids = [];
    files.forEach(file => {
        fs.readFile(gridsFolder + "/" + file, (err, data) => {
            grids.push(JSON.parse(data));
            if (grids.length == files.length)
                writeTable(createTable(grids).join("\n"));
        });
    });
});