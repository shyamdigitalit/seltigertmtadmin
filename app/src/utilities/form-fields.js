
const FORM_FIELDS = [
    {
        material: "RMCOL",
        Specification: [ "TOTAL MOISTURE", "INHERENT MOISTURE", "ASH CONTENT", "VOLATILE MATTER", "FIXED CARBON", "TOTAL SULPHER", "GCV", "HGI", "TOTAL PHOSPHOROUS", "MAX FLUIDITY" ],
        LoadPort: ["vessel", "quantity", "initialDraftSurvey", "finalDraftSurvey", "portOfLoading", "cargoDescription", 
            "portOfDischarge", "ourReference", "blNumber", "blDate", "placeOfSampling", "dateOfSampling" ],
        Discharge: ["vessel", "quantityDischarged", "samplingPreparation", "cargoDescription", 
            "portOfDischarge", "dischargePeriod", "blNumber", "blDate", "analysis", "nameAddressOfClient" ],
        RakeTruckLoading: ["vessel", "quantity", "nameAddressOfClient", "commodity", "placeOfSampling", "dateOfSampling", 
            "noOfWagonsTruck" ],
        PlantUnloading: ["samplingPreparation", "nameAddressOfClient", "commodity", "dateOfSampling", "rrNo", "rrQuantity", "location", 
            "samplingMethod" ]
    },
    {
        material: "RMMNO",
        Specification: [ "Mn", "Fe", "SIO2", "P", "S", "Al2o3", "CaO", "MgO", "Na2O", "K2O", "Tests", "Moisture" ],
        LoadPort: [ "outlineAgreementNumber", "vessel", "shipmentNo", "loadingDate", "descriptionOfGoods", "blNumber", "blDate", "dateOfSampling", ],
        Discharge: [ "vessel" ],
        RakeTruckLoading: [ "vessel", "quantity", "nameAddressOfClient", "placeOfSampling", "dateOfSampling" ],
        PlantUnloading: [ "nameAddressOfClient", "dateOfSampling" ]
    },
    {
        material: "RMIRN",
        Specification: [ "Fe", "SIO2", "P", "S", "Ai2o3", "L.O.I", "Fe(T)", "Tests", "Moisture" ],
        LoadPort: [ "outlineAgreementNumber", "quantity", "quantityDischarged", "samplingPreparation", "descriptionOfGoods", "dateOfLoading", "placeOfLoading", "cargoDescription", "destination", "doNumber", "nameAddressOfClient", "placeOfSampling", "dateOfSampling", "dateOfSampleReceipt", "pglReceivedDate", "permitNo" ],
        Discharge: [ "cargoDescription", "nameAddressOfClient" ],
        RakeTruckLoading: [ "quantity", "nameAddressOfClient", "placeOfSampling", "dateOfSampling" ],
        PlantUnloading: [ "samplingPreparation", "nameAddressOfClient", "dateOfSampling", "permitNo", ]
    },
    {
        material: "RMDOL",
        Specification: [ "MgO", "CaO", "SiO2", "S", "R2O3", "LOI" ],
        LoadPort: [ "quantityWeight", "descriptionOfGoods", "nameAddressOfClient", "truckNo" ],
        Discharge: [ "quantityWeight", "nameAddressOfClient" ],
        RakeTruckLoading: [ "quantityWeight", "nameAddressOfClient", "placeOfSampling" ],
        PlantUnloading: [ "quantityWeight", "nameAddressOfClient" ]
    },
    {
        material: "RMCHR",
        Specification: [ "Cr2O3", "SiO2", "Cr:Fe", "Moisture" ],
        LoadPort: [ "partyNameAddress", "letterRefDate", "sampleReceivedOn", "sampleDescribedByParty", "testedToSpecification", "stampedSealBy", "methodTechnique", "truckNo", "dateOfSampling", "noOfTruck", "quantityWeight" ],
        Discharge: [ "partyNameAddress", "sampleReceivedOn", "sampleDescribedByParty", "testedToSpecification", "quantityWeight" ],
        RakeTruckLoading: [ "partyNameAddress", "letterRefDate", "placeOfSampling" ],
        PlantUnloading: [ "testedToSpecification" ]
    },
    {
        material: "RMCOK",
        Specification: [ "VM", "Ash", "FC", "Total Moisture", "Sulpher", "Phosphorus", "CSR", "CRI", "M10", "M40" ],
        LoadPort: [ "vessel", "quantity", "shipper", "portOfLoading", "portOfDischarge", "blDate", "commodity", "packing" ],
        Discharge: [ "vessel", "quantityDischarged", "placeOfSampling", "dateOfSampling" ],
        RakeTruckLoading: [ "vessel", "quantity", "descriptionOfGoods", "nameAddressOfClient", "placeOfSampling", "dateOfSampling", "rakeTruckStack" ],
        PlantUnloading: [ "dateOfSampling", "sampleReceiveDate", "dateOfCollection", "sampleCondition", "samplingMethod" ]
    },
    {
        material: "RMOTH",
        Specification: [ "Carbon", "Phosphorus", "Silicon", "Sulpher", "Manganese", "Al2O3", "Fe2o3", "Cao", "SiO2", "Na2O3", "MgO", "LOI", "TIO", "K2O", "Moisture", "MAX FLUDITY" ],
    },
]



  

export default FORM_FIELDS;