class InputStore {
    constructor(store) {
        this.tables = store['tables'];
        this.geojsons = store['geojsons'];
        this.columns = store['columns'];
        this.column_types = store['column_types'];
        this.changes = {update:{},delete:{}};

        this.data = {};
        this.geojsondata = {};
        this.selected = [];

        this.generateGeojsonData();
        this.generateData();
    }

    getColumns(table) {
        return this.columns[table]
    }

    getColumnTypes(table) {
        return this.column_types[table]
    }

    getData(table) {
        return this.data[table]
    }

    getDataID(name, building) {
        var table = this.data[name];
        return table.findIndex(x => x['Name'] === building);
    }

    getSelected() {
        return this.selected
    }

    setSelected(array) {
        this.selected = array;
    }

    getGeojson(layer) {
        return this.geojsondata[layer]
    }

    createNewGeojson(layer) {
        this.geojsondata[layer] = JSON.parse(JSON.stringify(this.geojsondata[layer]));
    }

    getGeojsonID(layer, building) {
        var features = this.geojsondata[layer]['features'];
        return features.findIndex(x => x['properties']['Name'] === building);
    }

    // TODO: Process change here, remove change if same as default
    addChange(method, table, building, column, value) {
        var change = {[column]:value};
        if (method === 'update') {
            //Check if update is the same as default
            if (this.tables[table][building][column] === value) {
                delete this.changes[method][table][building][column];
            } else {
                this.changes[method][table] = this.changes[method][table] || {};
                this.changes[method][table][building] = this.changes[method][table][building] || {};
                Object.assign(this.changes[method][table][building], change);
            }
            console.log(this.changes);
        }

    }

    generateGeojsonData() {
        this.geojsondata = JSON.parse(JSON.stringify(this.geojsons));
    }

    generateData() {
        var _this = this;
        $.each(_this.tables, function (property, table) {
            var out = [];
            $.each(table, function (building, columns) {
                out.push({'Name': building, ...columns});
            });
            _this.data[property] = [...out];
        });
    }

    resetChanges() {
        this.changes = {update:{},delete:{}};
        this.generateData();
        this.generateGeojsonData();
    }
}