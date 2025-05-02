sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageBox',
    "sap/ui/core/format/DateFormat"
], (Controller, ODataModel, Filter, FilterOperator, JSONModel, MessageBox,DateFormat) => {
    "use strict";

    return Controller.extend("com.sap.lh.mr.zvoltagevalidation.controller.Main", {
        onInit() {
            const oView = this.getView();
            oView.setModel(new JSONModel({
				rowMode: "Fixed"
			}), "ui");
        },
        onSearch: function () {
            const oView = this.getView();
            var Equipment = this.getView().byId("idEquipment").getValue();
            if (Equipment === "") {
                return MessageBox.error("Equipment is mandatory...");
            }

            var periodFrom = this.getView().byId("idDTP1").getValue();

            var periodTo = this.getView().byId("idDTP2").getValue();
            if (periodFrom === "" || periodTo === "") {
                return MessageBox.error("Period From and Period To are mandatatory...");
            }
            var fromDate = this.getDateFormat(this.byId("idDTP1").getDateValue());
            var toDate = this.getDateFormat(this.byId("idDTP2").getDateValue());

            var aFilter = [];
            aFilter.push(new Filter("Equipment", FilterOperator.EQ, Equipment));

            aFilter.push(new Filter("Period", FilterOperator.BT, fromDate, toDate));
            var oModel = this.getOwnerComponent().getModel();
            var oJsonModel = new sap.ui.model.json.JSONModel();
            var oBusyDialog = new sap.m.BusyDialog({
                title: "Loading Data",
                text: "Please wait..."
            });
            oBusyDialog.open();
            oModel.read("/OutputSet", {
                filters: aFilter,
                success: function (response) {
                    oBusyDialog.close();
                    oJsonModel.setData(response.results);
                    oView.byId("idTableVolgeVal").setModel(oJsonModel, "VoltageValidationModel");
                },
                error: (oError) => {
                    oBusyDialog.close();
                    console.error("Error:", oError);
                }
            });
        },
        getDateFormat: function (strDate) {
            var oDateFormat = DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-ddTHH:mm:ss" });
            var formatDate = oDateFormat.format(strDate);
            return formatDate;
            //return "datetime" + formatDate ;
        }
    });
});