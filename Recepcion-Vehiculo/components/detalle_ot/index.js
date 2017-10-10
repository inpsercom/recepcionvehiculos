'use strict';

app.detalle_ot = kendo.observable({
    onShow: function () {
        infoDetalleOT();
    },
    afterShow: function () {


    }
});
app.localization.registerView('detalle_ot');

// START_CUSTOM_CODE_home RRP
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes


/*--------------------------------------------------------------------
Fecha: 26/09/2017
Descripcion: Carga el cbo de agencias por empresa y usu.
Parametros:
--------------------------------------------------------------------*/
function infoDetalleOT() {

    localStorage.setItem("ls_verRecepcion", "1");


    // Nombre taller
    document.getElementById("nomTalleres").innerHTML = "<font color='red' style='font-size: 10px'>TALLER:&nbsp; </font><font style='font-size: 10px'>" + localStorage.getItem("ls_nomtall").toLocaleString() + '  </font><br />';

    // Observaciones
    if (localStorage.getItem("ls_otobs").toLocaleString() != "0,") {
        var arrObservacionDet = localStorage.getItem("ls_otobs").toLocaleString().split(",");
        document.getElementById("otObs").innerHTML = "<br /><font color='red' style='font-size: 10px'>OBSERVACIONES:&nbsp; </font><font style='font-size: 10px'>" + arrObservacionDet[1] + '  </font><br />';
    }
    else
    { document.getElementById("otObs").innerHTML = "<br />";}

    var UrlDetalleOT = localStorage.getItem("ls_urldetot").toLocaleString();
    //"http://186.71.21.170:8089/biss.sherloc/Services/SL/Sherloc/Sherloc.svc/Detalle/2,2017,767882";

    var infordet;
    $.ajax({
        url: UrlDetalleOT,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                infordet = (JSON.parse(data.DetalleOTGetResult)).DetalleOT01;
            } catch (e) {
                // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existe el detalle de la Orden de Trabajo");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error de conexi&oacute;n al servicio Orden de Trabajo. Int\u00E9ntelo nuevamente.");
            return;//alert(JSON.stringify(err));
        }
    });


    var descri = (screen.width * 50) / 100;
    var cant = (screen.width * 25) / 100;


    var obs = (screen.width * 9) / 100;
    var fecha = (screen.width * 14) / 100;
    var ot = (screen.width * 17) / 100;
    var taller = (screen.width * 12) / 100;


    $("#gridDetalleOT").kendoGrid({
        dataSource: {
            pageSize: 20,
            data: infordet,
            aggregate: [
                        { field: "Descripcion", aggregate: "count" },
                        { field: "Cantidad", aggregate: "sum" },
                        { field: "Total", aggregate: "sum" }
            ]
        },
        pageable: true,
        //   height: 550,
      
        columns: [
                    { field: "Descripcion", title: "Descripci&oacute;n", footerTemplate: "Total:", width: descri },
                    { field: "Cantidad", title: "Cantidad", width: cant },
                    { field: "Total", format: "{0:c}", title: "Total", footerTemplate: "#= kendo.toString(sum, '0.00') #", width: cant }
        ]
    });




}



function volverOT() {
    

    kendo.mobile.application.navigate("components/lector_barras/view.html");

}


// END_CUSTOM_CODE_home