App = function App() {
};

App.prototype = {

    showZeros: true,
    utilField: "cpu_perc95",
    sortField: "total_cost",
    reportId: null,
    data: null,
    instanceTypes: null,

    filterNames: ['region', 'platform', 'software', 'license_model', 'tenancy', 'enhanced_network', 'family'],

    rangeFilterNames: ['memory_gb', 'price', 'vcpu'],

    currentType: null,

    lookupCounter: 0,

    table: null,

    initialise: function () {

        this.filterNames.forEach((name) => {
            this.loadLookup(name);
            $(`#${name}`).change($.proxy(this.updateUI, this))
        });

        this.rangeFilterNames.forEach((name) => {
            this.loadRangeLookup(name);
            $(`#${name}_min`).change($.proxy(this.updateUI, this))
            $(`#${name}_max`).change($.proxy(this.updateUI, this))
        });

        $("#showdefaults").click($.proxy(this.showDefaults, this));

        $("#cpu").slider({range: true});
        //$('#cpu').change($.proxy(this.updateUI, this));

        $('#memory').slider({range: true});   

        $('#price').slider({range: true});   

    },


    getData: function (request, callback) {
        var resp = null;
        $.ajax({
            type: "GET",
            url: request,
            async: (true),
            data: null,
            success: function (respdata, status) {
                try {
                    resp = respdata;
                } catch (e) {
                    alert("Failed to parse response: " + respdata);
                }
                if (callback != null)
                    callback(resp);
            }
        });

        return resp;
    },

    setDefaults: function() { 
        // $("#region").val("us-east-1");
        // $("#platform").val("Linux");
        // $("#software").val("NA");
        // $("#license_model").val("No License required");

      this.initialiseTable();
    },

    loadLookup: function(field) {
        this.getData(`/lookup?field=${field}`, $.proxy(this.afterLoadLookup, this));
    },

    loadRangeLookup: function(field) {
        this.getData(`/range?field=${field}`, $.proxy(this.afterLoadRangeLookup, this));
    },

    afterLoadLookup: function(data) {
        const field = data.field;
        let values = data.values;

        if (field === 'tenancy') {
            values = values.filter((entry) => entry !== 'Host');
        }

        let el = $(`#${field}`);
        el.empty();

        el.find('option').remove();
        $.each(values, function (ix, entry) {
            var o = $("<option>").text(entry).val(entry);
            el.append(o);
        }); 
        
        this.lookupCounter++;

        if (this.lookupCounter === this.filterNames.length + this.rangeFilterNames.length) {
            this.setDefaults();
        }
    },
    
    afterLoadRangeLookup: function(data) {

        $(`#${data.field}_min`).val(data.min);
        $(`#${data.field}_max`).val(data.max);

        this.lookupCounter++;

        if (this.lookupCounter === this.filterNames.length + this.rangeFilterNames.length) {
            this.setDefaults();
        }
    },

    updateUI: function() {
        this.updateTable();
        // let filterList = this.filterNames.filter((name) => name !== 'instance_type').map((name) => {
        //     return {
        //         field: name,
        //         val: $(`#${name}`).val()
        //     };
        // });
        
        // let filterMap = filterList.reduce((prev, curr) => {
        //     prev[curr.field] = curr.val;
        //     return prev;
        // }, {});

        // if (filterMap.platform === "SUSE" || filterMap.platform === "RHEL") {
        //     $("#software-group").hide();
        //     $("#software").val("NA");
        // } else {
        //     $("#software-group").show();
        // }

        // if (filterMap.software === "NA") {
        //     $("#license_model-group").hide();
        //     $("#license_model").val("No License required");
        // } else {
        //     $("#license_model-group").show();
        // }

        // let query = filterList.reduce((prev, curr) => {
        //     if (curr.val) {
        //         prev += `&${curr.field}=${curr.val}`;
        //     }
        //     return prev;
        // }, "");

        // // These two don't include cpu and mem filters
        // // this.getData("/range?field=memory_gb" + query, $.proxy(this.afterLoadMemRange, this));
        // // this.getData("/range?field=vcpu" + query, $.proxy(this.afterLoadCpuRange, this));

        // const mem = $("#memory").val();
        // if (mem && mem.length === 2) {
        //     if (mem[0]) {
        //         query += `&mem_min=${mem[0]}`;
        //     }
        //     if (mem[1]) {
        //         query += `&mem_max=${mem[1]}`;    
        //     }
        // }

        // const cpu = $("#cpu").val();
        // if (cpu && cpu.length === 2) {
        //     if (cpu[0]) {
        //         query += `&cpu_min=${cpu[0]}`;
        //     }
        //     if (cpu[1]) {
        //         query += `&cpu_max=${cpu[1]}`;    
        //     }
        // }

        // const price = $("#price").val();
        // if (price && price.length === 2) {
        //     if (price[0]) {
        //         query += `&price_min=${price[0]}`;
        //     }
        //     if (price[1]) {
        //         query += `&price_max=${price[1]}`;    
        //     }
        // }

//        this.getData("/count?" + query, $.proxy(this.afterLoadCount, this));
        
        //this.getData("/data?" + query, $.proxy(this.afterLoadData, this));

//        this.getData("/data?" + query + "&instance_type=" + $("#instance_type").val(), $.proxy(this.afterGetCurrent, this));
    },

    afterLoadHierarchy(error, data) {
        this.showPetriChart(data);
    },

    afterGetCurrent(data) { 
        this.currentType = data;
        
    },

    afterLoadCount: function(data) {
        $("#elCount").text(data.count);
    },

    afterLoadData: function(data) {
        if (data.length > 1000) {
            //this.showConstellationChart(data);
        } else {
            this.showColumnChart(data);
            
        }
    },

     afterLoadMemRange: function(data) {
        $("#mem_min").val(data[0]);
        $("#mem_max").val(data[1]);
    },
    
    updateTable: function() {
        this.table.ajax.reload();
    },

    updateCount: function(count) {
        let el = $("#rowCount");
        el.text(`Found ${count} entries`);

        el.css('backgroundColor','hsl(0,100%,50%');

        var d = 100;
        for(var i=50; i<=100; i+=5){ //i represents the lightness
            d  += 10;
            (function(ii,dd){
                setTimeout(function(){
                    el.css('backgroundColor','hsl(0,100%,'+ii+'%)'); 
                }, dd);    
            })(i,d);
        }
    },

    initialiseTable: function() {
        var self = this;


        var table = $("#datatable").DataTable({
            xdom: "rtlip",
            dom: "tp",
            serverSide: true,
            pageLength: 30,
            ajax: function(data, callback) {
                var settings = $("#datatable").DataTable().settings().init();
                var orders = data.order.map(function(order) {
                    var ix = order.column
                    order.column = data.columns[ix].data;
                    order.type = settings.columns[ix].type;
                    return order;
                });

                let filters = {};
                self.filterNames.forEach((name) => {
                    filters[name] = $(`#${name}`).val();
                });
                
                self.rangeFilterNames.forEach((name) => {
                    filters[`${name}_min`] = $(`#${name}_min`).val();
                    filters[`${name}_max`] = $(`#${name}_max`).val();
                });

                $.ajax({
                    url: "/table",
                    dataType: 'json',
                    data: {
                        filters: filters,
                        orders: orders,
                        pageSize: data.length,
                        page: data.start / data.length
                    },
                    success: function(result) {
                        self.updateCount(result.recordsFiltered);
                        callback(result);
                    }
                });
            },
            columns: [
//                {"data": "rate_code"},
                {"title": "Term", "data": "term", "type": "string"},
                {"title": "Price", "data": "price", "type": "num"},
                {"title": "Type", "data": "instance_type"},
                {"title": "Tenancy", "data": "tenancy"},
                {"title": "Platform", "data": "platform"},
                {"title": "License Model", "data": "license_model"},
                {"title": "Software", "data": "software"},
//                {"title": "Unit", "data": "unit"},
//                {"title": "Contract Length", "data": "contract_length"},
//                {"title": "Purchase Option", "data": "purchase_option"},
//                {"data": "usage_type"},
//                {"data": "operation"},
                {"title": "Region", "data": "region"},
                {"title": "Current", "data": "current"},
                {"title": "Family", "data": "family"},
                {"title": "VCPU", "data": "vcpu", "type": "num"},
                {"title": "Network", "data": "network_perf"},
                {"title": "Enhanced Network", "data": "enhanced_network"},
                {"title": "EBS Throughput", "data": "ebs_throughput"},
                {"title": "Memory", "data": "memory_gb", "type": "num"},
                {"title": "Storage", "data": "storage_gb", "type": "num"},
                // {"title": "", "data": "compatibility_hash"},
                // {"title": "", "data": "report_id"},
                // {"title": "", "data": "creation_date"},
                {"title": "ECU", "data": "ecu", "type": "num"},
                //{"title": "ECUNUM", "data": "ecu_num"}
                ],


            order: [[0, 'desc']]
        });

        this.table = table;

    }
};
//******************************************************************************
var app;

function init() {
    app = new App();
    app.initialise();
}
