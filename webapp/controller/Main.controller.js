sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("sap.training.diagram.controller.Main", {
		onInit : function(){
			this.currentVizFrame = "idoVizFrame5";
			this.currentSelectedDimension = "0";
			
			this._createFeedMap();
			this._createDataSetMap();
			
			this._createLineDiagram();
			this._createColumnChart();
			this._createTable();
			
			this._createSelector();
		},
		
		handleSelection: function(oEvent) {
			this.currentSelectedDimension = oEvent.getParameter("selectedItem").getKey();
			this._handleSelection(this.currentSelectedDimension);
		},
		_createSelector: function() {
			var oViewSelector = this.getView().byId("dimSelector");
			var oItemProduct = new sap.ui.core.Item({
				key: "0",
				text: "{i18n>proProdukt}"
			});

			var oItemRegion = new sap.ui.core.Item({
				key: "1",
				text: "{i18n>proRegion}"
			});

			var oItemProductRegion = new sap.ui.core.Item({
				key: "2",
				text: "{i18n>proProdReg}"
			});

			oViewSelector.addItem(oItemProduct);
			oViewSelector.addItem(oItemRegion);
			oViewSelector.addItem(oItemProductRegion);

		},
		_createTable: function() {
			var oTable = this.getView().byId("idoTable");
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({
					text: "Region"
				})
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({
					text: "Sub Region"
				})
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({
					text: "Product name"
				})
			}));
			oTable.addColumn(new sap.m.Column({
				header: new sap.m.Label({
					text: "Sales Amount"
				})
			}));

			var oTableTemplate = new sap.m.ColumnListItem({
				type: sap.m.ListType.Active,
				cells: [new sap.m.Label({
					text: "{SalesModel>REGION_NAME}"
				}), new sap.m.Label({
					text: "{SalesModel>SUB_REGION_NAME}"
				}), new sap.m.Label({
					text: "{SalesModel>PRODUCT_NAME}"
				}), new sap.m.Label({
					text: "{SalesModel>SALES_AMOUNT}"
				})]
			});

			oTable.bindItems("SalesModel>/Verkaufszahlen",
				oTableTemplate, null, null);

		},

		attachContentChange: function(oEvent) {
			var sSelectedVizFrame = oEvent.getParameter("selectedItemId");
			if (sSelectedVizFrame.indexOf("Table") === -1) {
				this.currentVizFrame = sSelectedVizFrame.split("--")[1];
				this._handleSelection(this.currentSelectedDimension);
			}
		},

		_createColumnChart: function() {
			var oVizFrame4 = this.getView().byId("idoVizFrame4");
			oVizFrame4.setDataset(this._createDataSet());
			oVizFrame4.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: true
					}
				},
				title: {
					visible: false
				}
			});
			oVizFrame4.setVizType('column');
		},

		_createLineDiagram: function() {
			var oVizFrame5 = this.getView().byId("idoVizFrame5");
			var pop = this.getView().byId("idoPopoverFrame5");
			oVizFrame5.setDataset(this._createDataSet());
			this._handleSelection(this.currentSelectedDimension);
			oVizFrame5.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: true
					}
				},
				title: {
					visible: false
				}
			});
			oVizFrame5.setVizType('line');
			pop.connect(oVizFrame5.getVizUid());
		},

		_handleSelection: function(selectedItem) {
			switch (selectedItem) {
				case "0":
					{
						var oVizFrame = this.getView().byId(
							this.currentVizFrame);
						var oDataSet = oVizFrame.getDataset();
						oDataSet.removeAllDimensions();
						oDataSet.removeAllMeasures();
						oDataSet.addDimension(
							this.dataSetMap.produktDim);
						oDataSet.addMeasure(this.dataSetMap.verkauszahlenMeasure);
						oVizFrame.removeAllFeeds();
						oVizFrame.addFeed(this.feedMap.produkte);
						oVizFrame
							.addFeed(this.feedMap.verkaufszahlen);

						break;
					}
					case "1": { 
							var oVizFrame = this.getView().byId(
									this.currentVizFrame);
							var oDataSet = oVizFrame.getDataset();
							oDataSet.removeAllDimensions();
							oDataSet.removeAllMeasures();
							oDataSet.addDimension(
									this.dataSetMap.subregionDim);
							oDataSet.addMeasure(this.dataSetMap.verkauszahlenMeasure);
							oVizFrame.removeAllFeeds();
							oVizFrame.addFeed(this.feedMap.subregion);
							oVizFrame
									.addFeed(this.feedMap.verkaufszahlen);

							break;
						}
						case "2": { 
							var oVizFrame = this.getView().byId(
									this.currentVizFrame);
							oVizFrame.getDataset()
									.removeAllDimensions();
							oVizFrame.getDataset().removeAllMeasures();
							oVizFrame.getDataset().addMeasure(this.dataSetMap.verkauszahlenMeasure);
							oVizFrame.getDataset().addDimension(this.dataSetMap.produktDim);							
							oVizFrame.getDataset().addDimension(
									this.dataSetMap.subregionDim);
							oVizFrame.removeAllFeeds();
							oVizFrame.addFeed(this.feedMap.produkte_subregion);							
							oVizFrame
									.addFeed(this.feedMap.verkaufszahlen);

							break;
						}

			}
		},
		
		_createDataSet: function() {
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				data: {
					path: "SalesModel>/Verkaufszahlen"
				}
			});
			return oDataset;
		},

		_createFeedMap:function(){
			this.feedMap = {};

			this.feedMap.verkaufszahlen = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "valueAxis",
				'type': "Measure",
				'values': ["Verkaufszahlen"]
			});

			this.feedMap.produkte = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "categoryAxis",
				'type': "Dimension",
				'values': ["Produkte"]
			});

			this.feedMap.subregion = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "categoryAxis",
				'type': "Dimension",
				'values': ["SUB_REGION_NAME"]
			});

			this.feedMap.produkte_subregion = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "categoryAxis",
				'type': "Dimension",
				'values': ["Produkte", "SUB_REGION_NAME"]
			});

		},
		_createDataSetMap: function() {
			this.dataSetMap = {};
			this.dataSetMap.produktDim = new sap.viz.ui5.data.DimensionDefinition({
				name: "Produkte",
				value: "{SalesModel>PRODUCT_NAME}"
			});
			this.dataSetMap.subregionDim = new sap.viz.ui5.data.DimensionDefinition({
				name: "SUB_REGION_NAME",
				value: "{SalesModel>SUB_REGION_NAME}"
			});
			this.dataSetMap.verkauszahlenMeasure = new sap.viz.ui5.data.MeasureDefinition({
				name: "Verkaufszahlen",
				value: "{SalesModel>SALES_AMOUNT}"
			});
		}
		
	});
});