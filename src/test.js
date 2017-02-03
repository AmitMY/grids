import test from "tape";
import fs from "fs";
import {isURL} from "./helper";


const gridsFolder = "grids";
fs.readdir(gridsFolder, (err, files) => {
    let grids = [];
    files.forEach(file => {
        fs.readFile(gridsFolder + "/" + file, (err, data) => {
            grids.push(new GridFile(file, JSON.parse(data)));
            if (grids.length == files.length)
                grids.forEach(grid => grid.test());
        });
    });
});

const allowedFrameworks = ["Javascript", "jQuery", "Angular1", "Angular2", "React", "Aurelia", "Web Components"];
const allowedFormats = ["CSV", "XLSX", "PDF"];
const allowedFilters = ["Text", "Number", "Date", "Set", "Custom"];
const allowedAggregation = ["Sum", "Average", "Min", "Max", "First", "Last", "Custom"];
const allowedKeyboardKeys = ["Arrows", "Enter", "Tab", "Page", "Home", "End", "UNDO/REDO"];
const allowedCharts = ["Line", "Pie"];

class GridFile {
    constructor(file, data) {
        this.file = file;
        this.data = data;
    }

    test() {
        test(this.file + " is global information valid", (assert) => {
            assert.equal(typeof this.data.lastEditor, "string", "Grid's last editor must be a string");
            assert.end();
        });
        this.testInfo();
        this.testFeatures();
    }

    testInfo() {
        let info = this.data.info;
        test(this.file + " Information should have all properties with the correct types", (assert) => {
            assert.equal(typeof info, "object", "Grid's info must be a string");

            // Global information
            assert.equal(typeof info.name, "string", "Grid's info name must be a string");
            assert.equal(typeof info.logo, "string", "Grid's info logo must be a string");
            if (info.logo !== "")
                assert.ok(isURL(info.logo), "Grid's info logo must be a URL");
            assert.equal(typeof info.description, "string", "Grid's info description must be a string");
            assert.equal(typeof info.license, "string", "Grid's info license must be a string");
            assert.equal(typeof info.price, "string", "Grid's info price must be a string");
            assert.equal(typeof info.techSupport, "boolean", "Grid's info techSupport must be a boolean");

            // Repository information
            if (info.repository !== null) {
                assert.equal(typeof info.repository, "object", "Grid's info repository must be a string");
                assert.equal(typeof info.repository.link, "string", "Grid's info repository link must be a string");
                assert.ok(isURL(info.repository.link), "Grid's info repository link must be a URL");
                assert.equal(typeof info.repository.stars, "number", "Grid's info repository stars must be a number");
            }

            // Website information
            if (info.website !== null) {
                assert.equal(typeof info.website, "object", "Grid's info website must be a object or null");
                assert.equal(typeof info.website.link, "string", "Grid's info website link must be a string");
                assert.ok(isURL(info.website.link), "Grid's info website link must be a URL");
                assert.equal(typeof info.website.demo, "string", "Grid's info website demo must be a string");
                assert.ok(isURL(info.website.demo), "Grid's info website demo must be a URL");
            }

            // Frameworks
            assert.equal(Array.isArray(info.frameworks), true, "Grid's info frameworks must be an array");
            info.frameworks.forEach(framework => {
                assert.notEqual(allowedFrameworks.indexOf(framework), -1, framework + " must be a familiar framework");
            });

            // Layouts
            if (info.layoutThemes !== null)
                assert.equal(Array.isArray(info.layoutThemes), true, "Grid's info layoutThemes must be an array");

            assert.end();
        });
    }

    validateBooleansLinks(name, obj, booleans, assert) {
        const validBullLink = (val, nullable = false) => {
            if (nullable && val === null)
                return true;

            if (typeof val == "boolean")
                return true;

            return typeof val == "string" && isURL(val);
        };

        // All booleans
        Object.keys(booleans).forEach(key => {
            if (!booleans[key]) {
                if (obj[key] !== null)
                    assert.ok(validBullLink(obj[key]), "Grid's " + name + " " + key + " must be a boolean, a url or null");
            } else
                assert.ok(validBullLink(obj[key]), "Grid's " + name + " " + key + " must be a boolean or a url");
        });
    }

    testFeatures() {
        let features = this.data.features;

        const booleans = {
            animations: false,
            customIcons: false,
            customOverlays: false,
            globalSearch: true,
            internationalisation: false,
            masterSlave: true,
            pagination: true,
            pivoting: true,
            print: true,
            RTLSupport: false,
            statusBar: true,
            touchSupport: true,
            virtualPagination: true
        };

        test(this.file + " Features should have all properties with the correct types", (assert) => {
            assert.equal(typeof features, "object", "Grid's features must be a string");

            this.validateBooleansLinks("features", features, booleans, assert);

            // Export
            if (features.export !== null) {
                assert.equal(Array.isArray(features.export), true, "Grid's features export must be an array");
                features.export.forEach(format => {
                    assert.notEqual(allowedFormats.indexOf(format), -1, format + " must be a familiar export format");
                });
            }

            // Visualisation
            if (features.visualisation !== null) {
                assert.equal(Array.isArray(features.visualisation), true, "Grid's features visualisation must be an array or null");
                features.visualisation.forEach(chart => {
                    assert.notEqual(allowedCharts.indexOf(chart), -1, chart + " must be a familiar chart type");
                });
            }


            assert.end();
        });
        this.testColumns();
        this.testRows();
        this.testCells();
    }

    testColumns() {
        let columns = this.data.features.columns;

        const booleans = {
            menu: true,
            filtering: true,
            grouping: true,
            headerRendering: false,
            pinning: true,
            validation: true,
            reorder: true,
            resizing: true,
            selection: true,
            sorting: true
        };

        test(this.file + " Features columns should have all properties with the correct types", (assert) => {
            assert.equal(typeof columns, "object", "Grid's features columns must be a string");

            this.validateBooleansLinks("columns", columns, booleans, assert);

            // Filters
            if (columns.filterTypes !== null) {
                assert.equal(Array.isArray(columns.filterTypes), true, "Grid's features columns filterTypes must be an array");
                columns.filterTypes.forEach(filter => {
                    assert.notEqual(allowedFilters.indexOf(filter), -1, filter + " must be a familiar filter type");
                });
            }

            // Aggregation
            if (columns.aggregation !== null) {
                assert.equal(Array.isArray(columns.aggregation), true, "Grid's features columns aggregation must be an array or null");
                columns.aggregation.forEach(func => {
                    assert.notEqual(allowedAggregation.indexOf(func), -1, func + " must be a familiar aggregation function");
                });
            }

            assert.end();
        });
    }

    testRows() {
        let rows = this.data.features.rows;

        const booleans = {
            contextMenu: true,
            dynamicHeight: true,
            dynamicInsert: true,
            dynamicRemove: true,
            floating: true,
            fullWidth: true,
            grouping: true,
            numbering: true,
            selection: true,
            virtualDOM: true
        };

        test(this.file + " Features rows should have all properties with the correct types", (assert) => {
            assert.equal(typeof rows, "object", "Grid's features rows must be a string");

            this.validateBooleansLinks("rows", rows, booleans, assert);

            assert.end();
        });
    }

    testCells() {
        let cells = this.data.features.cells;

        const booleans = {
            clipboard: true,
            customRendering: true,
            editing: true,
            formula: false,
            merge: true,
            rangeSelection: true,
            styling: true
        };

        test(this.file + " Features cells should have all properties with the correct types", (assert) => {
            assert.equal(typeof cells, "object", "Grid's features cells must be a string");

            this.validateBooleansLinks("cells", cells, booleans, assert);

            // Aggregation
            if (cells.keyboardNavigation !== null) {
                assert.equal(Array.isArray(cells.keyboardNavigation), true, "Grid's features cells aggregation must be an array or null");
                cells.keyboardNavigation.forEach(key => {
                    assert.notEqual(allowedKeyboardKeys.indexOf(key), -1, key + " must be a familiar keyboard key/key-set");
                });
            }

            assert.end();
        });
    }
}