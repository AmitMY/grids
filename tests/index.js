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


const allowedFrameworks = ["Javascript", "jQuery","Angular1", "Angular2", "React", "Aurelia", "Web Components"];
const allowedFormats = ["CSV", "XLSX"];

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
            assert.equal(typeof info, "object", "Grid's info should be a string");

            // Global information
            assert.equal(typeof info.name, "string", "Grid's info name should be a string");
            assert.equal(typeof info.logo, "string", "Grid's info logo should be a string");
            assert.equal(typeof info.description, "string", "Grid's info description should be a string");
            assert.equal(typeof info.license, "string", "Grid's info license should be a string");
            assert.equal(typeof info.price, "string", "Grid's info price should be a string");
            assert.equal(typeof info.techSupport, "boolean", "Grid's info techSupport should be a boolean");

            // Repository information
            if (info.repository !== null) {
                assert.equal(typeof info.repository, "object", "Grid's info repository should be a string");
                assert.equal(typeof info.repository.link, "string", "Grid's info repository link should be a string");
                assert.equal(typeof info.repository.stars, "number", "Grid's info repository stars should be a number");
            }

            // Website information
            if (info.website !== null) {
                assert.equal(typeof info.website, "object", "Grid's info website should be a object or null");
                assert.equal(typeof info.website.link, "string", "Grid's info website link should be a string");
                assert.equal(typeof info.website.demo, "string", "Grid's info website demo should be a string");
            }

            // Frameworks
            assert.equal(Array.isArray(info.frameworks), true, "Grid's info frameworks should be an array");
            info.frameworks.forEach(framework => {
                if(allowedFrameworks.indexOf(framework) == -1)
                    assert.equal(true, false, framework + " is an unfamiliar framework");
            });

            // Layouts
            assert.equal(Array.isArray(info.layoutThemes), true, "Grid's info layoutThemes should be an array");
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

        test(this.file + " Information should have all properties with the correct types", (assert) => {
            assert.equal(typeof features, "object", "Grid's features should be a string");

            // All booleans
            Object.keys(booleans).forEach(key => {
               if(!booleans[key]) {
                   if (features[key] !== null)
                       assert.equal(typeof features[key], "boolean", "Grid's features " + key + " should be a boolean or null");
               } else
                   assert.equal(typeof features[key], "boolean", "Grid's features " + key + " should be a boolean");
            });


            // Export
            assert.equal(Array.isArray(features.export), true, "Grid's features export should be an array");
            features.export.forEach(format => {
                if(allowedFormats.indexOf(format) == -1)
                    assert.equal(true, false, format + " is an unfamiliar export format");
            });

            assert.end();
        });
    }
}