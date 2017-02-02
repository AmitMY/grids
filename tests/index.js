import test from "tape";
import fs from "fs";

const gridsFolder = "grids";

fs.readdir(gridsFolder, (err, files) => {
    files.forEach(file => {
        fs.readFile(gridsFolder + "/" + file, (err, data) => {
            let gridFile = new GridFile(file, JSON.parse(data));
            gridFile.test();
        });
    });
});


const allowedFrameworks = ["Javascript", "jQuery", "Angular1", "Angular2", "React", "Aurelia", "Web Components"];
const allowedFormats = ["CSV", "XLSX"];
const allowedFilters = ["Text", "Number", "Date", "Select", "Custom"];
const allowedAggregation = ["Sum", "Average", "Min", "Max", "First", "Last", "Custom"];
const allowedKeyboardKeys = ["Arrows", "Enter", "Tab", "Page", "Home", "End"];

class GridFile {
    constructor(file, data) {
        this.file = file;
        this.data = data;
    }

    test() {
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
            assert.equal(typeof info.description, "string", "Grid's info description must be a string");
            assert.equal(typeof info.license, "string", "Grid's info license must be a string");
            assert.equal(typeof info.price, "string", "Grid's info price must be a string");
            assert.equal(typeof info.techSupport, "boolean", "Grid's info techSupport must be a boolean");

            // Repository information
            if (info.repository !== null) {
                assert.equal(typeof info.repository, "object", "Grid's info repository must be a string");
                assert.equal(typeof info.repository.link, "string", "Grid's info repository link must be a string");
                assert.equal(typeof info.repository.stars, "number", "Grid's info repository stars must be a number");
            }

            // Website information
            if (info.website !== null) {
                assert.equal(typeof info.website, "object", "Grid's info website must be a object or null");
                assert.equal(typeof info.website.link, "string", "Grid's info website link must be a string");
                assert.equal(typeof info.website.demo, "string", "Grid's info website demo must be a string");
            }

            // Frameworks
            assert.equal(Array.isArray(info.frameworks), true, "Grid's info frameworks must be an array");
            info.frameworks.forEach(framework => {
                if (allowedFrameworks.indexOf(framework) == -1)
                    assert.equal(true, false, framework + " is an unfamiliar framework");
            });

            // Layouts
            assert.equal(Array.isArray(info.layoutThemes), true, "Grid's info layoutThemes must be an array");
            assert.end();
        });
    }

    testFeatures() {
        let features = this.data.features;

        const booleans = {
            animations: false,
            customIcons: false,
            customOverlays: false,
            globalSearch: true,
            internationalisation: true,
            masterSlave: true,
            pagination: true,
            pivoting: true,
            print: true,
            refresh: false,
            RTLSupport: false,
            statusBar: true,
            touchSupport: true,
            virtualPagination: true
        };

        test(this.file + " Features should have all properties with the correct types", (assert) => {
            assert.equal(typeof features, "object", "Grid's features must be a string");

            // All booleans
            Object.keys(booleans).forEach(key => {
                if (!booleans[key]) {
                    if (features[key] !== null)
                        assert.equal(typeof features[key], "boolean", "Grid's features " + key + " must be a boolean or null");
                } else
                    assert.equal(typeof features[key], "boolean", "Grid's features " + key + " must be a boolean");
            });


            // Export
            assert.equal(Array.isArray(features.export), true, "Grid's features export must be an array");
            features.export.forEach(format => {
                if (allowedFormats.indexOf(format) == -1)
                    assert.equal(true, false, format + " is an unfamiliar export format");
            });

            assert.end();
        });
        this.testColumns();
        this.testRows();
        this.testCells();
    }

    testColumns() {
        let columns = this.data.features.columns;

        const booleans = {
            controlMenu: true,
            filtering: true,
            grouping: true,
            headerRendering: false,
            pinning: true,
            reorder: true,
            resizing: true,
            sorting: true
        };

        test(this.file + " Features columns should have all properties with the correct types", (assert) => {
            assert.equal(typeof columns, "object", "Grid's features columns must be a string");

            // All booleans
            Object.keys(booleans).forEach(key => {
                if (!booleans[key]) {
                    if (columns[key] !== null)
                        assert.equal(typeof columns[key], "boolean", "Grid's features columns " + key + " must be a boolean or null");
                } else
                    assert.equal(typeof columns[key], "boolean", "Grid's features columns " + key + " must be a boolean");
            });


            // Filters
            assert.equal(Array.isArray(columns.customFilters), true, "Grid's features columns customFilters must be an array");
            columns.customFilters.forEach(filter => {
                if (allowedFilters.indexOf(filter) == -1)
                    assert.equal(true, false, filter + " is an unfamiliar filter type");
            });

            // Aggregation
            if (columns.aggregation !== null) {
                assert.equal(Array.isArray(columns.aggregation), true, "Grid's features columns aggregation must be an array or null");
                columns.aggregation.forEach(func => {
                    if (allowedAggregation.indexOf(func) == -1)
                        assert.equal(true, false, func + " is an unfamiliar aggregation function");
                });
            }

            assert.end();
        });
    }

    testRows() {
        let rows = this.data.features.rows;

        const booleans = {
            dynamicHeight: true,
            dynamicInsert: true,
            dynamicRemove: true,
            floating: true,
            fullWidth: true,
            grouping: true,
            selection: true,
            virtualDOM: true
        };

        test(this.file + " Features rows should have all properties with the correct types", (assert) => {
            assert.equal(typeof rows, "object", "Grid's features rows must be a string");

            // All booleans
            Object.keys(booleans).forEach(key => {
                if (!booleans[key]) {
                    if (rows[key] !== null)
                        assert.equal(typeof rows[key], "boolean", "Grid's features rows " + key + " must be a boolean or null");
                } else
                    assert.equal(typeof rows[key], "boolean", "Grid's features rows " + key + " must be a boolean");
            });

            assert.end();
        });
    }

    testCells() {
        let cells = this.data.features.cells;

        const booleans = {
            clipboard: true,
            editing: true,
            expressions: true,
            rangeSelection: true,
            customRendering: true,
            styling: true,
            valueGetters: true
        };

        test(this.file + " Features cells should have all properties with the correct types", (assert) => {
            assert.equal(typeof cells, "object", "Grid's features cells must be a string");

            // All booleans
            Object.keys(booleans).forEach(key => {
                if (!booleans[key]) {
                    if (cells[key] !== null)
                        assert.equal(typeof cells[key], "boolean", "Grid's features cells " + key + " must be a boolean or null");
                } else
                    assert.equal(typeof cells[key], "boolean", "Grid's features cells " + key + " must be a boolean");
            });

            // Aggregation
            if (cells.keyboardNavigation !== null) {
                assert.equal(Array.isArray(cells.keyboardNavigation), true, "Grid's features cells aggregation must be an array or null");
                cells.keyboardNavigation.forEach(key => {
                    if (allowedKeyboardKeys.indexOf(key) == -1)
                        assert.equal(true, false, key + " is an unfamiliar keyboard key");
                });
            }

            assert.end();
        });
    }
}